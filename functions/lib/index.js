"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.updateUserSubscriptionStatus = exports.createCashOnDeliveryOrder = exports.createStripeSubscriptionCheckout = exports.createStripeCheckoutSession = exports.setAdminRole = void 0;
const https_1 = require("firebase-functions/v2/https");
const options_1 = require("firebase-functions/v2/options");
const logger = __importStar(require("firebase-functions/logger"));
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const stripe_1 = __importDefault(require("stripe"));
(0, app_1.initializeApp)();
(0, options_1.setGlobalOptions)({ region: "asia-south1", maxInstances: 10 });
const db = (0, firestore_1.getFirestore)();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const weeklyPriceId = process.env.STRIPE_PRICE_WEEKLY;
const monthlyPriceId = process.env.STRIPE_PRICE_MONTHLY;
const stripe = stripeSecretKey
    ? new stripe_1.default(stripeSecretKey, {
        apiVersion: "2025-02-24.acacia",
    })
    : null;
const toNumber = (value) => {
    if (typeof value === "number") {
        return value;
    }
    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
};
const normalizeWeight = (weight) => {
    const normalized = String(weight ?? "").trim();
    return normalized.length > 0 ? normalized : "1kg";
};
const resolveOrderItemsFromCatalog = async (payloadItems) => {
    if (!Array.isArray(payloadItems) || payloadItems.length === 0) {
        throw new https_1.HttpsError("invalid-argument", "At least one cart item is required.");
    }
    const productsMap = new Map();
    for (const rawItem of payloadItems) {
        const productId = String(rawItem.productId ?? "").trim();
        const slug = String(rawItem.slug ?? "").trim();
        if (!productId) {
            throw new https_1.HttpsError("invalid-argument", "Invalid product reference.");
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
                throw new https_1.HttpsError("invalid-argument", `Product not found: ${productId}${slug ? ` (${slug})` : ""}`);
            }
            productsMap.set(productId, {
                id: productSnapshot.id,
                data: (productSnapshot.data() ?? {}),
            });
        }
    }
    return payloadItems.map((rawItem) => {
        const requestedProductId = String(rawItem.productId).trim();
        const resolvedProduct = productsMap.get(requestedProductId);
        if (!resolvedProduct) {
            throw new https_1.HttpsError("invalid-argument", `Product not found: ${requestedProductId}`);
        }
        const productId = resolvedProduct.id;
        const product = resolvedProduct.data;
        const quantity = Math.max(1, Math.floor(toNumber(rawItem.quantity)));
        const weight = normalizeWeight(rawItem.weight);
        const image = Array.isArray(product.images) && product.images.length > 0 ? String(product.images[0]) : "";
        const name = String(product.name ?? "Rice Product");
        const weights = Array.isArray(product.weights)
            ? product.weights.map((value) => String(value).toLowerCase())
            : [];
        const lowerWeight = weight.toLowerCase();
        const isSamplePack = lowerWeight.includes("sample");
        if (!isSamplePack && weights.length > 0 && !weights.includes(lowerWeight)) {
            throw new https_1.HttpsError("invalid-argument", `Weight option not available for ${name}.`);
        }
        const unitPrice = isSamplePack ? toNumber(product.samplePrice) : toNumber(product.price);
        if (unitPrice <= 0) {
            throw new https_1.HttpsError("invalid-argument", `Pricing unavailable for ${name}.`);
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
const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const deliveryCharge = subtotal === 0 || subtotal >= 1200 ? 0 : 99;
    const total = subtotal + deliveryCharge;
    return {
        subtotal,
        deliveryCharge,
        total,
    };
};
const getAllowlistedAdminEmails = () => {
    return (process.env.ALLOWED_ADMIN_EMAILS ?? "")
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
};
const getBaseUrl = () => {
    return process.env.PUBLIC_WEB_URL ?? "http://localhost:5173";
};
exports.setAdminRole = (0, https_1.onCall)({ cors: true }, async (request) => {
    const auth = request.auth;
    if (!auth?.token?.email) {
        throw new https_1.HttpsError("unauthenticated", "Login required.");
    }
    const email = String(auth.token.email).toLowerCase();
    const allowlist = getAllowlistedAdminEmails();
    if (!allowlist.includes(email)) {
        throw new https_1.HttpsError("permission-denied", "Email not allowlisted for admin role.");
    }
    await db.collection("users").doc(auth.uid).set({
        role: "admin",
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
    }, { merge: true });
    return { role: "admin" };
});
exports.createStripeCheckoutSession = (0, https_1.onCall)({ cors: true }, async (request) => {
    const auth = request.auth;
    if (!auth?.uid || !auth.token.email) {
        throw new https_1.HttpsError("unauthenticated", "Login required.");
    }
    if (!stripe) {
        throw new https_1.HttpsError("failed-precondition", "Stripe is not configured.");
    }
    const payload = request.data;
    if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
        throw new https_1.HttpsError("invalid-argument", "Cart items are required.");
    }
    const customerName = String(payload.customerName ?? "").trim();
    const phone = String(payload.phone ?? "").trim();
    const deliveryAddress = String(payload.deliveryAddress ?? "").trim();
    if (!customerName || !phone || !deliveryAddress) {
        throw new https_1.HttpsError("invalid-argument", "Customer name, phone, and delivery address are required.");
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
        createdAt: firestore_1.FieldValue.serverTimestamp(),
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
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
exports.createStripeSubscriptionCheckout = (0, https_1.onCall)({ cors: true }, async (request) => {
    const auth = request.auth;
    if (!auth?.uid || !auth.token.email) {
        throw new https_1.HttpsError("unauthenticated", "Login required.");
    }
    if (!stripe) {
        throw new https_1.HttpsError("failed-precondition", "Stripe is not configured.");
    }
    const plan = String(request.data?.plan ?? "").toLowerCase();
    const productId = String(request.data?.productId ?? "tbd-product");
    const quantityKg = Number(request.data?.quantityKg ?? 5);
    const priceId = plan === "weekly" ? weeklyPriceId : plan === "monthly" ? monthlyPriceId : null;
    if (!priceId) {
        throw new https_1.HttpsError("invalid-argument", "Invalid plan or missing Stripe price configuration.");
    }
    if (!productId || productId === "tbd-product") {
        throw new https_1.HttpsError("invalid-argument", "A valid product is required for subscription checkout.");
    }
    if (!Number.isFinite(quantityKg) || quantityKg <= 0) {
        throw new https_1.HttpsError("invalid-argument", "Quantity should be a positive number.");
    }
    let pricePerCycle = 0;
    try {
        const price = await stripe.prices.retrieve(priceId);
        pricePerCycle = price.unit_amount ? Math.round(price.unit_amount / 100) : 0;
    }
    catch (error) {
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
        createdAt: firestore_1.FieldValue.serverTimestamp(),
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
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
exports.createCashOnDeliveryOrder = (0, https_1.onCall)({ cors: true }, async (request) => {
    const auth = request.auth;
    if (!auth?.uid) {
        throw new https_1.HttpsError("unauthenticated", "Login required.");
    }
    const payload = request.data;
    if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
        throw new https_1.HttpsError("invalid-argument", "Cart items are required.");
    }
    const customerName = String(payload.customerName ?? "").trim();
    const phone = String(payload.phone ?? "").trim();
    const deliveryAddress = String(payload.deliveryAddress ?? "").trim();
    if (!customerName || !phone || !deliveryAddress) {
        throw new https_1.HttpsError("invalid-argument", "Customer name, phone, and delivery address are required.");
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
        createdAt: firestore_1.FieldValue.serverTimestamp(),
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return {
        orderId: orderRef.id,
        subtotal: totals.subtotal,
        deliveryCharge: totals.deliveryCharge,
        total: totals.total,
    };
});
exports.updateUserSubscriptionStatus = (0, https_1.onCall)({ cors: true }, async (request) => {
    const auth = request.auth;
    if (!auth?.uid) {
        throw new https_1.HttpsError("unauthenticated", "Login required.");
    }
    const subscriptionId = String(request.data?.subscriptionId ?? "").trim();
    const nextStatus = String(request.data?.status ?? "").toLowerCase();
    if (!subscriptionId) {
        throw new https_1.HttpsError("invalid-argument", "Subscription id is required.");
    }
    if (!["active", "paused", "cancelled"].includes(nextStatus)) {
        throw new https_1.HttpsError("invalid-argument", "Invalid subscription status.");
    }
    const subscriptionRef = db.collection("subscriptions").doc(subscriptionId);
    const snapshot = await subscriptionRef.get();
    if (!snapshot.exists) {
        throw new https_1.HttpsError("not-found", "Subscription not found.");
    }
    const data = snapshot.data() ?? {};
    if (data.userId !== auth.uid) {
        throw new https_1.HttpsError("permission-denied", "You can only manage your own subscription.");
    }
    const currentStatus = String(data.status ?? "pending").toLowerCase();
    const allowedTransitions = {
        pending: ["cancelled"],
        active: ["paused", "cancelled"],
        paused: ["active", "cancelled"],
        cancelled: ["cancelled"],
    };
    if (!allowedTransitions[currentStatus]?.includes(nextStatus)) {
        throw new https_1.HttpsError("failed-precondition", "Invalid subscription status transition.");
    }
    if (!stripe) {
        throw new https_1.HttpsError("failed-precondition", "Stripe is not configured.");
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
    await subscriptionRef.set({
        status: nextStatus,
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
    }, { merge: true });
    return {
        status: nextStatus,
    };
});
exports.stripeWebhook = (0, https_1.onRequest)(async (req, res) => {
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
    let event;
    try {
        const rawBody = req.rawBody;
        if (!rawBody) {
            res.status(400).send("Missing raw request body");
            return;
        }
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    }
    catch (error) {
        logger.error("Stripe signature verification failed", error);
        res.status(400).send("Invalid signature");
        return;
    }
    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const orderId = session.metadata?.orderId;
            const subscriptionDocId = session.metadata?.subscriptionDocId;
            if (orderId) {
                await db.collection("orders").doc(orderId).set({
                    paymentStatus: "paid",
                    status: "processing",
                    stripeSessionId: session.id,
                    updatedAt: firestore_1.FieldValue.serverTimestamp(),
                }, { merge: true });
            }
            if (subscriptionDocId) {
                await db.collection("subscriptions").doc(subscriptionDocId).set({
                    stripeCustomerId: session.customer,
                    stripeSubscriptionId: session.subscription,
                    status: "active",
                    updatedAt: firestore_1.FieldValue.serverTimestamp(),
                }, { merge: true });
            }
        }
        if (event.type === "customer.subscription.deleted") {
            const subscription = event.data.object;
            const snapshot = await db
                .collection("subscriptions")
                .where("stripeSubscriptionId", "==", subscription.id)
                .limit(1)
                .get();
            if (!snapshot.empty) {
                await snapshot.docs[0].ref.set({
                    status: "cancelled",
                    updatedAt: firestore_1.FieldValue.serverTimestamp(),
                }, { merge: true });
            }
        }
        res.status(200).json({ received: true });
    }
    catch (error) {
        logger.error("Webhook processing failed", error);
        res.status(500).send("Webhook processing failed");
    }
});
