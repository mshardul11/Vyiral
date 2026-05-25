"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

/** Client hook — redirects to login when unauthenticated */
export function useRequireAuth() {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !isConfigured) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, isConfigured, router, pathname]);

  return { user, loading, isAuthenticated: !!user && isConfigured };
}
