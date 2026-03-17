import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { collections } from "@/services/firestorePaths";
import type { ProductDoc } from "@/types/firestore";

export type ProductRecord = {
  id: string;
  data: ProductDoc & DocumentData;
};

export type ProductMutationInput = {
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
};

export const getProductsForAdmin = async (max = 300): Promise<ProductRecord[]> => {
  const productsQuery = query(collection(db, collections.products), orderBy("createdAt", "desc"), limit(max));
  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    data: item.data() as ProductDoc & DocumentData,
  }));
};

export const createProduct = async (payload: ProductMutationInput): Promise<string> => {
  const ref = await addDoc(collection(db, collections.products), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
};

export const updateProduct = async (
  productId: string,
  payload: Partial<ProductMutationInput>,
): Promise<void> => {
  await updateDoc(doc(db, collections.products, productId), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
};

export const removeProduct = async (productId: string): Promise<void> => {
  await deleteDoc(doc(db, collections.products, productId));
};
