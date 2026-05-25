"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/contexts/locale-context";

const tiers = [
  { key: "free" as const, price: "$0" },
  { key: "pro" as const, price: "$29" },
  { key: "team" as const, price: "$79" },
];

const faqs = [
  { q: "faq.q1" as const, a: "faq.a1" as const },
  { q: "faq.q2" as const, a: "faq.a2" as const },
  { q: "faq.q3" as const, a: "faq.a3" as const },
];

export function LandingPricing() {
  const t = useT();

  return (
    <section id="pricing" className="px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">{t("pricing.title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("pricing.subtitle")}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.key}
              className={tier.key === "pro" ? "border-primary/30 vyiral-glow" : ""}
            >
              <CardHeader>
                <CardTitle>{t(`pricing.${tier.key}`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{tier.price}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`pricing.${tier.key}Desc`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button className="mt-8 vyiral-glow" variant="gradient" size="lg" asChild>
          <Link href="/login">{t("pricing.cta")}</Link>
        </Button>
      </div>
    </section>
  );
}

export function LandingFaq() {
  const t = useT();

  return (
    <section id="faq" className="px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          {t("faq.title")}
        </h2>
        <dl className="mt-10 space-y-6">
          {faqs.map((item) => (
            <div key={item.q} className="glass-card !p-5">
              <dt className="font-semibold">{t(item.q)}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(item.a)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
