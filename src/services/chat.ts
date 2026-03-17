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
import type { MessageDoc } from "@/types/firestore";

type CreateMessageInput = Pick<MessageDoc, "anonymousName" | "text"> & Partial<Pick<MessageDoc, "userId">>;

export type MessageRecord = {
  id: string;
  data: MessageDoc & DocumentData;
};

export const postMessage = async (payload: CreateMessageInput): Promise<string> => {
  const ref = await addDoc(collection(db, collections.messages), {
    ...payload,
    moderationStatus: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
};

export const getApprovedMessages = async (max = 50): Promise<MessageDoc[]> => {
  const messagesQuery = query(
    collection(db, collections.messages),
    where("moderationStatus", "==", "approved"),
    orderBy("createdAt", "desc"),
    limit(max),
  );

  const snapshot = await getDocs(messagesQuery);
  return snapshot.docs.map((item) => item.data() as MessageDoc & DocumentData);
};

export const subscribeApprovedMessages = (
  onChange: (messages: MessageRecord[]) => void,
  max = 50,
): Unsubscribe => {
  const messagesQuery = query(
    collection(db, collections.messages),
    where("moderationStatus", "==", "approved"),
    orderBy("createdAt", "desc"),
    limit(max),
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    onChange(
      snapshot.docs.map((item) => ({
        id: item.id,
        data: item.data() as MessageDoc & DocumentData,
      })),
    );
  });
};

export const getMessagesForModeration = async (max = 150): Promise<MessageRecord[]> => {
  const messagesQuery = query(collection(db, collections.messages), orderBy("createdAt", "desc"), limit(max));
  const snapshot = await getDocs(messagesQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    data: item.data() as MessageDoc & DocumentData,
  }));
};

export const updateMessageModerationStatus = async (
  messageId: string,
  status: MessageDoc["moderationStatus"],
): Promise<void> => {
  await updateDoc(doc(db, collections.messages, messageId), {
    moderationStatus: status,
    updatedAt: serverTimestamp(),
  });
};

export const deleteMessageById = async (messageId: string): Promise<void> => {
  await deleteDoc(doc(db, collections.messages, messageId));
};
