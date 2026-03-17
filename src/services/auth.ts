import {
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { auth } from "@/config/firebase";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  // Ensure auth session is stored in local storage for fast future logins
  await setPersistence(auth, browserLocalPersistence);

  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const signOutCurrentUser = async (): Promise<void> => {
  await signOut(auth);
};

export const subscribeToAuth = (callback: (user: User | null) => void): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};
