"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Video {
  id: string;
  title: string;
  views: number;
  watchTime: number;
  ctr: number;
  likes?: number;
  comments?: number;
  publishedAt: string;
  thumbnailUrl?: string | null;
  performanceScore: number;
  trend: "up" | "down" | "stable";
  issue?: string;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-500/15 text-emerald-400" :
    score >= 60 ? "bg-amber-500/15 text-amber-400" :
    "bg-red-500/15 text-red-400";
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", color)}>
      {score}
    </span>
  );
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />;
  if (trend === "down") return <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

export function TopVideosTable({
  videos,
  type = "top",
}: {
  videos: Video[];
  type?: "top" | "worst";
}) {
  const title = type === "top" ? "Top Performing Videos" : "Underperforming Videos";

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {type === "worst" && (
          <Badge variant="outline" className="border-amber-500/40 text-amber-400 text-xs">
            Needs attention
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        {videos.map((video, idx) => (
          <Link
            key={video.id}
            href={`/stats/videos/${video.id}`}
            className="flex items-center gap-3 rounded-lg border border-transparent p-2.5 transition-all hover:border-border/60 hover:bg-white/[0.03]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/30 text-xs font-bold text-muted-foreground">
              {type === "top" ? idx + 1 : <Play className="h-3.5 w-3.5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{video.title}</p>
              {video.issue ? (
                <p className="text-xs text-amber-400">{video.issue}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {video.views.toLocaleString()} views · {video.ctr}% CTR
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <TrendIcon trend={video.trend} />
              <ScoreBadge score={video.performanceScore} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
