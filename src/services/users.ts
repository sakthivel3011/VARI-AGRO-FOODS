import {
  collection,
  getCountFromServer,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/config/firebase";
import { collections } from "@/services/firestorePaths";
import { isAdminEmail } from "@/config/admin";
import type { UserAddress, UserDoc } from "@/types/firestore";

type UserDocData = UserDoc & DocumentData;

export type UserRecord = {
  id: string;
  data: UserDocData;
};

const defaultDisplayName = (user: User): string => {
  if (user.displayName) {
    return user.displayName;
  }

  if (user.email) {
    return user.email.split("@")[0];
  }

  return "Vari Customer";
};

export const upsertUserProfile = async (user: User): Promise<void> => {
  if (!user.email) {
    return;
  }

  const userRef = doc(db, collections.users, user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: defaultDisplayName(user),
      photoURL: user.photoURL ?? "",
      phoneNumber: user.phoneNumber ?? "",
      role: isAdminEmail(user.email) ? "admin" : "customer",
      addresses: [],
      lastLoginAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return;
  }

  await updateDoc(userRef, {
    displayName: defaultDisplayName(user),
    photoURL: user.photoURL ?? "",
    phoneNumber: user.phoneNumber ?? "",
    role: isAdminEmail(user.email) ? "admin" : snapshot.data().role ?? "customer",
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getUserProfile = async (uid: string): Promise<UserDoc | null> => {
  const userRef = doc(db, collections.users, uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserDocData;
};

export const getUserAddresses = async (uid: string): Promise<UserAddress[]> => {
  const profile = await getUserProfile(uid);
  if (!profile) {
    return [];
  }

  return profile.addresses ?? [];
};

export const addUserAddress = async (uid: string, address: UserAddress): Promise<UserAddress[]> => {
  const userRef = doc(db, collections.users, uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    throw new Error("User profile not found.");
  }

  const currentAddresses = ((snapshot.data() as UserDocData).addresses ?? []) as UserAddress[];
  const nextAddresses = [address, ...currentAddresses];

  await updateDoc(userRef, {
    addresses: nextAddresses,
    updatedAt: serverTimestamp(),
  });

  return nextAddresses;
};

export const getAllUsers = async (max = 300): Promise<UserRecord[]> => {
  const usersQuery = query(collection(db, collections.users), orderBy("createdAt", "desc"), limit(max));
  const snapshot = await getDocs(usersQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    data: item.data() as UserDocData,
  }));
};

export const countUsers = async (): Promise<number> => {
  const snapshot = await getCountFromServer(collection(db, collections.users));
  return snapshot.data().count;
};
