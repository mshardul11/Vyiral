"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { getAppEntryHref } from "@/components/marketing/landing-auth-actions";
import type { ComponentProps } from "react";

type AuthCtaLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  /** Always send to /login, even when signed in */
  forceLogin?: boolean;
};

export function AuthCtaLink({
  forceLogin = false,
  children,
  ...props
}: AuthCtaLinkProps) {
  const { user, userDoc, loading } = useAuth();

  let href = "/login";
  if (!forceLogin && !loading && user) {
    href = getAppEntryHref(userDoc);
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
