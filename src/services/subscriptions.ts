import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  type DocumentData,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db } from "@/config/firebase";
import { functions } from "@/config/firebase";
import { collections } from "@/services/firestorePaths";
import type { SubscriptionDoc } from "@/types/firestore";

export type UserSubscriptionRecord = {
  id: string;
  data: SubscriptionDoc;
};

export const getUserSubscriptions = async (uid: string): Promise<UserSubscriptionRecord[]> => {
  const subscriptionsQuery = query(
    collection(db, collections.subscriptions),
    where("userId", "==", uid),
    orderBy("updatedAt", "desc"),
  );
  const snapshot = await getDocs(subscriptionsQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    data: item.data() as SubscriptionDoc & DocumentData,
  }));
};

export const updateSubscriptionStatus = async (
  subscriptionId: string,
  status: SubscriptionDoc["status"],
): Promise<void> => {
  const updateStatusFn = httpsCallable<
    {
      subscriptionId: string;
      status: SubscriptionDoc["status"];
    },
    {
      status: SubscriptionDoc["status"];
    }
  >(functions, "updateUserSubscriptionStatus");

  await updateStatusFn({
    subscriptionId,
    status,
  });
};
