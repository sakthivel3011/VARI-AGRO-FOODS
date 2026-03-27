import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2/options";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import type { Request, Response } from "express";
import Stripe from "stripe";

initializeApp();
setGlobalOptions({ region: "asia-south1", maxInstances: 10 });

const db = getFirestore();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const weeklyPriceId = process.env.STRIPE_PRICE_WEEKLY;
const monthlyPriceId = process.env.STRIPE_PRICE_MONTHLY;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia",
    })
  : null;

type CheckoutOrderPayload = {
  customerName: string;
  phone: string;
  deliveryAddress: string;
  items: Array<{
    productId: string;
    slug?: string;
    quantity: number;
    weight: string;
  }>;
};

type CashOnDeliveryOrderPayload = {
  customerName: string;
  phone: string;
  deliveryAddress: string;
  items: Array<{
    productId: string;
    slug?: string;
    quantity: number;
    weight: string;
  }>;
};

type CanonicalOrderLine = {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  weight: string;
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const normalizeWeight = (weight: string | undefined): string => {
  const normalized = String(weight ?? "").trim();
  return normalized.length > 0 ? normalized : "1kg";
};

const resolveOrderItemsFromCatalog = async (
  payloadItems: Array<{
    productId: string;
    slug?: string;
    quantity: number;
    weight?: string;
  }>,
): Promise<CanonicalOrderLine[]> => {
  if (!Array.isArray(payloadItems) || payloadItems.length === 0) {
    throw new HttpsError("invalid-argument", "At least one cart item is required.");
  }

  const productsMap = new Map<string, { id: string; data: Record<string, unknown> }>();

  for (const rawItem of payloadItems) {
    const productId = String(rawItem.productId ?? "").trim();
    const slug = String(rawItem.slug ?? "").trim();
    if (!productId) {
      throw new HttpsError("invalid-argument", "Invalid product reference.");
    }

    if (!productsMap.has(productId)) {
      let productSnapshot = await db.collection("products").doc(productId).get();

      if (!productSnapshot.exists && slug) {
        const bySlugSnapshot = await db
          .collection("products")
          .where("slug", "==", slug)
          .limit(1)
          .get();

        if (!bySlugSnapshot.empty) {
          productSnapshot = bySlugSnapshot.docs[0];
        }
      }

      if (!productSnapshot.exists) {
        throw new HttpsError("invalid-argument", `Product not found: ${productId}${slug ? ` (${slug})` : ""}`);
      }

      productsMap.set(productId, {
        id: productSnapshot.id,
        data: (productSnapshot.data() ?? {}) as Record<string, unknown>,
      });
    }
  }

  return payloadItems.map((rawItem) => {
    const requestedProductId = String(rawItem.productId).trim();
    const resolvedProduct = productsMap.get(requestedProductId);
    if (!resolvedProduct) {
      throw new HttpsError("invalid-argument", `Product not found: ${requestedProductId}`);
    }

    const productId = resolvedProduct.id;
    const product = resolvedProduct.data;

    const quantity = Math.max(1, Math.floor(toNumber(rawItem.quantity)));
    const weight = normalizeWeight(rawItem.weight);
    const image = Array.isArray(product.images) && product.images.length > 0 ? String(product.images[0]) : "";
    const name = String(product.name ?? "Rice Product");

    const weights = Array.isArray(product.weights)
      ? product.weights.map((value: unknown) => String(value).toLowerCase())
      : [];
    const lowerWeight = weight.toLowerCase();
    const isSamplePack = lowerWeight.includes("sample");

    if (!isSamplePack && weights.length > 0 && !weights.includes(lowerWeight)) {
      throw new HttpsError("invalid-argument", `Weight option not available for ${name}.`);
    }

    const unitPrice = isSamplePack ? toNumber(product.samplePrice) : toNumber(product.price);

    if (unitPrice <= 0) {
      throw new HttpsError("invalid-argument", `Pricing unavailable for ${name}.`);
    }

    return {
      productId,
      name,
      image,
      unitPrice,
      quantity,
      weight,
    };
  });
};

const calculateTotals = (items: CanonicalOrderLine[]): {
  subtotal: number;
  deliveryCharge: number;
  total: number;
} => {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryCharge = subtotal === 0 || subtotal >= 1200 ? 0 : 99;
  const total = subtotal + deliveryCharge;

  return {
    subtotal,
    deliveryCharge,
    total,
  };
};

const getAllowlistedAdminEmails = (): string[] => {
  return (process.env.ALLOWED_ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
};

const getBaseUrl = (): string => {
  return process.env.PUBLIC_WEB_URL ?? "http://localhost:5173";
};

export const setAdminRole = onCall({ cors: true }, async (request) => {
  const auth = request.auth;
  if (!auth?.token?.email) {
    throw new HttpsError("unauthenticated", "Login required.");
  }

  const email = String(auth.token.email).toLowerCase();
  const allowlist = getAllowlistedAdminEmails();
  if (!allowlist.includes(email)) {
    throw new HttpsError("permission-denied", "Email not allowlisted for admin role.");
  }

  await db.collection("users").doc(auth.uid).set(
    {
      role: "admin",
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return { role: "admin" };
});

export const createStripeCheckoutSession = onCall({ cors: true }, async (request) => {
  const auth = request.auth;
  if (!auth?.uid || !auth.token.email) {
    throw new HttpsError("unauthenticated", "Login required.");
  }

  if (!stripe) {
    throw new HttpsError("failed-precondition", "Stripe is not configured.");
  }

  const payload = request.data as CheckoutOrderPayload;
  if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
    throw new HttpsError("invalid-argument", "Cart items are required.");
  }

  const customerName = String(payload.customerName ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
  const deliveryAddress = String(payload.deliveryAddress ?? "").trim();

  if (!customerName || !phone || !deliveryAddress) {
    throw new HttpsError("invalid-argument", "Customer name, phone, and delivery address are required.");
  }

  const canonicalItems = await resolveOrderItemsFromCatalog(payload.items);
  const totals = calculateTotals(canonicalItems);

  const uid = auth.uid;
  const orderRef = db.collection("orders").doc();

  await orderRef.set({
    userId: uid,
    items: canonicalItems,
    subtotal: totals.subtotal,
    deliveryCharge: totals.deliveryCharge,
    total: totals.total,
    paymentMethod: "online",
    paymentStatus: "pending",
    status: "placed",
    customerName,
    phone,
    deliveryAddress,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: String(auth.token.email),
    line_items: canonicalItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "inr",
        unit_amount: Math.round(item.unitPrice * 100),
        product_data: {
          name: `${item.name} (${item.weight})`,
          images: item.image ? [item.image] : undefined,
        },
      },
    })),
    metadata: {
      orderId: orderRef.id,
      uid,
    },
    success_url: `${getBaseUrl()}/order-success/${orderRef.id}`,
    cancel_url: `${getBaseUrl()}/checkout`,
  });

  return {
    orderId: orderRef.id,
    checkoutUrl: session.url,
  };
});

export const createStripeSubscriptionCheckout = onCall({ cors: true }, async (request) => {
  const auth = request.auth;
  if (!auth?.uid || !auth.token.email) {
    throw new HttpsError("unauthenticated", "Login required.");
  }

  if (!stripe) {
    throw new HttpsError("failed-precondition", "Stripe is not configured.");
  }

  const plan = String(request.data?.plan ?? "").toLowerCase();
  const productId = String(request.data?.productId ?? "tbd-product");
  const quantityKg = Number(request.data?.quantityKg ?? 5);

  const priceId = plan === "weekly" ? weeklyPriceId : plan === "monthly" ? monthlyPriceId : null;
  if (!priceId) {
    throw new HttpsError("invalid-argument", "Invalid plan or missing Stripe price configuration.");
  }

  if (!productId || productId === "tbd-product") {
    throw new HttpsError("invalid-argument", "A valid product is required for subscription checkout.");
  }

  if (!Number.isFinite(quantityKg) || quantityKg <= 0) {
    throw new HttpsError("invalid-argument", "Quantity should be a positive number.");
  }

  let pricePerCycle = 0;
  try {
    const price = await stripe.prices.retrieve(priceId);
    pricePerCycle = price.unit_amount ? Math.round(price.unit_amount / 100) : 0;
  } catch (error) {
    logger.warn("Unable to resolve Stripe price amount", error);
  }

  const subRef = db.collection("subscriptions").doc();
  await subRef.set({
    userId: auth.uid,
    plan,
    productId,
    quantityKg,
    pricePerCycle,
    status: "pending",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: String(auth.token.email),
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      subscriptionDocId: subRef.id,
      uid: auth.uid,
      plan,
    },
    success_url: `${getBaseUrl()}/dashboard/subscriptions`,
    cancel_url: `${getBaseUrl()}/subscription`,
  });

  return {
    subscriptionId: subRef.id,
    checkoutUrl: session.url,
  };
});

export const createCashOnDeliveryOrder = onCall({ cors: true }, async (request) => {
  const auth = request.auth;
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Login required.");
  }

  const payload = request.data as CashOnDeliveryOrderPayload;
  if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
    throw new HttpsError("invalid-argument", "Cart items are required.");
  }

  const customerName = String(payload.customerName ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
  const deliveryAddress = String(payload.deliveryAddress ?? "").trim();

  if (!customerName || !phone || !deliveryAddress) {
    throw new HttpsError("invalid-argument", "Customer name, phone, and delivery address are required.");
  }

  const canonicalItems = await resolveOrderItemsFromCatalog(payload.items);
  const totals = calculateTotals(canonicalItems);
  const orderRef = db.collection("orders").doc();

  await orderRef.set({
    userId: auth.uid,
    items: canonicalItems,
    subtotal: totals.subtotal,
    deliveryCharge: totals.deliveryCharge,
    total: totals.total,
    paymentMethod: "cod",
    paymentStatus: "pending",
    status: "placed",
    customerName,
    phone,
    deliveryAddress,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    orderId: orderRef.id,
    subtotal: totals.subtotal,
    deliveryCharge: totals.deliveryCharge,
    total: totals.total,
  };
});

export const updateUserSubscriptionStatus = onCall({ cors: true }, async (request) => {
  const auth = request.auth;
  if (!auth?.uid) {
    throw new HttpsError("unauthenticated", "Login required.");
  }

  const subscriptionId = String(request.data?.subscriptionId ?? "").trim();
  const nextStatus = String(request.data?.status ?? "").toLowerCase();

  if (!subscriptionId) {
    throw new HttpsError("invalid-argument", "Subscription id is required.");
  }

  if (!["active", "paused", "cancelled"].includes(nextStatus)) {
    throw new HttpsError("invalid-argument", "Invalid subscription status.");
  }

  const subscriptionRef = db.collection("subscriptions").doc(subscriptionId);
  const snapshot = await subscriptionRef.get();

  if (!snapshot.exists) {
    throw new HttpsError("not-found", "Subscription not found.");
  }

  const data = snapshot.data() ?? {};
  if (data.userId !== auth.uid) {
    throw new HttpsError("permission-denied", "You can only manage your own subscription.");
  }

  const currentStatus = String(data.status ?? "pending").toLowerCase();
  const allowedTransitions: Record<string, string[]> = {
    pending: ["cancelled"],
    active: ["paused", "cancelled"],
    paused: ["active", "cancelled"],
    cancelled: ["cancelled"],
  };

  if (!allowedTransitions[currentStatus]?.includes(nextStatus)) {
    throw new HttpsError("failed-precondition", "Invalid subscription status transition.");
  }

  if (!stripe) {
    throw new HttpsError("failed-precondition", "Stripe is not configured.");
  }

  const stripeSubscriptionId = String(data.stripeSubscriptionId ?? "").trim();

  if (stripeSubscriptionId) {
    if (nextStatus === "paused") {
      await stripe.subscriptions.update(stripeSubscriptionId, {
        pause_collection: {
          behavior: "void",
        },
      });
    }

    if (nextStatus === "active") {
      await stripe.subscriptions.update(stripeSubscriptionId, {
        pause_collection: null,
      });
    }

    if (nextStatus === "cancelled") {
      await stripe.subscriptions.cancel(stripeSubscriptionId);
    }
  }

  await subscriptionRef.set(
    {
      status: nextStatus,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return {
    status: nextStatus,
  };
});

export const stripeWebhook = onRequest(async (req: Request, res: Response) => {
  if (!stripe || !webhookSecret) {
    logger.error("Stripe webhook requested but Stripe is not configured.");
    res.status(500).send("Stripe not configured");
    return;
  }

  const signature = req.headers["stripe-signature"];
  if (!signature || typeof signature !== "string") {
    res.status(400).send("Missing stripe-signature header");
    return;
  }

  let event: Stripe.Event;

  try {
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
    if (!rawBody) {
      res.status(400).send("Missing raw request body");
      return;
    }

    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    logger.error("Stripe signature verification failed", error);
    res.status(400).send("Invalid signature");
    return;
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const subscriptionDocId = session.metadata?.subscriptionDocId;

      if (orderId) {
        await db.collection("orders").doc(orderId).set(
          {
            paymentStatus: "paid",
            status: "processing",
            stripeSessionId: session.id,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      }

      if (subscriptionDocId) {
        await db.collection("subscriptions").doc(subscriptionDocId).set(
          {
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            status: "active",
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const snapshot = await db
        .collection("subscriptions")
        .where("stripeSubscriptionId", "==", subscription.id)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        await snapshot.docs[0].ref.set(
          {
            status: "cancelled",
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    logger.error("Webhook processing failed", error);
    res.status(500).send("Webhook processing failed");
  }
});
