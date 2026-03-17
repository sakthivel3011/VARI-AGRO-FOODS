import type { Timestamp } from "firebase/firestore";

export type UserRole = "customer" | "admin";

export type UserAddress = {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type UserDoc = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role: UserRole;
  addresses: UserAddress[];
  lastLoginAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type ProductDoc = {
  name: string;
  slug: string;
  type: string;
  description: string;
  origin: string;
  cookingQuality: string;
  price: number;
  samplePrice: number;
  weights: string[];
  stock: number;
  ratingAverage: number;
  ratingCount: number;
  popularityScore: number;
  featured: boolean;
  isNewArrival: boolean;
  images: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  weight: string;
};

export type OrderDoc = {
  userId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: "online" | "cod";
  paymentStatus: "pending" | "paid" | "failed";
  status: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
  customerName: string;
  phone: string;
  deliveryAddress: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type ReviewDoc = {
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  mediaUrls: string[];
  moderationStatus: "pending" | "approved" | "rejected";
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type SubscriptionDoc = {
  userId: string;
  plan: "weekly" | "monthly";
  productId: string;
  quantityKg: number;
  pricePerCycle: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: "pending" | "active" | "paused" | "cancelled";
  nextDeliveryAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type MessageDoc = {
  userId?: string;
  anonymousName: string;
  text: string;
  moderationStatus: "pending" | "approved" | "rejected";
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
