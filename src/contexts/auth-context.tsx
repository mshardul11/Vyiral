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
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  onIdTokenChanged,
  sendPasswordResetEmail,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { storeAuthReturnPath } from "@/lib/auth/google-auth";
import { getFirebaseAuth, googleProvider } from "@/lib/firebase/client";
import type { UserDoc } from "@/types/firestore";

export type AuthErrorCode =
  | "firebase_not_configured"
  | "session_sync_failed"
  | "profile_load_failed"
  | null;

export type AppDestination = "/dashboard" | "/onboarding" | "/login";

interface EstablishSessionResult {
  ok: boolean;
  destination: AppDestination;
  userDoc: UserDoc | null;
}

interface AuthContextValue {
  user: User | null;
  userDoc: UserDoc | null;
  loading: boolean;
  authError: AuthErrorCode;
  isConfigured: boolean;
  /** Full-page redirect (works with Next.js COOP; optional return path after sign-in). */
  signInWithGoogle: (returnPath?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserDoc: () => Promise<UserDoc | null>;
  /** Sync session cookie + load profile; returns where to navigate */
  establishSession: () => Promise<EstablishSessionResult>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function createSessionCookie(idToken: string): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    credentials: "include",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? "Failed to create session"
    );
  }
}

async function clearSessionCookie(): Promise<void> {
  await fetch("/api/auth/session", {
    method: "DELETE",
    credentials: "include",
  });
}

async function fetchUserDoc(): Promise<UserDoc | null> {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = (body as { error?: string }).error ?? res.statusText;
    throw new Error(`Failed to load profile (${res.status}: ${detail})`);
  }
  return res.json();
}

export function AuthProvider({
  children,
  firebaseConfigured,
}: {
  children: ReactNode;
  firebaseConfigured: boolean;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthErrorCode>(null);
  const isConfigured = firebaseConfigured;

  const refreshUserDoc = useCallback(async () => {
    try {
      const doc = await fetchUserDoc();
      setUserDoc(doc);
      if (doc) setAuthError(null);
      return doc;
    } catch (e) {
      console.error("[Vyiral] profile load failed", e);
      setAuthError("profile_load_failed");
      return null;
    }
  }, []);

  const syncSession = useCallback(
    async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        setUserDoc(null);
        setAuthError(null);
        return;
      }
      try {
        const token = await firebaseUser.getIdToken(true);
        await createSessionCookie(token);
        await refreshUserDoc();
      } catch (e) {
        console.error("[Vyiral] session sync failed", e);
        setAuthError("session_sync_failed");
      }
    },
    [refreshUserDoc]
  );

  const finishAuth = useCallback(
    async (firebaseUser: User) => {
      setUser(firebaseUser);
      await syncSession(firebaseUser);
    },
    [syncSession]
  );

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      setAuthError("firebase_not_configured");
      return;
    }

    const auth = getFirebaseAuth();

    void getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await finishAuth(result.user);
        }
      })
      .catch((e) => {
        console.error("[Vyiral] Google redirect sign-in failed", e);
      });

    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      await syncSession(firebaseUser);
      setLoading(false);
    });

    const unsubToken = onIdTokenChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      try {
        const token = await firebaseUser.getIdToken();
        await createSessionCookie(token);
      } catch {
        /* non-fatal refresh */
      }
    });

    return () => {
      unsubAuth();
      unsubToken();
    };
  }, [isConfigured, syncSession, finishAuth]);

  const signInWithGoogle = useCallback(
    async (returnPath?: string) => {
      if (!isConfigured) {
        setAuthError("firebase_not_configured");
        throw new Error("Firebase is not configured");
      }
      const path =
        returnPath ??
        (typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "/login");
      storeAuthReturnPath(path);
      await signInWithRedirect(getFirebaseAuth(), googleProvider);
    },
    [isConfigured]
  );

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!isConfigured) {
        setAuthError("firebase_not_configured");
        throw new Error("Firebase is not configured");
      }
      const result = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password
      );
      await finishAuth(result.user);
    },
    [isConfigured, finishAuth]
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      if (!isConfigured) {
        setAuthError("firebase_not_configured");
        throw new Error("Firebase is not configured");
      }
      const result = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password
      );
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      await finishAuth(result.user);
    },
    [isConfigured, finishAuth]
  );

  const sendPasswordReset = useCallback(async (email: string) => {
    if (!isConfigured) {
      throw new Error("Firebase is not configured");
    }
    await sendPasswordResetEmail(getFirebaseAuth(), email);
  }, [isConfigured]);

  const signOut = useCallback(async () => {
    await clearSessionCookie();
    await firebaseSignOut(getFirebaseAuth());
    setUser(null);
    setUserDoc(null);
    setAuthError(null);
  }, []);

  const establishSession = useCallback(async (): Promise<EstablishSessionResult> => {
    const firebaseUser = getFirebaseAuth().currentUser;
    if (!firebaseUser) {
      return { ok: false, destination: "/login", userDoc: null };
    }
    try {
      const token = await firebaseUser.getIdToken(true);
      await createSessionCookie(token);
      const doc = await fetchUserDoc();
      setUserDoc(doc);
      setAuthError(doc ? null : "profile_load_failed");
      if (!doc) {
        return { ok: false, destination: "/login", userDoc: null };
      }
      const destination: AppDestination = doc.onboardingCompleted
        ? "/dashboard"
        : "/onboarding";
      return { ok: true, destination, userDoc: doc };
    } catch (e) {
      console.error("[Vyiral] establishSession failed", e);
      setAuthError("session_sync_failed");
      return { ok: false, destination: "/login", userDoc: null };
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      userDoc,
      loading,
      authError,
      isConfigured,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      sendPasswordReset,
      signOut,
      refreshUserDoc,
      establishSession,
    }),
    [
      user,
      userDoc,
      loading,
      authError,
      isConfigured,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      sendPasswordReset,
      signOut,
      refreshUserDoc,
      establishSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
