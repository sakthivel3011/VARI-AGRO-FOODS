import type { CatalogProduct } from "@/types/product";
import { getTrackingSnapshot } from "@/services/orderTracking";

export type ChatbotAnswer = {
  text: string;
  suggestions?: string[];
};

type ChatbotContext = {
  products: CatalogProduct[];
};

const averagePrice = (products: CatalogProduct[]): number => {
  if (products.length === 0) {
    return 0;
  }

  const total = products.reduce((sum, product) => sum + product.price, 0);
  return Math.round(total / products.length);
};

export const answerChatbotQuestion = (input: string, context: ChatbotContext): ChatbotAnswer => {
  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return {
      text: "Hi! Ask me about rice types, prices, delivery, subscriptions, order status, or payments.",
      suggestions: [
        "Show me premium basmati",
        "What are delivery timelines?",
        "How does subscription work?",
      ],
    };
  }

  if (normalized.includes("rice type") || normalized.includes("which rice") || normalized.includes("best rice")) {
    const types = [...new Set(context.products.map((product) => product.type))].slice(0, 6);
    return {
      text: `We currently offer ${types.join(", ")}. For biryani, customers usually prefer Royal Basmati Gold.`,
      suggestions: ["Show basmati options", "Do you have brown rice?"],
    };
  }

  if (normalized.includes("price") || normalized.includes("cost") || normalized.includes("cheap")) {
    const avg = averagePrice(context.products);
    const min = Math.min(...context.products.map((product) => product.price));
    const max = Math.max(...context.products.map((product) => product.price));
    return {
      text: `Our rice range is typically ₹${min.toLocaleString()} to ₹${max.toLocaleString()} (avg around ₹${avg.toLocaleString()}). You can also buy 1kg sample packs at lower prices.`,
      suggestions: ["Show sample packs", "Sort by price"],
    };
  }

  if (normalized.includes("delivery") || normalized.includes("ship") || normalized.includes("arrive")) {
    return {
      text: "Most deliveries arrive within 2-4 business days in metro cities. Subscription customers receive prioritized dispatch.",
      suggestions: ["How much is delivery charge?", "Do you deliver weekly?"],
    };
  }

  if (normalized.includes("subscription") || normalized.includes("weekly") || normalized.includes("monthly")) {
    return {
      text: "You can choose weekly or monthly subscription plans. Billing is automatic through Stripe, and you can pause/resume from your dashboard.",
      suggestions: ["Open subscription plans", "Can I cancel anytime?"],
    };
  }

  if (normalized.includes("order status") || normalized.includes("track order") || normalized.includes("my order")) {
    return {
      text: "After placing an order, you can track it from Dashboard > My Orders. Online payments update automatically after successful checkout.",
      suggestions: ["Go to my orders", "How long does processing take?"],
    };
  }

  if (normalized.includes("payment") || normalized.includes("cod") || normalized.includes("online")) {
    return {
      text: "We support Online Payment (Stripe) and Cash on Delivery. Subscription plans are billed online only.",
      suggestions: ["Is COD available everywhere?", "How secure is online payment?"],
    };
  }

  return {
    text: "I can help with rice types, pricing, delivery, subscriptions, order tracking, and payment options. What do you want to know?",
    suggestions: ["Rice types", "Pricing", "Delivery", "Subscriptions"],
  };
};

export const answerChatbotQuestionAsync = async (
  input: string,
  context: ChatbotContext,
): Promise<ChatbotAnswer> => {
  const normalized = input.trim().toLowerCase();

  const orderIdMatch = normalized.match(/order\s*(id)?\s*[:#-]?\s*([a-z0-9_-]{6,})/i);
  if ((normalized.includes("order status") || normalized.includes("track order")) && orderIdMatch) {
    const orderId = orderIdMatch[2];
    const snapshot = await getTrackingSnapshot(orderId);

    return {
      text: `Tracking update for ${orderId}: ${snapshot}`,
      suggestions: ["How long does delivery take?", "What payment options are available?"],
    };
  }

  return answerChatbotQuestion(input, context);
};
