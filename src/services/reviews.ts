import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { collections } from "@/services/firestorePaths";
import type { ReviewDoc } from "@/types/firestore";

type CreateReviewInput = Omit<ReviewDoc, "moderationStatus" | "createdAt" | "updatedAt">;

export type ReviewRecord = {
  id: string;
  data: ReviewDoc & DocumentData;
};

export const createReview = async (payload: CreateReviewInput): Promise<string> => {
  const ref = await addDoc(collection(db, collections.reviews), {
    ...payload,
    moderationStatus: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
};

export const getApprovedReviewsByProduct = async (productId: string): Promise<ReviewDoc[]> => {
  const reviewsQuery = query(
    collection(db, collections.reviews),
    where("productId", "==", productId),
    where("moderationStatus", "==", "approved"),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(reviewsQuery);
  return snapshot.docs.map((item) => item.data() as ReviewDoc & DocumentData);
};

export const subscribeApprovedReviewsByProduct = (
  productId: string,
  onChange: (reviews: ReviewRecord[]) => void,
  max = 30,
): Unsubscribe => {
  const reviewsQuery = query(
    collection(db, collections.reviews),
    where("productId", "==", productId),
    where("moderationStatus", "==", "approved"),
    orderBy("createdAt", "desc"),
    limit(max),
  );

  return onSnapshot(reviewsQuery, (snapshot) => {
    onChange(
      snapshot.docs.map((item) => ({
        id: item.id,
        data: item.data() as ReviewDoc & DocumentData,
      })),
    );
  });
};

export const subscribeApprovedReviews = (
  onChange: (reviews: ReviewRecord[]) => void,
  max = 80,
): Unsubscribe => {
  const reviewsQuery = query(
    collection(db, collections.reviews),
    where("moderationStatus", "==", "approved"),
    orderBy("createdAt", "desc"),
    limit(max),
  );

  return onSnapshot(reviewsQuery, (snapshot) => {
    onChange(
      snapshot.docs.map((item) => ({
        id: item.id,
        data: item.data() as ReviewDoc & DocumentData,
      })),
    );
  });
};

export const getReviewsForModeration = async (max = 120): Promise<ReviewRecord[]> => {
  const reviewsQuery = query(collection(db, collections.reviews), orderBy("createdAt", "desc"), limit(max));
  const snapshot = await getDocs(reviewsQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    data: item.data() as ReviewDoc & DocumentData,
  }));
};

export const updateReviewModerationStatus = async (
  reviewId: string,
  status: ReviewDoc["moderationStatus"],
): Promise<void> => {
  const ref = doc(db, collections.reviews, reviewId);
  await updateDoc(ref, {
    moderationStatus: status,
    updatedAt: serverTimestamp(),
  });
};

export const deleteReviewById = async (reviewId: string): Promise<void> => {
  await deleteDoc(doc(db, collections.reviews, reviewId));
};
