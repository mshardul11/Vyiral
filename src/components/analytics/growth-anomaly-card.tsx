"use client";

import { AlertTriangle, Sparkles, TrendingUp } from "lucide-react";

const ANOMALIES = [
  {
    type: "spike" as const,
    title: "View spike detected",
    body: "Dec 14 saw 3.2x normal views — likely from external share or featured placement.",
    metric: "+287%",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    Icon: TrendingUp,
  },
  {
    type: "drop" as const,
    title: "CTR drop",
    body: "CTR fell 1.8% week-over-week. Thumbnails published after Nov 28 have lower contrast.",
    metric: "-1.8%",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    Icon: AlertTriangle,
  },
  {
    type: "opportunity" as const,
    title: "AI opportunity",
    body: '"morning productivity" is trending in your niche — strong timing to publish now.',
    metric: "+42%",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    Icon: Sparkles,
  },
];

export function GrowthAnomalyCard({ days }: { days: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <h3 className="mb-4 font-semibold text-foreground">Growth Anomalies</h3>
      <div className="space-y-3">
        {ANOMALIES.map((a) => {
          const Icon = a.Icon;
          return (
            <div
              key={a.type}
              className={`flex items-start gap-3 rounded-lg border p-3 ${a.bg} ${a.border}`}
            >
              <div className={`mt-0.5 shrink-0 ${a.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <span className={`text-xs font-bold ${a.color}`}>{a.metric}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.body}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[10px] text-muted-foreground/60">
        Anomalies detected over the last {days} days · AI-powered
      </p>
    </div>
  );
}
