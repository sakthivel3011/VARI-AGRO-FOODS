import { httpsCallable } from "firebase/functions";
import { functions } from "@/config/firebase";
import type { CartItem } from "@/types/product";

type CreateStripeCheckoutPayload = {
  customerName: string;
  phone: string;
  deliveryAddress: string;
  items: CartItem[];
};

type CreateStripeCheckoutResponse = {
  orderId: string;
  checkoutUrl: string;
};

type CreateStripeSubscriptionResponse = {
  subscriptionId: string;
  checkoutUrl: string;
};

export const createStripeCheckoutSession = async (
  payload: CreateStripeCheckoutPayload,
): Promise<CreateStripeCheckoutResponse> => {
  const fn = httpsCallable(functions, "createStripeCheckoutSession");

  const response = await fn({
    customerName: payload.customerName,
    phone: payload.phone,
    deliveryAddress: payload.deliveryAddress,
    items: payload.items.map((item) => ({
      productId: item.productId,
      slug: item.slug,
      quantity: item.quantity,
      weight: item.weight,
    })),
  });

  return response.data as CreateStripeCheckoutResponse;
};

export const createStripeSubscriptionCheckout = async (
  plan: "weekly" | "monthly",
  productId = "tbd-product",
  quantityKg = 5,
): Promise<CreateStripeSubscriptionResponse> => {
  const fn = httpsCallable(functions, "createStripeSubscriptionCheckout");
  const response = await fn({
    plan,
    productId,
    quantityKg,
  });

  return response.data as CreateStripeSubscriptionResponse;
};
