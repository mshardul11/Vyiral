import Link from "next/link";
import { VyiralLogo } from "@/components/layout/vyiral-logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 px-4 py-12 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:justify-between">
        <VyiralLogo />
        <div className="flex gap-8 text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-foreground">
            Sign in
          </Link>
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
