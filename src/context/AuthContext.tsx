import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { User } from "firebase/auth";
import { signInWithGoogle, signOutCurrentUser, subscribeToAuth } from "@/services/auth";
import { getUserProfile, upsertUserProfile } from "@/services/users";
import type { UserDoc } from "@/types/firestore";
import { AuthContext, type AuthContextValue } from "@/context/auth-context";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = useCallback(async (nextUser: User | null) => {
    if (!nextUser) {
      setProfile(null);
      return;
    }

    try {
      await upsertUserProfile(nextUser);
      const nextProfile = await getUserProfile(nextUser.uid);
      setProfile(nextProfile);
    } catch (error) {
      console.error("Failed to sync user profile", error);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (nextUser) => {
      setUser(nextUser);

      try {
        await syncProfile(nextUser);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [syncProfile]);

  const signIn = useCallback(async () => {
    const signedInUser = await signInWithGoogle();
    setUser(signedInUser);
    await syncProfile(signedInUser);
  }, [syncProfile]);

  const signOut = useCallback(async () => {
    await signOutCurrentUser();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const nextProfile = await getUserProfile(user.uid);
    setProfile(nextProfile);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: profile?.role === "admin",
      signIn,
      signOut,
      refreshProfile,
    }),
    [user, profile, loading, signIn, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
