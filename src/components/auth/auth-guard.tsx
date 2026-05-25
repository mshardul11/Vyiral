"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AuthConfigAlert } from "@/components/auth/auth-config-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function AuthGuard({
  children,
  requireOnboarding = true,
}: {
  children: ReactNode;
  requireOnboarding?: boolean;
}) {
  const {
    user,
    userDoc,
    loading,
    authError,
    isConfigured,
    signOut,
    establishSession,
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !isConfigured) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (
      requireOnboarding &&
      userDoc &&
      !userDoc.onboardingCompleted &&
      pathname !== "/onboarding"
    ) {
      router.replace("/onboarding");
      return;
    }
    if (userDoc?.onboardingCompleted && pathname === "/onboarding") {
      router.replace("/dashboard");
    }
  }, [user, userDoc, loading, router, pathname, requireOnboarding, isConfigured]);

  useEffect(() => {
    if (loading || !user || userDoc || authError) return;
    void establishSession();
  }, [loading, user, userDoc, authError, establishSession]);

  if (!isConfigured || authError === "firebase_not_configured") {
    return (
      <div className="mx-auto max-w-lg p-8">
        <AuthConfigAlert />
      </div>
    );
  }

  if (loading) {
    return <AuthLoadingSkeleton />;
  }

  if (!user) {
    return <AuthLoadingSkeleton />;
  }

  if (authError === "session_sync_failed" || authError === "profile_load_failed") {
    return (
      <div className="mx-auto max-w-lg space-y-4 p-8">
        <AuthConfigAlert />
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => establishSession()}>
            Retry
          </Button>
          <Button variant="outline" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  const waitingForProfile =
    userDoc === null && requireOnboarding && pathname !== "/onboarding";

  if (waitingForProfile) {
    return <AuthLoadingSkeleton />;
  }

  if (
    requireOnboarding &&
    userDoc &&
    !userDoc.onboardingCompleted &&
    pathname !== "/onboarding"
  ) {
    return null;
  }

  return <>{children}</>;
}

function AuthLoadingSkeleton() {
  return (
    <div className="flex min-h-[50vh] flex-col gap-4 p-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full max-w-md" />
    </div>
  );
}
