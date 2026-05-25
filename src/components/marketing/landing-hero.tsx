import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCtaLink } from "@/components/auth/auth-cta-link";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 lg:px-8 lg:pt-28">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm text-primary">
          Built for YouTube creators
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Grow faster with{" "}
          <span className="vyiral-text-gradient">creator intelligence</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Vyiral unifies keyword research, AI-powered metadata, channel audits,
          and competitor insights — so you ship videos that rank and convert.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="gradient" size="lg" asChild>
            <AuthCtaLink>
              Start free <ArrowRight className="h-4 w-4" />
            </AuthCtaLink>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#features">
              <Play className="h-4 w-4" /> See features
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Estimates are clearly labeled · No fake analytics · Original design
        </p>
      </div>
    </section>
  );
}
