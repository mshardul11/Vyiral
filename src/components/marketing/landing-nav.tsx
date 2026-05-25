import Link from "next/link";
import { VyiralLogo } from "@/components/layout/vyiral-logo";
import { LandingAuthActions } from "@/components/marketing/landing-auth-actions";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
        <VyiralLogo />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="#features" className="hover:text-foreground">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-foreground">
            Pricing
          </Link>
          <Link href="#faq" className="hover:text-foreground">
            FAQ
          </Link>
        </nav>
        <LandingAuthActions />
      </div>
    </header>
  );
}
