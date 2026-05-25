"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowLeft, Brain, Eye, Heart, MessageCircle, Clock, Target, TrendingUp, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface VideoData {
  id: string;
  title: string;
  views: number;
  watchTime: number;
  ctr: number;
  likes: number;
  comments: number;
  publishedAt: string;
  performanceScore: number;
  trend: "up" | "down" | "stable";
  issue?: string;
}

function generateRetentionCurve() {
  const points = [];
  let retention = 100;
  for (let s = 0; s <= 600; s += 10) {
    if (s === 0) retention = 100;
    else if (s <= 30) retention = Math.max(60, retention - Math.random() * 4 - 1.5);
    else if (s <= 120) retention = Math.max(45, retention - Math.random() * 2 - 0.5);
    else retention = Math.max(20, retention - Math.random() * 1.2 - 0.3);
    points.push({
      second: s,
      label: `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`,
      retention: parseFloat(retention.toFixed(1)),
    });
  }
  return points;
}

const AI_SUGGESTIONS = [
  {
    category: "Title",
    priority: "high" as const,
    current: "My Channel Growth Story (The Truth)",
    suggestion: "I Grew from 0 to 10K Subs Doing This Every Day (Real Results)",
    impact: "+2.4% estimated CTR",
  },
  {
    category: "Thumbnail",
    priority: "high" as const,
    suggestion: "Add a contrasting color block behind your face. Current background blends with text.",
    impact: "+1.8% estimated CTR",
  },
  {
    category: "Hook",
    priority: "medium" as const,
    suggestion: "Move the core insight to the first 8 seconds. Currently appears at 0:24, causing 31% drop.",
    impact: "+12% average view duration",
  },
  {
    category: "SEO",
    priority: "medium" as const,
    suggestion: 'Add "channel growth tips 2024" to description. Missing from tags + description.',
    impact: "+8% search impressions",
  },
  {
    category: "Publishing Time",
    priority: "low" as const,
    suggestion: "Published Sunday 11am. Your audience is most active Thursday 6–9pm.",
    impact: "+15% first 24h views",
  },
];

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 36;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="-rotate-90" width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r="36" fill="none" stroke="hsl(217 33% 15%)" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r="36"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-foreground">{score}</span>
        <span className="text-[9px] text-muted-foreground">Score</span>
      </div>
    </div>
  );
}

export function VideoIntelligenceClient({ videoId }: { videoId: string }) {
  const [retentionData] = useState(generateRetentionCurve);

  const video: VideoData = {
    id: videoId,
    title: "How I Grew My Channel to 10K Subs in 90 Days",
    views: 142300,
    watchTime: 8420,
    ctr: 7.2,
    likes: 3840,
    comments: 412,
    publishedAt: "2024-11-14",
    performanceScore: 92,
    trend: "up",
  };

  const statsGrid = [
    { icon: Eye, label: "Views", value: video.views.toLocaleString(), delta: "+18%" },
    { icon: Clock, label: "Watch Time", value: `${video.watchTime.toLocaleString()} hrs`, delta: "+12%" },
    { icon: Target, label: "CTR", value: `${video.ctr}%`, delta: "+0.8%" },
    { icon: Heart, label: "Likes", value: video.likes.toLocaleString(), delta: "+9%" },
    { icon: MessageCircle, label: "Comments", value: video.comments.toLocaleString(), delta: "+21%" },
    { icon: TrendingUp, label: "Subs Gained", value: "384", delta: "+34%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/stats">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-foreground line-clamp-1">{video.title}</h1>
          <p className="text-xs text-muted-foreground">Published {video.publishedAt}</p>
        </div>
      </div>

      {/* Hero metrics */}
      <div className="flex flex-wrap items-center gap-6 rounded-xl border border-border/60 bg-card/50 p-5">
        <ScoreRing score={video.performanceScore} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Performance Score</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Top 8% of your channel videos · Trending up
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className="bg-emerald-500/15 text-emerald-400 text-xs">Strong CTR</Badge>
            <Badge className="bg-emerald-500/15 text-emerald-400 text-xs">High Engagement</Badge>
            <Badge className="bg-amber-500/15 text-amber-400 text-xs">Hook needs work</Badge>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {statsGrid.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="text-center">
                <Icon className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <p className="text-base font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                <p className="text-[10px] font-medium text-emerald-400">{s.delta}</p>
              </div>
            );
          })}
        </div>
      </div>

      <Tabs defaultValue="retention">
        <TabsList className="h-auto gap-1 bg-card/50 p-1">
          <TabsTrigger value="retention" className="text-xs">Retention</TabsTrigger>
          <TabsTrigger value="ai" className="gap-1.5 text-xs">
            <Brain className="h-3 w-3" />
            AI Suggestions
          </TabsTrigger>
          <TabsTrigger value="seo" className="text-xs">SEO Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="retention" className="mt-4 space-y-4">
          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Audience Retention Curve</h3>
                <p className="text-xs text-muted-foreground">Average view percentage over time</p>
              </div>
              <div className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                Avg: 54.2% retained
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={retentionData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    interval={5}
                  />
                  <YAxis
                    tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222 47% 8%)",
                      border: "1px solid hsl(217 33% 18%)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(v: number) => [`${v}%`, "Retention"]}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="retention"
                    stroke="#8b5cf6"
                    fill="url(#retentionGrad)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 border-t border-border/40 pt-3">
              {[
                { label: "0–30s drop", value: "−28%", note: "High — hook issue" },
                { label: "Mid-video avg", value: "62%", note: "Above average" },
                { label: "End screen", value: "24%", note: "Add end cards" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-base font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  <p className="text-[10px] text-amber-400">{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-4 space-y-3">
          {AI_SUGGESTIONS.map((s, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border p-4",
                s.priority === "high"
                  ? "border-violet-500/30 bg-violet-500/5"
                  : s.priority === "medium"
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-border/60 bg-card/50"
              )}
            >
              <div className="flex items-start gap-3">
                <Lightbulb
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    s.priority === "high" ? "text-violet-400" :
                    s.priority === "medium" ? "text-amber-400" : "text-muted-foreground"
                  )}
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{s.category}</span>
                    <Badge
                      className={cn(
                        "text-[10px]",
                        s.priority === "high"
                          ? "bg-violet-500/15 text-violet-400"
                          : s.priority === "medium"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-muted/40 text-muted-foreground"
                      )}
                    >
                      {s.priority} priority
                    </Badge>
                    <span className="text-xs text-emerald-400">{s.impact}</span>
                  </div>
                  {s.current && (
                    <div className="mt-2 rounded bg-muted/20 px-2 py-1.5">
                      <p className="text-[10px] text-muted-foreground">Current</p>
                      <p className="text-xs text-foreground/80">{s.current}</p>
                    </div>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">{s.suggestion}</p>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <h3 className="mb-4 font-semibold text-foreground">SEO Optimization Score</h3>
            <div className="space-y-3">
              {[
                { label: "Title keywords", score: 85, status: "good" },
                { label: "Description quality", score: 72, status: "good" },
                { label: "Tag coverage", score: 58, status: "warn" },
                { label: "Thumbnail text", score: 45, status: "warn" },
                { label: "End screen / cards", score: 20, status: "bad" },
                { label: "Chapters / timestamps", score: 0, status: "bad" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-40 text-sm text-muted-foreground">{item.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/40">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        item.status === "good" ? "bg-emerald-500" :
                        item.status === "warn" ? "bg-amber-500" : "bg-red-500"
                      )}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-semibold text-foreground">{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
