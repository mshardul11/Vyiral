import { LandingNav } from "@/components/marketing/landing-nav";
import { LandingHero } from "@/components/marketing/landing-hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { LandingFooter } from "@/components/marketing/landing-footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <LandingHero />
      <FeatureGrid />

      <section id="pricing" className="px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold">Simple pricing</h2>
          <p className="mt-2 text-muted-foreground">
            Billing integration ready — placeholder tiers for launch.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { name: "Free", price: "$0", desc: "Core research & limited AI" },
              { name: "Pro", price: "$29", desc: "Full AI suite & audits" },
              { name: "Team", price: "$79", desc: "Workspaces & roles (soon)" },
            ].map((tier) => (
              <Card key={tier.name}>
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{tier.price}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{tier.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button className="mt-8" variant="gradient" size="lg" asChild>
            <Link href="/login">Start free trial</Link>
          </Button>
        </div>
      </section>

      <section id="faq" className="px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-bold">FAQ</h2>
          <dl className="mt-10 space-y-6">
            {[
              {
                q: "Is Vyiral affiliated with vidIQ or YouTube?",
                a: "No. Vyiral is an original product with its own design and workflows.",
              },
              {
                q: "Are search volumes accurate?",
                a: "Volume and competition scores are modeled estimates, clearly labeled in the UI.",
              },
              {
                q: "Do I need to connect my channel?",
                a: "Many tools work without a connection; audits and private analytics require OAuth.",
              },
            ].map((item) => (
              <div key={item.q}>
                <dt className="font-semibold">{item.q}</dt>
                <dd className="mt-1 text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
