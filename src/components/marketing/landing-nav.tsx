"use client";

import Link from "next/link";
import { VyiralLogo } from "@/components/layout/vyiral-logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useT } from "@/contexts/locale-context";
import { useLandingAuth } from "@/hooks/use-landing-auth";
import { Skeleton } from "@/components/ui/skeleton";

export function LandingNav() {
  const t = useT();
  const { isLoggedIn, displayName, dashboardHref, authLoading } = useLandingAuth();

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 lg:px-8">
        <VyiralLogo />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="#features" className="transition-colors hover:text-foreground">
            {t("nav.features")}
          </Link>
          <Link href="#pricing" className="transition-colors hover:text-foreground">
            {t("nav.pricing")}
          </Link>
          <Link href="#faq" className="transition-colors hover:text-foreground">
            {t("nav.faq")}
          </Link>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher variant="compact" />
          {authLoading ? (
            <>
              <Skeleton className="hidden h-8 w-20 sm:block" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </>
          ) : isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden max-w-[140px] truncate sm:inline-flex"
              >
                <Link href={dashboardHref} title={displayName ?? undefined}>
                  {displayName ?? t("nav.dashboard")}
                </Link>
              </Button>
              <Button variant="gradient" size="sm" asChild>
                <Link href={dashboardHref}>{t("nav.dashboard")}</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/login">{t("common.signIn")}</Link>
              </Button>
              <Button variant="gradient" size="sm" asChild>
                <Link href="/login">{t("common.getStarted")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
