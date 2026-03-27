import type { MessageRecord } from "@/services/chat";
import type { OrderRecord } from "@/services/orders";
import type { ReviewRecord } from "@/services/reviews";
import type { UserRecord } from "@/services/users";
import type { DailyMetric, TopProductMetric, UserActivityMetric } from "@/services/adminAnalytics";
import { Timestamp } from "firebase/firestore";

const fakeTimestamp = (daysAgo = 0): Timestamp => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return Timestamp.fromDate(date);
};

export const demoOrders: OrderRecord[] = [
  {
    id: "demo-order-1",
    data: {
      userId: "demo-user-1",
      items: [
        {
          productId: "demo-product-1",
          name: "Royal Basmati Gold",
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
          unitPrice: 499,
          quantity: 2,
          weight: "5kg",
        },
      ],
      subtotal: 998,
      deliveryCharge: 0,
      total: 998,
      paymentMethod: "cod",
      paymentStatus: "pending",
      status: "processing",
      customerName: "Demo Customer",
      phone: "9000000001",
      deliveryAddress: "135 Mariamman Kovil Street, Chennai",
      createdAt: fakeTimestamp(1),
      updatedAt: fakeTimestamp(0),
    },
  },
  {
    id: "demo-order-2",
    data: {
      userId: "demo-user-2",
      items: [
        {
          productId: "demo-product-2",
          name: "Sona Masoori Classic",
          image: "https://images.unsplash.com/photo-1586201375799-c74f6f6c2f6c?auto=format&fit=crop&w=600&q=80",
          unitPrice: 399,
          quantity: 1,
          weight: "5kg",
        },
      ],
      subtotal: 399,
      deliveryCharge: 99,
      total: 498,
      paymentMethod: "cod",
      paymentStatus: "pending",
      status: "placed",
      customerName: "Demo Buyer",
      phone: "9000000002",
      deliveryAddress: "12 Anna Salai, Chennai",
      createdAt: fakeTimestamp(2),
      updatedAt: fakeTimestamp(1),
    },
  },
];

export const demoUsers: UserRecord[] = [
  {
    id: "demo-user-1",
    data: {
      uid: "demo-user-1",
      email: "customer1@demo.com",
      displayName: "Demo Customer",
      photoURL: "",
      phoneNumber: "9000000001",
      role: "customer",
      addresses: [],
      createdAt: fakeTimestamp(10),
      updatedAt: fakeTimestamp(0),
    },
  },
  {
    id: "demo-user-2",
    data: {
      uid: "demo-user-2",
      email: "customer2@demo.com",
      displayName: "Demo Buyer",
      photoURL: "",
      phoneNumber: "9000000002",
      role: "customer",
      addresses: [],
      createdAt: fakeTimestamp(12),
      updatedAt: fakeTimestamp(0),
    },
  },
  {
    id: "demo-admin-1",
    data: {
      uid: "demo-admin-1",
      email: "admin@demo.com",
      displayName: "Demo Admin",
      photoURL: "",
      phoneNumber: "9000000009",
      role: "admin",
      addresses: [],
      createdAt: fakeTimestamp(20),
      updatedAt: fakeTimestamp(0),
    },
  },
];

export const demoReviews: ReviewRecord[] = [
  {
    id: "demo-review-1",
    data: {
      productId: "demo-product-1",
      userId: "demo-user-1",
      userName: "Demo Customer",
      rating: 5,
      text: "Excellent aroma and grain quality. Great for family meals.",
      mediaUrls: [],
      moderationStatus: "pending",
      createdAt: fakeTimestamp(1),
      updatedAt: fakeTimestamp(1),
    },
  },
  {
    id: "demo-review-2",
    data: {
      productId: "demo-product-2",
      userId: "demo-user-2",
      userName: "Demo Buyer",
      rating: 4,
      text: "Good value for daily cooking. Clean packaging and fast delivery.",
      mediaUrls: [],
      moderationStatus: "pending",
      createdAt: fakeTimestamp(3),
      updatedAt: fakeTimestamp(3),
    },
  },
];

export const demoMessages: MessageRecord[] = [
  {
    id: "demo-message-1",
    data: {
      userId: "demo-user-1",
      anonymousName: "Rice Lover",
      text: "Please add more 10kg packs for weekend orders.",
      moderationStatus: "pending",
      createdAt: fakeTimestamp(0),
      updatedAt: fakeTimestamp(0),
    },
  },
  {
    id: "demo-message-2",
    data: {
      userId: "demo-user-2",
      anonymousName: "KitchenPro",
      text: "Do you have monthly subscription with mixed rice options?",
      moderationStatus: "pending",
      createdAt: fakeTimestamp(2),
      updatedAt: fakeTimestamp(2),
    },
  },
];

export const demoDailyMetrics: DailyMetric[] = [
  { day: "Mar 18", orders: 2, revenue: 1299 },
  { day: "Mar 19", orders: 3, revenue: 1898 },
  { day: "Mar 20", orders: 1, revenue: 499 },
  { day: "Mar 21", orders: 4, revenue: 2596 },
  { day: "Mar 22", orders: 2, revenue: 1297 },
  { day: "Mar 23", orders: 3, revenue: 1997 },
  { day: "Mar 24", orders: 2, revenue: 1098 },
  { day: "Mar 25", orders: 5, revenue: 3395 },
  { day: "Mar 26", orders: 3, revenue: 1898 },
  { day: "Mar 27", orders: 4, revenue: 2596 },
];

export const demoTopProducts: TopProductMetric[] = [
  { name: "Royal Basmati Gold", units: 24, revenue: 11976 },
  { name: "Sona Masoori Classic", units: 19, revenue: 7581 },
  { name: "Organic Brown Rice", units: 14, revenue: 5590 },
  { name: "Ponni Premium", units: 12, revenue: 4788 },
  { name: "Traditional Red Rice", units: 9, revenue: 4041 },
];

export const demoUserActivity: UserActivityMetric[] = [
  { day: "Mar 18", activeUsers: 4 },
  { day: "Mar 19", activeUsers: 7 },
  { day: "Mar 20", activeUsers: 3 },
  { day: "Mar 21", activeUsers: 8 },
  { day: "Mar 22", activeUsers: 5 },
  { day: "Mar 23", activeUsers: 6 },
  { day: "Mar 24", activeUsers: 4 },
  { day: "Mar 25", activeUsers: 9 },
  { day: "Mar 26", activeUsers: 6 },
  { day: "Mar 27", activeUsers: 8 },
];
