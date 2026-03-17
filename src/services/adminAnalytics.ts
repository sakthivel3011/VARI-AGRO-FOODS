import { getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/config/firebase";
import { collections } from "@/services/firestorePaths";
import { countUsers } from "@/services/users";
import { countOrders, getAllOrders } from "@/services/orders";
import { countProducts } from "@/services/products";
import type { OrderDoc } from "@/types/firestore";

export type DailyMetric = {
  day: string;
  orders: number;
  revenue: number;
};

export type TopProductMetric = {
  name: string;
  units: number;
  revenue: number;
};

export type UserActivityMetric = {
  day: string;
  activeUsers: number;
};

export type AdminOverviewMetrics = {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  topProductName: string;
};

const toDayLabel = (date: Date): string => {
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
};

const safeDate = (raw: unknown): Date | null => {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const withToDate = raw as { toDate?: () => Date };
  if (typeof withToDate.toDate === "function") {
    return withToDate.toDate();
  }

  return null;
};

const snapshotDate = (order: OrderDoc): Date | null => {
  return safeDate(order.createdAt) ?? safeDate(order.updatedAt);
};

export const getOverviewMetrics = async (): Promise<AdminOverviewMetrics> => {
  const [totalUsers, totalOrders, totalProducts, orders] = await Promise.all([
    countUsers(),
    countOrders(),
    countProducts(),
    getAllOrders(500),
  ]);

  const totalRevenue = orders.reduce((sum, entry) => sum + (entry.data.total ?? 0), 0);

  const productRevenue = new Map<string, number>();

  orders.forEach((entry) => {
    const order = entry.data;
    order.items.forEach((item) => {
      const previous = productRevenue.get(item.name) ?? 0;
      productRevenue.set(item.name, previous + item.unitPrice * item.quantity);
    });
  });

  const topProductName =
    [...productRevenue.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  return {
    totalUsers,
    totalOrders,
    totalRevenue,
    totalProducts,
    topProductName,
  };
};

export const getDailyOrdersRevenue = async (days = 14): Promise<DailyMetric[]> => {
  const data = await getAllOrders(1000);
  const buckets = new Map<string, DailyMetric>();

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const key = date.toISOString().slice(0, 10);

    buckets.set(key, {
      day: toDayLabel(date),
      orders: 0,
      revenue: 0,
    });
  }

  data.forEach((entry) => {
    const createdAt = snapshotDate(entry.data);
    if (!createdAt) {
      return;
    }

    const key = createdAt.toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (!bucket) {
      return;
    }

    bucket.orders += 1;
    bucket.revenue += entry.data.total ?? 0;
  });

  return [...buckets.values()];
};

export const getTopProducts = async (max = 5): Promise<TopProductMetric[]> => {
  const orders = await getAllOrders(1000);
  const byProduct = new Map<string, TopProductMetric>();

  orders.forEach((entry) => {
    entry.data.items.forEach((item) => {
      const current = byProduct.get(item.name) ?? {
        name: item.name,
        units: 0,
        revenue: 0,
      };

      current.units += item.quantity;
      current.revenue += item.unitPrice * item.quantity;
      byProduct.set(item.name, current);
    });
  });

  return [...byProduct.values()].sort((a, b) => b.units - a.units).slice(0, max);
};

export const getUserActivity = async (days = 14): Promise<UserActivityMetric[]> => {
  const recentUsersQuery = query(
    collection(db, collections.users),
    orderBy("lastLoginAt", "desc"),
    limit(500),
  );
  const snapshot = await getDocs(recentUsersQuery);

  const buckets = new Map<string, UserActivityMetric>();

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const key = date.toISOString().slice(0, 10);

    buckets.set(key, {
      day: toDayLabel(date),
      activeUsers: 0,
    });
  }

  snapshot.docs.forEach((userDoc) => {
    const user = userDoc.data() as { lastLoginAt?: OrderDoc["createdAt"] };
    const lastLogin = safeDate(user.lastLoginAt);
    if (!lastLogin) {
      return;
    }

    const key = lastLogin.toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (!bucket) {
      return;
    }

    bucket.activeUsers += 1;
  });

  return [...buckets.values()];
};
