import { LandingNav } from "@/components/marketing/landing-nav";
import { LandingHero } from "@/components/marketing/landing-hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { LandingFaq, LandingPricing } from "@/components/marketing/landing-sections";
import { LandingFooter } from "@/components/marketing/landing-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <LandingHero />
      <FeatureGrid />
      <LandingPricing />
      <LandingFaq />
      <LandingFooter />
    </div>
  );
}
