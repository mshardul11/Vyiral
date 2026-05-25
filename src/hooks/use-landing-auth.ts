"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { probeServerSession } from "@/lib/auth/client-session";
import { getPostLoginPath } from "@/lib/auth/post-login";

export function useLandingAuth() {
  const { user, userDoc, loading, sessionReady, refreshUserDoc } = useAuth();
  const [hasServerSession, setHasServerSession] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      setHasServerSession(true);
      return;
    }
    if (loading) return;

    let cancelled = false;
    void (async () => {
      const ok = await probeServerSession();
      if (cancelled) return;
      setHasServerSession(ok);
      if (ok && !userDoc) {
        await refreshUserDoc();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, loading, userDoc, refreshUserDoc]);

  const isLoggedIn =
    Boolean(user) || sessionReady || hasServerSession === true;

  const displayName = useMemo(() => {
    const name = user?.displayName ?? userDoc?.displayName;
    if (name?.trim()) return name.trim();
    const email = user?.email ?? userDoc?.email;
    if (email) return email.split("@")[0] ?? email;
    return null;
  }, [user, userDoc]);

  const dashboardHref = getPostLoginPath(userDoc, "/dashboard");

  const authLoading =
    loading || (hasServerSession === null && !user && !sessionReady);

  return { isLoggedIn, displayName, dashboardHref, authLoading };
}
