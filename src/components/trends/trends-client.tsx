"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Flame, Star, ArrowUpRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendCard } from "./trend-card";
import { TrendChart } from "./trend-chart";
import { RisingCreators } from "./rising-creators";
import { cn } from "@/lib/utils";

export type Trend = {
  id: string;
  keyword: string;
  category: string;
  weeklyGrowth: number;
  momentum: number;
  searchVolume: number;
  opportunityScore: number;
  contentGap: boolean;
  format: "long_form" | "short" | "live" | "any";
  relatedKeywords: string[];
};

const ALL_TRENDS: Trend[] = [
  { id: "t1", keyword: "AI productivity tools 2025", category: "tech", weeklyGrowth: 142, momentum: 96, searchVolume: 48000, opportunityScore: 92, contentGap: true, format: "long_form", relatedKeywords: ["AI workflow", "productivity apps", "notion AI"] },
  { id: "t2", keyword: "YouTube Shorts monetization", category: "general", weeklyGrowth: 87, momentum: 88, searchVolume: 72000, opportunityScore: 85, contentGap: false, format: "short", relatedKeywords: ["shorts revenue", "youtube partner", "RPM shorts"] },
  { id: "t3", keyword: "faceless YouTube channel", category: "general", weeklyGrowth: 64, momentum: 82, searchVolume: 58000, opportunityScore: 79, contentGap: true, format: "long_form", relatedKeywords: ["anonymous channel", "AI voiceover", "stock footage"] },
  { id: "t4", keyword: "morning routine gym girl", category: "lifestyle", weeklyGrowth: 58, momentum: 75, searchVolume: 92000, opportunityScore: 62, contentGap: false, format: "short", relatedKeywords: ["5am routine", "gym aesthetic", "fitness vlog"] },
  { id: "t5", keyword: "budget travel Europe 2025", category: "lifestyle", weeklyGrowth: 54, momentum: 71, searchVolume: 64000, opportunityScore: 74, contentGap: true, format: "long_form", relatedKeywords: ["cheap flights", "hostel europe", "backpacking"] },
  { id: "t6", keyword: "passive income ideas for beginners", category: "finance", weeklyGrowth: 48, momentum: 69, searchVolume: 110000, opportunityScore: 58, contentGap: false, format: "any", relatedKeywords: ["online income", "side hustle", "make money online"] },
  { id: "t7", keyword: "ChatGPT prompts for YouTube", category: "tech", weeklyGrowth: 93, momentum: 91, searchVolume: 38000, opportunityScore: 88, contentGap: true, format: "long_form", relatedKeywords: ["AI content creation", "GPT prompts", "youtube AI"] },
  { id: "t8", keyword: "thumbnail psychology secrets", category: "general", weeklyGrowth: 71, momentum: 79, searchVolume: 22000, opportunityScore: 94, contentGap: true, format: "long_form", relatedKeywords: ["thumbnail design", "CTR hack", "click rate"] },
  { id: "t9", keyword: "crypto beginner guide 2025", category: "finance", weeklyGrowth: 39, momentum: 62, searchVolume: 85000, opportunityScore: 51, contentGap: false, format: "long_form", relatedKeywords: ["bitcoin basics", "defi explained", "crypto wallet"] },
  { id: "t10", keyword: "coding project for portfolio", category: "tech", weeklyGrowth: 46, momentum: 67, searchVolume: 43000, opportunityScore: 76, contentGap: true, format: "long_form", relatedKeywords: ["developer portfolio", "github projects", "react projects"] },
  { id: "t11", keyword: "small channel growth tips", category: "general", weeklyGrowth: 55, momentum: 73, searchVolume: 31000, opportunityScore: 89, contentGap: true, format: "any", relatedKeywords: ["youtube strategy", "0-1000 subs", "algorithm tips"] },
  { id: "t12", keyword: "meditation for anxiety shorts", category: "lifestyle", weeklyGrowth: 82, momentum: 86, searchVolume: 44000, opportunityScore: 83, contentGap: false, format: "short", relatedKeywords: ["mindfulness", "breathwork", "stress relief"] },
];

const CATEGORIES = ["all", "general", "tech", "finance", "lifestyle", "gaming", "education"];
const FORMATS = [
  { value: "all", label: "All formats" },
  { value: "long_form", label: "Long-form" },
  { value: "short", label: "Shorts" },
  { value: "live", label: "Live" },
];

export function TrendsClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [format, setFormat] = useState("all");
  const [sort, setSort] = useState<"momentum" | "growth" | "opportunity">("momentum");

  const filtered = useMemo(() => {
    return ALL_TRENDS
      .filter((t) => {
        if (search && !t.keyword.toLowerCase().includes(search.toLowerCase())) return false;
        if (category !== "all" && t.category !== category) return false;
        if (format !== "all" && t.format !== format && t.format !== "any") return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "momentum") return b.momentum - a.momentum;
        if (sort === "growth") return b.weeklyGrowth - a.weeklyGrowth;
        return b.opportunityScore - a.opportunityScore;
      });
  }, [search, category, format, sort]);

  const topTrend = ALL_TRENDS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Trend Discovery</h1>
        <p className="text-sm text-muted-foreground">
          AI-detected trending topics and content opportunities
          <Badge variant="outline" className="ml-2 border-amber-500/40 text-amber-400 text-[10px]">
            Demo data
          </Badge>
        </p>
      </div>

      {/* Hero trend */}
      <div className="rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-600/10 to-cyan-600/5 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-violet-500/15 p-2">
            <Flame className="h-5 w-5 text-violet-400" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium text-violet-400">Hottest trend right now</p>
              <Badge className="bg-violet-500/15 text-violet-400 text-[10px]">+{topTrend?.weeklyGrowth}% this week</Badge>
            </div>
            <h2 className="mt-1 text-lg font-bold text-foreground">{topTrend?.keyword}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {topTrend?.searchVolume.toLocaleString()} monthly searches · Opportunity score {topTrend?.opportunityScore}/100
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {topTrend?.relatedKeywords.map((k) => (
                <Badge key={k} variant="outline" className="border-violet-500/30 text-violet-300 text-xs">
                  {k}
                </Badge>
              ))}
            </div>
          </div>
          <div className="hidden shrink-0 text-right md:block">
            <div className="rounded-xl bg-violet-500/10 px-4 py-3">
              <p className="text-3xl font-bold text-violet-300">{topTrend?.momentum}</p>
              <p className="text-[10px] text-violet-400/70">Momentum</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="trending">
        <TabsList className="h-auto gap-1 bg-card/50 p-1">
          <TabsTrigger value="trending" className="gap-1.5 text-xs">
            <TrendingUp className="h-3.5 w-3.5" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="gap-1.5 text-xs">
            <Star className="h-3.5 w-3.5" />
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="rising" className="gap-1.5 text-xs">
            <ArrowUpRight className="h-3.5 w-3.5" />
            Rising Creators
          </TabsTrigger>
          <TabsTrigger value="chart" className="gap-1.5 text-xs">
            <Zap className="h-3.5 w-3.5" />
            Trend Graph
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search trends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 max-w-xs text-sm"
            />
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium capitalize transition-all",
                    category === c
                      ? "bg-primary text-white"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMATS.map((f) => (
                  <SelectItem key={f.value} value={f.value} className="text-xs">
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="momentum" className="text-xs">By momentum</SelectItem>
                <SelectItem value="growth" className="text-xs">By growth</SelectItem>
                <SelectItem value="opportunity" className="text-xs">By opportunity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-xl border border-border/60 bg-card/50 p-8 text-center">
              <p className="text-muted-foreground">No trends match your filters.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="opportunities" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {ALL_TRENDS.filter((t) => t.contentGap && t.opportunityScore >= 75)
              .sort((a, b) => b.opportunityScore - a.opportunityScore)
              .map((trend) => (
                <TrendCard key={trend.id} trend={trend} highlight="opportunity" />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="rising" className="mt-4">
          <RisingCreators />
        </TabsContent>

        <TabsContent value="chart" className="mt-4">
          <TrendChart trends={ALL_TRENDS.slice(0, 5)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
