"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { UserMenu } from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/** Where signed-in users should land in the app */
export function getAppEntryHref(
  userDoc: { onboardingCompleted?: boolean } | null
): string {
  if (userDoc && !userDoc.onboardingCompleted) return "/onboarding";
  return "/dashboard";
}

export function LandingAuthActions({ compact }: { compact?: boolean }) {
  const { user, userDoc, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-20" />
        {!compact && <Skeleton className="h-9 w-24" />}
      </div>
    );
  }

  if (user) {
    const appHref = getAppEntryHref(userDoc);
    const name = user.displayName?.split(" ")[0] ?? "there";

    return (
      <div className="flex items-center gap-2">
        {!compact && (
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Hi, {name}
          </span>
        )}
        <Button variant={compact ? "ghost" : "secondary"} size="sm" asChild>
          <Link href={appHref}>Dashboard</Link>
        </Button>
        <UserMenu />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">Sign in</Link>
      </Button>
      {!compact && (
        <Button variant="gradient" size="sm" asChild>
          <Link href="/login">Get started</Link>
        </Button>
      )}
    </div>
  );
}
