"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { probeServerSession } from "@/lib/auth/client-session";
import { storeAuthReturnPath } from "@/lib/auth/google-auth";
import { getFirebaseAuth, googleProvider } from "@/lib/firebase/client";
import type { UserDoc } from "@/types/entities";

interface AuthContextValue {
  user: User | null;
  userDoc: UserDoc | null;
  loading: boolean;
  sessionReady: boolean;
  signInWithGoogle: (returnPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserDoc: () => Promise<UserDoc | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function createSessionCookie(idToken: string): Promise<void> {
  let lastError = "Failed to create session";
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      credentials: "include",
    });
    if (res.ok) return;
    const body = await res.json().catch(() => ({}));
    lastError = (body as { error?: string }).error ?? lastError;
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    }
  }
  throw new Error(lastError);
}

async function clearSessionCookie(): Promise<void> {
  await fetch("/api/auth/session", {
    method: "DELETE",
    credentials: "include",
  });
}

async function fetchUserDoc(allowRetry = true): Promise<UserDoc | null> {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
    cache: "no-store",
  });
  if (res.status === 401) {
    if (allowRetry) {
      await new Promise((r) => setTimeout(r, 300));
      return fetchUserDoc(false);
    }
    return null;
  }
  if (!res.ok) return null;
  return res.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const syncPromiseRef = useRef<Promise<UserDoc | null> | null>(null);

  const refreshUserDoc = useCallback(async () => {
    const doc = await fetchUserDoc();
    setUserDoc(doc);
    return doc;
  }, []);

  const syncSessionForUser = useCallback(
    async (firebaseUser: User): Promise<UserDoc | null> => {
      if (syncPromiseRef.current) {
        return syncPromiseRef.current;
      }

      const promise = (async () => {
        try {
          const token = await firebaseUser.getIdToken(true);
          await createSessionCookie(token);
          if (!(await probeServerSession())) {
            throw new Error("Session cookie was not set");
          }
          const doc = await fetchUserDoc();
          setUserDoc(doc);
          setSessionReady(Boolean(doc));
          return doc;
        } catch (e) {
          console.error("[Vyiral] session sync failed", e);
          setSessionReady(false);
          return null;
        } finally {
          syncPromiseRef.current = null;
        }
      })();

      syncPromiseRef.current = promise;
      return promise;
    },
    []
  );

  useEffect(() => {
    const auth = getFirebaseAuth();
    let cancelled = false;
    let unsub: (() => void) | undefined;

    void (async () => {
      try {
        const redirectResult = await getRedirectResult(auth);
        if (cancelled) return;
        if (redirectResult?.user) {
          setUser(redirectResult.user);
          await syncSessionForUser(redirectResult.user);
        }
      } catch (e) {
        console.error("[Vyiral] Google redirect sign-in failed", e);
      }

      if (cancelled) return;

      unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        if (cancelled) return;
        setUser(firebaseUser);
        if (firebaseUser) {
          await syncSessionForUser(firebaseUser);
        } else {
          syncPromiseRef.current = null;
          setUserDoc(null);
          setSessionReady(false);
        }
        setLoading(false);
      });
    })();

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [syncSessionForUser]);

  const signInWithGoogle = useCallback(async (returnPath?: string) => {
    const path =
      returnPath ??
      (typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : "/login");
    storeAuthReturnPath(path);
    await signInWithRedirect(getFirebaseAuth(), googleProvider);
  }, []);

  const signOut = useCallback(async () => {
    await clearSessionCookie();
    await firebaseSignOut(getFirebaseAuth());
    setUser(null);
    setUserDoc(null);
    setSessionReady(false);
    syncPromiseRef.current = null;
    window.location.assign("/login");
  }, []);

  const value = useMemo(
    () => ({
      user,
      userDoc,
      loading,
      sessionReady,
      signInWithGoogle,
      signOut,
      refreshUserDoc,
    }),
    [user, userDoc, loading, sessionReady, signInWithGoogle, signOut, refreshUserDoc]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
