"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: string | number;
  deltaPercent?: number;
  trend?: "up" | "down" | "stable";
  suffix?: string;
  loading?: boolean;
}

function OverviewCard({ label, value, delta, deltaPercent, trend, suffix, loading }: MetricCardProps) {
  const trendColor =
    trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-muted-foreground";
  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  if (loading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/50 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-muted/40" />
        <div className="mt-3 h-7 w-28 animate-pulse rounded bg-muted/40" />
        <div className="mt-2 h-3 w-16 animate-pulse rounded bg-muted/40" />
      </div>
    );
  }

  return (
    <div className="group rounded-xl border border-border/60 bg-card/50 p-4 transition-all hover:border-border hover:bg-card/80">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">
        {typeof value === "number" && value >= 1000
          ? value >= 1_000_000
            ? `${(value / 1_000_000).toFixed(1)}M`
            : `${(value / 1000).toFixed(1)}K`
          : value}
        {suffix && <span className="ml-0.5 text-base font-normal text-muted-foreground">{suffix}</span>}
      </p>
      {(delta !== undefined || deltaPercent !== undefined) && (
        <div className={cn("mt-1.5 flex items-center gap-1 text-xs font-medium", trendColor)}>
          <TrendIcon className="h-3 w-3" />
          {deltaPercent !== undefined && <span>{deltaPercent > 0 ? "+" : ""}{deltaPercent.toFixed(1)}%</span>}
          {delta !== undefined && (
            <span className="text-muted-foreground">
              {typeof delta === "number" && delta > 0 ? `+${delta.toLocaleString()}` : delta}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function AnalyticsOverviewCards({
  metrics,
  loading,
}: {
  metrics?: {
    subscribers: { value: number; delta: number; deltaPercent: number; trend: "up" | "down" | "stable" };
    views: { value: number; delta: number; deltaPercent: number; trend: "up" | "down" | "stable" };
    watchTime: { value: number; delta: number; deltaPercent: number; trend: "up" | "down" | "stable" };
    ctr: { value: number; delta: number; deltaPercent: number; trend: "up" | "down" | "stable" };
    avgViewDuration: { value: string; delta: string; deltaPercent: number; trend: "up" | "down" | "stable" };
    engagement: { value: number; delta: number; deltaPercent: number; trend: "up" | "down" | "stable" };
  };
  loading?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      <OverviewCard
        label="Subscribers"
        value={metrics?.subscribers.value ?? 0}
        delta={metrics?.subscribers.delta}
        deltaPercent={metrics?.subscribers.deltaPercent}
        trend={metrics?.subscribers.trend}
        loading={loading}
      />
      <OverviewCard
        label="Total Views"
        value={metrics?.views.value ?? 0}
        delta={metrics?.views.delta}
        deltaPercent={metrics?.views.deltaPercent}
        trend={metrics?.views.trend}
        loading={loading}
      />
      <OverviewCard
        label="Watch Time"
        value={metrics?.watchTime.value ?? 0}
        suffix="hrs"
        delta={metrics?.watchTime.delta}
        deltaPercent={metrics?.watchTime.deltaPercent}
        trend={metrics?.watchTime.trend}
        loading={loading}
      />
      <OverviewCard
        label="Avg CTR"
        value={metrics?.ctr.value ?? 0}
        suffix="%"
        delta={metrics?.ctr.delta}
        deltaPercent={metrics?.ctr.deltaPercent}
        trend={metrics?.ctr.trend}
        loading={loading}
      />
      <OverviewCard
        label="Avg View Duration"
        value={metrics?.avgViewDuration.value ?? "—"}
        delta={metrics?.avgViewDuration.delta}
        deltaPercent={metrics?.avgViewDuration.deltaPercent}
        trend={metrics?.avgViewDuration.trend}
        loading={loading}
      />
      <OverviewCard
        label="Engagement Rate"
        value={metrics?.engagement.value ?? 0}
        suffix="%"
        delta={metrics?.engagement.delta}
        deltaPercent={metrics?.engagement.deltaPercent}
        trend={metrics?.engagement.trend}
        loading={loading}
      />
    </div>
  );
}
