"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { getAppEntryHref } from "@/components/marketing/landing-auth-actions";
import { cn } from "@/lib/utils";

export function VyiralLogo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  const { user, userDoc, loading } = useAuth();
  const href =
    !loading && user ? getAppEntryHref(userDoc) : "/";

  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-vyiral-gradient text-sm font-bold text-white shadow-lg">
        V
      </span>
      {showText && (
        <span className="text-lg font-semibold tracking-tight">
          Vy<span className="vyiral-text-gradient">iral</span>
        </span>
      )}
    </Link>
  );
}
