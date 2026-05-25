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
  const { user, userDoc, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
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
    if (
      userDoc?.onboardingCompleted &&
      pathname === "/onboarding"
    ) {
      router.replace("/dashboard");
    }
  }, [user, userDoc, loading, router, pathname, requireOnboarding]);

  const waitingForProfile =
    !loading && !!user && userDoc === null && requireOnboarding;

  if (loading || !user || waitingForProfile) {
    return (
      <div className="flex min-h-[50vh] flex-col gap-4 p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full max-w-md" />
      </div>
    );
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
