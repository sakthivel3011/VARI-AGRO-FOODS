import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db } from "@/config/firebase";
import { functions } from "@/config/firebase";
import { collections } from "@/services/firestorePaths";
import type { OrderDoc } from "@/types/firestore";

type CreateOrderInput = {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    weight: string;
  }>;
  customerName: string;
  phone: string;
  deliveryAddress: string;
};

export type OrderRecord = {
  id: string;
  data: OrderDoc & DocumentData;
};

export const createOrder = async (payload: CreateOrderInput): Promise<string> => {
  const createOrderFn = httpsCallable<
    CreateOrderInput,
    { orderId: string }
  >(functions, "createCashOnDeliveryOrder");

  const response = await createOrderFn({
    userId: payload.userId,
    items: payload.items,
    customerName: payload.customerName,
    phone: payload.phone,
    deliveryAddress: payload.deliveryAddress,
  });

  return response.data.orderId;
};

export const getUserOrders = async (uid: string): Promise<OrderRecord[]> => {
  const ordersQuery = query(
    collection(db, collections.orders),
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(ordersQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    data: item.data() as OrderDoc & DocumentData,
  }));
};

export const getOrderById = async (orderId: string): Promise<OrderDoc | null> => {
  const ref = doc(db, collections.orders, orderId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as OrderDoc & DocumentData;
};

export const getAllOrders = async (max = 300): Promise<OrderRecord[]> => {
  const ordersQuery = query(collection(db, collections.orders), orderBy("createdAt", "desc"), limit(max));
  const snapshot = await getDocs(ordersQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    data: item.data() as OrderDoc & DocumentData,
  }));
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderDoc["status"],
): Promise<void> => {
  await updateDoc(doc(db, collections.orders, orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const cancelOrderByUser = async (orderId: string): Promise<void> => {
  await updateDoc(doc(db, collections.orders, orderId), {
    status: "cancelled",
    updatedAt: serverTimestamp(),
  });
};

export const countOrders = async (): Promise<number> => {
  const snapshot = await getCountFromServer(collection(db, collections.orders));
  return snapshot.data().count;
};
