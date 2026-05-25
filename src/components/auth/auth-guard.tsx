"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGuard({
  children,
  requireOnboarding = true,
}: {
  children: ReactNode;
  requireOnboarding?: boolean;
}) {
  const { user, userDoc, loading, sessionReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !sessionReady) return;

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
  }, [user, userDoc, loading, sessionReady, router, pathname, requireOnboarding]);

  if (loading || !sessionReady || !user) {
    return <AuthLoadingSkeleton />;
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
