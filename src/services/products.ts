import {
  getCountFromServer,
  collection,
  doc,
  getDocs,
  getDoc,
  limit,
  orderBy,
  query,
  where,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { collections } from "@/services/firestorePaths";
import type { ProductDoc } from "@/types/firestore";
import type { CatalogProduct } from "@/types/product";
import { mapProductDocToCatalogProduct } from "@/services/productMapper";

export type ProductFilter = {
  type?: string;
  featuredOnly?: boolean;
  newArrivalOnly?: boolean;
};

export const getProducts = async (
  filter: ProductFilter = {},
  maxResults = 24,
): Promise<ProductDoc[]> => {
  const constraints: QueryConstraint[] = [orderBy("popularityScore", "desc"), limit(maxResults)];

  if (filter.type) {
    constraints.push(where("type", "==", filter.type));
  }

  if (filter.featuredOnly) {
    constraints.push(where("featured", "==", true));
  }

  if (filter.newArrivalOnly) {
    constraints.push(where("isNewArrival", "==", true));
  }

  const productsQuery = query(collection(db, collections.products), ...constraints);
  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((item) => item.data() as ProductDoc & DocumentData);
};

export const getCatalogProducts = async (
  filter: ProductFilter = {},
  maxResults = 24,
): Promise<CatalogProduct[]> => {
  const constraints: QueryConstraint[] = [];

  if (filter.type) {
    constraints.push(where("type", "==", filter.type));
  }

  if (filter.featuredOnly) {
    constraints.push(where("featured", "==", true));
  }

  if (filter.newArrivalOnly) {
    constraints.push(where("isNewArrival", "==", true));
  }

  constraints.push(orderBy("popularityScore", "desc"), limit(maxResults));

  const productsQuery = query(collection(db, collections.products), ...constraints);
  const snapshot = await getDocs(productsQuery);

  const result = snapshot.docs.map((item, index) => {
    const data = item.data() as ProductDoc & DocumentData;
    return mapProductDocToCatalogProduct(data, item.id || `remote-${index}`);
  });

  return result;
};

export const getCatalogProductBySlug = async (slug: string): Promise<CatalogProduct | null> => {
  const productsQuery = query(collection(db, collections.products), where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(productsQuery);

  if (snapshot.empty) {
    return null;
  }

  const first = snapshot.docs[0];
  const data = first.data() as ProductDoc & DocumentData;
  return mapProductDocToCatalogProduct(data, first.id);
};

export const getCatalogProductById = async (id: string): Promise<CatalogProduct | null> => {
  const ref = doc(db, collections.products, id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as ProductDoc & DocumentData;
  return mapProductDocToCatalogProduct(data, snapshot.id);
};

export const countProducts = async (): Promise<number> => {
  const snapshot = await getCountFromServer(collection(db, collections.products));
  return snapshot.data().count;
};
