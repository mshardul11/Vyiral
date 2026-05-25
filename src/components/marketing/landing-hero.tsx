"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/contexts/locale-context";
import { useLandingAuth } from "@/hooks/use-landing-auth";
import { Skeleton } from "@/components/ui/skeleton";

export function LandingHero() {
  const t = useT();
  const { isLoggedIn, displayName, dashboardHref, authLoading } = useLandingAuth();

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-16 lg:px-8 lg:pt-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, hsl(262 83% 58% / 0.15), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl text-center">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md">
          {t("hero.badge")}
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {t("hero.title")}{" "}
          <span className="vyiral-text-gradient">{t("hero.titleHighlight")}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {isLoggedIn && displayName
            ? `${t("hero.welcomeBack")}, ${displayName}. ${t("hero.subtitleLoggedIn")}`
            : t("hero.subtitle")}
        </p>
        <p className="mt-3 text-sm text-muted-foreground/80">
          {t("common.simpleFriendly")}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {authLoading ? (
            <>
              <Skeleton className="h-11 w-[180px] rounded-lg" />
              <Skeleton className="h-11 w-[160px] rounded-lg" />
            </>
          ) : isLoggedIn ? (
            <>
              <Button
                variant="gradient"
                size="lg"
                asChild
                className="vyiral-glow min-w-[180px]"
              >
                <Link href={dashboardHref}>
                  <LayoutDashboard className="h-4 w-4" />
                  {t("nav.dashboard")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="glass-panel border-white/15"
              >
                <Link href="#features">
                  <Play className="h-4 w-4" /> {t("common.seeFeatures")}
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="gradient"
                size="lg"
                asChild
                className="vyiral-glow min-w-[180px]"
              >
                <Link href="/login">
                  {t("common.startFree")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="glass-panel border-white/15"
              >
                <Link href="#features">
                  <Play className="h-4 w-4" /> {t("common.seeFeatures")}
                </Link>
              </Button>
            </>
          )}
        </div>
        <p className="mt-8 text-xs text-muted-foreground">{t("hero.footnote")}</p>
      </div>
    </section>
  );
}
