"use client";

import { useEffect, useState } from "react";
import { Play, Shield } from "lucide-react";
import { runChannelAudit, getLatestAudit } from "@/server/actions/audit";
import type { ChannelAuditResult } from "@/types/seo";
import { SectionHeader } from "@/components/shared/section-header";
import { toolPageMeta } from "@/lib/constants/navigation";
import { ScoreRing } from "@/components/shared/score-badge";
import { ChartContainer } from "@/components/charts/chart-container";
import { VyiralRadarChart } from "@/components/charts/radar-chart";
import { VyiralBarChart } from "@/components/charts/bar-chart";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function AuditEngineClient() {
  const [audit, setAudit] = useState<ChannelAuditResult | null>(null);
  const [channelInput, setChannelInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void getLatestAudit().then((res) => {
      if (res.success && res.data) setAudit(res.data);
    });
  }, []);

  async function runAudit() {
    setLoading(true);
    const res = await runChannelAudit({
      channelId: channelInput || undefined,
      channelTitle: channelInput || undefined,
    });
    setLoading(false);
    if (res.success && res.data) setAudit(res.data);
  }

  const radarData = audit
    ? Object.entries(audit.subScores).map(([subject, score]) => ({ subject, score }))
    : [];

  const barData = audit?.categories.map((c) => ({
    name: c.name.slice(0, 8),
    score: c.score,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        title={toolPageMeta["/audit"]!.title}
        description={toolPageMeta["/audit"]!.description}
        action={
          <div className="flex gap-2">
            <Input
              placeholder="Your channel name (optional)"
              value={channelInput}
              onChange={(e) => setChannelInput(e.target.value)}
              className="w-48"
            />
            <Button variant="gradient" onClick={runAudit} disabled={loading}>
              <Play className="h-4 w-4" />
              {loading ? "Auditing..." : "Run audit"}
            </Button>
          </div>
        }
      />

      {loading && <Skeleton className="h-64 rounded-2xl" />}

      {audit && !loading && (
        <>
          <div className="flex flex-wrap items-center gap-8">
            <ScoreRing score={audit.overallScore} size={100} />
            <div>
              <h2 className="text-xl font-bold">{audit.channelTitle}</h2>
              <Badge className="mt-2" variant="muted">
                {audit.dataQuality === "estimated" ? "Est. analysis" : audit.dataQuality}
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartContainer title="Health radar" description="Sub-score breakdown">
              <VyiralRadarChart data={radarData} />
            </ChartContainer>
            <ChartContainer title="Category scores">
              {barData && (
                <VyiralBarChart data={barData} xKey="name" dataKey="score" />
              )}
            </ChartContainer>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <GlassCard>
              <h3 className="flex items-center gap-2 font-semibold">
                <Shield className="h-4 w-4 text-primary" />
                Issues
              </h3>
              <ul className="mt-4 space-y-3">
                {audit.issues.map((issue) => (
                  <li
                    key={issue.id}
                    className="rounded-xl border border-border/40 p-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{issue.title}</span>
                      <Badge
                        variant={
                          issue.severity === "high"
                            ? "warning"
                            : issue.severity === "medium"
                              ? "secondary"
                              : "muted"
                        }
                      >
                        {issue.severity}
                      </Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">{issue.description}</p>
                    <p className="mt-2 text-xs text-primary">Fix: {issue.fix}</p>
                  </li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard>
              <h3 className="font-semibold">Opportunities & next steps</h3>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                {audit.opportunities.map((o) => (
                  <li key={o}>{o}</li>
                ))}
                {audit.nextSteps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <h4 className="mt-6 font-medium">Recommended uploads</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {audit.recommendedUploads.map((u) => (
                  <li key={u}>• {u}</li>
                ))}
              </ul>
            </GlassCard>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <GlassCard>
              <h4 className="font-medium text-red-400/90">Weak patterns</h4>
              <ul className="mt-2 text-sm text-muted-foreground">
                {audit.weakPatterns.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard>
              <h4 className="font-medium text-emerald-400/90">Strong themes</h4>
              <ul className="mt-2 text-sm text-muted-foreground">
                {audit.strongThemes.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}
