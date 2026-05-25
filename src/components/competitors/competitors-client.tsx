"use client";

import { useEffect, useState } from "react";
import { Bell, Plus, TrendingUp, Users } from "lucide-react";
import { listCompetitors, addCompetitor } from "@/server/actions/competitors";
import type { CompetitorInsight } from "@/types/seo";
import { SectionHeader } from "@/components/shared/section-header";
import { toolPageMeta } from "@/lib/constants/navigation";
import { ChartContainer } from "@/components/charts/chart-container";
import { VyiralLineChart } from "@/components/charts/line-chart";
import { ScoreBadge } from "@/components/shared/score-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/glass-card";

const GROWTH_MOCK = [
  { week: "W1", subs: 48 },
  { week: "W2", subs: 52 },
  { week: "W3", subs: 55 },
  { week: "W4", subs: 58 },
];

export function CompetitorsClient() {
  const [competitors, setCompetitors] = useState<CompetitorInsight[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await listCompetitors();
    if (res.success && res.data) setCompetitors(res.data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleAdd() {
    if (!query.trim()) return;
    setLoading(true);
    const res = await addCompetitor(query.trim());
    setLoading(false);
    if (res.success) {
      setQuery("");
      void load();
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        title={toolPageMeta["/competitors"]!.title}
        description={toolPageMeta["/competitors"]!.description}
        action={
          <div className="flex gap-2">
            <Input
              placeholder="Competitor channel name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={handleAdd} disabled={loading}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {competitors.map((c) => (
          <GlassCard key={c.id} hover>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{c.channelTitle}</h3>
                <p className="text-xs text-muted-foreground">
                  {c.subscriberCount.toLocaleString()} subs · {c.uploadFrequency}
                </p>
              </div>
              {c.alertEnabled && <Bell className="h-4 w-4 text-primary" />}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <ScoreBadge score={c.momentumScore} label="Momentum" />
              <Badge variant="outline">
                <TrendingUp className="mr-1 h-3 w-3" />
                +{c.growthTrend}%
              </Badge>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <p>Keywords: {c.keywordOverlap.join(", ") || "—"}</p>
              <p className="mt-1">Topics: {c.topicOverlap.join(", ")}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <ChartContainer title="Growth comparison (Est.)" description="Normalized weekly momentum">
        <VyiralLineChart
          data={GROWTH_MOCK}
          xKey="week"
          lines={[{ key: "subs", color: "#8b5cf6", name: "Index" }]}
        />
      </ChartContainer>

      <GlassCard>
        <h3 className="flex items-center gap-2 font-semibold">
          <Users className="h-4 w-4" />
          Opportunity gaps
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• Competitors under-index on tutorial depth in your niche</li>
          <li>• Thumbnail pattern: high contrast + 3-word titles outperform</li>
          <li>• Upload alert: trending topic detected in 2 competitor channels</li>
        </ul>
      </GlassCard>
    </div>
  );
}
