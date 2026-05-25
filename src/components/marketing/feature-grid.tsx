"use client";

import {
  BarChart3,
  Bot,
  LineChart,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/contexts/locale-context";
import type { MessageKey } from "@/i18n/get-message";

const featureKeys: {
  icon: typeof Search;
  titleKey: MessageKey;
  descKey: MessageKey;
}[] = [
  { icon: Search, titleKey: "features.keywordTitle", descKey: "features.keywordDesc" },
  { icon: Sparkles, titleKey: "features.aiTitle", descKey: "features.aiDesc" },
  { icon: Shield, titleKey: "features.auditTitle", descKey: "features.auditDesc" },
  { icon: LineChart, titleKey: "features.statsTitle", descKey: "features.statsDesc" },
  { icon: BarChart3, titleKey: "features.competitorsTitle", descKey: "features.competitorsDesc" },
  { icon: Bot, titleKey: "features.ideasTitle", descKey: "features.ideasDesc" },
];

export function FeatureGrid() {
  const t = useT();

  return (
    <section id="features" className="px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          {t("features.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          {t("features.subtitle")}
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featureKeys.map((f) => (
            <Card
              key={f.titleKey}
              className="group transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_0_32px_-8px_hsl(262_83%_58%_/_0.35)]"
            >
              <CardHeader>
                <f.icon className="mb-2 h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                <CardTitle className="text-lg">{t(f.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(f.descKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
