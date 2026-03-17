import { createContext } from "react";
import type { User } from "firebase/auth";
import type { UserDoc } from "@/types/firestore";

export type AuthContextValue = {
  user: User | null;
  profile: UserDoc | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
