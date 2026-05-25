"use client";

import type { Trend } from "./trends-client";
import { ArrowUpRight, Film, Zap, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FORMAT_ICONS = { long_form: Film, short: Zap, live: ArrowUpRight, any: ArrowUpRight };

function MomentumBar({ value }: { value: number }) {
  const color =
    value >= 90 ? "bg-emerald-500" : value >= 70 ? "bg-violet-500" : "bg-amber-500";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} />
    </div>
  );
}

export function TrendCard({
  trend,
  highlight,
}: {
  trend: Trend;
  highlight?: "opportunity";
}) {
  const FormatIcon = FORMAT_ICONS[trend.format];
  const scoreColor =
    trend.opportunityScore >= 85
      ? "text-emerald-400 bg-emerald-500/10"
      : trend.opportunityScore >= 70
      ? "text-violet-400 bg-violet-500/10"
      : "text-amber-400 bg-amber-500/10";

  return (
    <div
      className={cn(
        "group rounded-xl border bg-card/50 p-4 transition-all hover:border-border hover:bg-card/80",
        highlight === "opportunity"
          ? "border-violet-500/30"
          : "border-border/60"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <Badge variant="outline" className="border-border/60 text-[9px] capitalize text-muted-foreground">
              {trend.category}
            </Badge>
            {trend.contentGap && (
              <Badge className="bg-emerald-500/10 text-emerald-400 text-[9px] gap-0.5">
                <Star className="h-2.5 w-2.5" />
                Gap
              </Badge>
            )}
          </div>
          <p className="font-semibold text-sm text-foreground leading-snug">{trend.keyword}</p>
        </div>
        <div className={cn("shrink-0 rounded-lg px-2.5 py-1.5 text-center", scoreColor)}>
          <p className="text-base font-bold">{trend.opportunityScore}</p>
          <p className="text-[9px] opacity-70">score</p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Momentum</span>
          <span className="font-semibold text-foreground">{trend.momentum}/100</span>
        </div>
        <MomentumBar value={trend.momentum} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/40 pt-3">
        <div>
          <p className="text-xs font-semibold text-emerald-400">+{trend.weeklyGrowth}%</p>
          <p className="text-[10px] text-muted-foreground">7d growth</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">
            {trend.searchVolume >= 1000
              ? `${(trend.searchVolume / 1000).toFixed(0)}K`
              : trend.searchVolume}
          </p>
          <p className="text-[10px] text-muted-foreground">searches/mo</p>
        </div>
        <div className="flex items-center gap-1">
          <FormatIcon className="h-3 w-3 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground capitalize">
            {trend.format === "long_form" ? "Long" : trend.format}
          </p>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {trend.relatedKeywords.slice(0, 3).map((k) => (
          <span key={k} className="rounded-full bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground">
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
