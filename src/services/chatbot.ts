import type { CatalogProduct } from "@/types/product";
import { getTrackingSnapshot } from "@/services/orderTracking";

export type ChatbotAnswer = {
  text: string;
  suggestions?: string[];
};

type ChatbotContext = {
  products: CatalogProduct[];
};

const WEBSITE_ONLY_REFUSAL =
  "I can only help with Vari Agro Foods website details like products, pricing, delivery, subscriptions, order tracking, and payments.";

const GREETING_PATTERN = /^(hi|hii+|hello|hey|namaste|good morning|good afternoon|good evening)$/;
const WEBSITE_SCOPE_PATTERN =
  /(vari agro|website|site|product|rice|basmati|price|cost|payment|cod|delivery|shipping|shipment|track|order|checkout|cart|subscription|plan|review|contact|about|account|login|signup|dashboard|address|refund|cancel|support|help)/;

const groqApiKey = import.meta.env.VITE_GROQ_API_KEY?.trim() ?? "";
const groqModel = import.meta.env.VITE_GROQ_MODEL?.trim() || "llama-3.1-8b-instant";

const isGreeting = (compact: string): boolean => {
  return GREETING_PATTERN.test(compact) || /^(hi|hii+|hello|hey)\b/.test(compact);
};

const isWebsiteScopedQuestion = (normalized: string, compact: string): boolean => {
  if (isGreeting(compact)) {
    return true;
  }

  return WEBSITE_SCOPE_PATTERN.test(normalized);
};

const getCatalogSummary = (products: CatalogProduct[]): string => {
  if (products.length === 0) {
    return "No catalog snapshot available.";
  }

  const types = [...new Set(products.map((product) => product.type))]
    .filter(Boolean)
    .slice(0, 8)
    .join(", ");
  const sampleProducts = products
    .slice(0, 8)
    .map((product) => `${product.name} (Rs ${product.price})`)
    .join(", ");

  return `Catalog types: ${types || "N/A"}. Example products: ${sampleProducts}.`;
};

const queryGroqWebsiteAssistant = async (
  question: string,
  context: ChatbotContext,
): Promise<ChatbotAnswer | null> => {
  if (!groqApiKey) {
    return null;
  }

  const catalogSummary = getCatalogSummary(context.products);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model: groqModel,
      temperature: 0.1,
      max_tokens: 220,
      messages: [
        {
          role: "system",
          content:
            "You are the Vari Agro Foods website assistant. Answer only about this website's products, pricing, delivery, subscriptions, order tracking, checkout, and payments. If the user asks anything outside website scope, reply with this exact sentence: " +
            WEBSITE_ONLY_REFUSAL,
        },
        {
          role: "system",
          content:
            "Website facts: Vari Agro Foods sells rice products, supports online payment via Stripe and cash on delivery, and allows order tracking from dashboard orders.",
        },
        {
          role: "system",
          content: `Catalog snapshot: ${catalogSummary}`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = payload.choices?.[0]?.message?.content?.trim();
  if (!text) {
    return null;
  }

  return {
    text,
    suggestions: ["Show premium rice options", "What are delivery timelines?", "How does subscription work?"],
  };
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
  const compact = normalized.replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();

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

  if (isGreeting(compact)) {
    return {
      text: "Hi! Welcome to Vari Agro Foods. I can help with products, pricing, delivery, subscriptions, order status, and payments.",
      suggestions: ["Show premium rice", "What are delivery timelines?", "How does subscription work?"],
    };
  }

  if (
    compact.includes("project") ||
    compact.includes("about project") ||
    compact.includes("about vari agro") ||
    compact.includes("about company")
  ) {
    return {
      text: "Vari Agro Foods is a premium rice commerce project focused on quality grains, transparent pricing, online ordering, subscriptions, and order tracking in one platform.",
      suggestions: ["Show product categories", "How to place an order?", "Tell me about subscriptions"],
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

  if (!isWebsiteScopedQuestion(normalized, compact)) {
    return {
      text: WEBSITE_ONLY_REFUSAL,
      suggestions: ["Show products", "What are delivery timelines?", "Track my order"],
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
  const compact = normalized.replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();

  const orderIdMatch = normalized.match(/order\s*(id)?\s*[:#-]?\s*([a-z0-9_-]{6,})/i);
  if ((normalized.includes("order status") || normalized.includes("track order")) && orderIdMatch) {
    const orderId = orderIdMatch[2];
    const snapshot = await getTrackingSnapshot(orderId);

    return {
      text: `Tracking update for ${orderId}: ${snapshot}`,
      suggestions: ["How long does delivery take?", "What payment options are available?"],
    };
  }

  if (!isWebsiteScopedQuestion(normalized, compact)) {
    return {
      text: WEBSITE_ONLY_REFUSAL,
      suggestions: ["Show products", "Pricing", "Delivery", "Subscription plans"],
    };
  }

  try {
    const llmAnswer = await queryGroqWebsiteAssistant(input, context);
    if (llmAnswer) {
      return llmAnswer;
    }
  } catch {
    // Fall back to deterministic local response rules when external API fails.
  }

  return answerChatbotQuestion(input, context);
};
