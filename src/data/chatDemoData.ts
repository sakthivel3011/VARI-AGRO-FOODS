import { Timestamp } from "firebase/firestore";
import type { MessageRecord } from "@/services/chat";

export type DemoChatbotMessage = {
  role: "user" | "bot";
  text: string;
};

export const chatbotStarterMessages: DemoChatbotMessage[] = [
  {
    role: "bot",
    text: "Hi! I can help with rice types, prices, delivery timelines, subscriptions, order status, and payment options.",
  },
  {
    role: "user",
    text: "What are your best selling rice options?",
  },
  {
    role: "bot",
    text: "Top picks are Royal Basmati Gold, Sona Masoori Classic, and Organic Brown Rice. I can suggest by budget or cooking style too.",
  },
];

export const chatbotSuggestedQuestions: string[] = [
  "Show premium rice options",
  "What are delivery timelines?",
  "How does subscription work?",
  "Is cash on delivery available?",
];

export const communitySampleMessages: MessageRecord[] = [
  {
    id: "community-demo-1",
    data: {
      userId: "demo-user-1",
      anonymousName: "RiceFan-1024",
      text: "Tried Royal Basmati Gold this week. Aroma and texture were excellent.",
      moderationStatus: "approved",
      createdAt: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 45)),
      updatedAt: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 45)),
    },
  },
  {
    id: "community-demo-2",
    data: {
      userId: "demo-user-2",
      anonymousName: "KitchenPro-2201",
      text: "Sona Masoori cooked soft and light. Good for daily meals.",
      moderationStatus: "approved",
      createdAt: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 30)),
      updatedAt: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 30)),
    },
  },
  {
    id: "community-demo-3",
    data: {
      userId: "demo-user-3",
      anonymousName: "HomeChef-7789",
      text: "Delivery reached in 2 days. Packaging was clean and secure.",
      moderationStatus: "approved",
      createdAt: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 12)),
      updatedAt: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 12)),
    },
  },
];
