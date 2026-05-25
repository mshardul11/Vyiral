"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import type { UserDoc } from "@/types/firestore";

interface AuthContextValue {
  user: User | null;
  userDoc: UserDoc | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserDoc: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function createSessionCookie(idToken: string): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error("Failed to create session");
}

async function clearSessionCookie(): Promise<void> {
  await fetch("/api/auth/session", { method: "DELETE" });
}

async function fetchUserDoc(): Promise<UserDoc | null> {
  const res = await fetch("/api/auth/me");
  if (res.status === 401) return null;
  if (!res.ok) return null;
  return res.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserDoc = useCallback(async () => {
    const doc = await fetchUserDoc();
    setUserDoc(doc);
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          await createSessionCookie(token);
          await refreshUserDoc();
        } catch (e) {
          console.error("[Vyiral] session sync failed", e);
        }
      } else {
        setUserDoc(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [refreshUserDoc]);

  const signInWithGoogle = useCallback(async () => {
    const { signInWithPopup } = await import("firebase/auth");
    const { googleProvider, getFirebaseAuth } = await import("@/lib/firebase/client");
    const result = await signInWithPopup(getFirebaseAuth(), googleProvider);
    const token = await result.user.getIdToken();
    await createSessionCookie(token);
    await refreshUserDoc();
  }, [refreshUserDoc]);

  const signOut = useCallback(async () => {
    await clearSessionCookie();
    await firebaseSignOut(getFirebaseAuth());
    setUserDoc(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      userDoc,
      loading,
      signInWithGoogle,
      signOut,
      refreshUserDoc,
    }),
    [user, userDoc, loading, signInWithGoogle, signOut, refreshUserDoc]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
