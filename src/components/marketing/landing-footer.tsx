import Link from "next/link";
import { VyiralLogo } from "@/components/layout/vyiral-logo";
import { LandingAuthActions } from "@/components/marketing/landing-auth-actions";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 px-4 py-12 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <VyiralLogo />
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <LandingAuthActions compact />
          <Link href="#faq" className="hover:text-foreground">
            FAQ
          </Link>
          <Link href="#pricing" className="hover:text-foreground">
            Pricing
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-muted-foreground">
        © {new Date().getFullYear()} Vyiral. Not affiliated with YouTube or
        Google. Analytics estimates are modeled, not official YouTube metrics.
      </p>
    </footer>
  );
}
