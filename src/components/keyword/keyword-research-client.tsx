"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  Heart,
  Minus,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { EstBadge } from "@/components/tools/est-badge";
import { ExportMenu } from "@/components/tools/export-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWorkspace } from "@/contexts/workspace-context";
import { useToast } from "@/hooks/use-toast";
import {
  listKeywords,
  researchKeywords,
  toggleKeywordFavorite,
  toggleKeywordSaved,
} from "@/server/actions/keywords";
import type { KeywordResult } from "@/types/intelligence";
import { cn } from "@/lib/utils";

type SortKey = "opportunity" | "volume" | "competition" | "difficulty";

export function KeywordResearchClient() {
  const { activeProject } = useWorkspace();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [keywords, setKeywords] = useState<KeywordResult[]>([]);
  const [clusters, setClusters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [sort, setSort] = useState<SortKey>("opportunity");
  const [clusterFilter, setClusterFilter] = useState<string | "all">("all");
  const [intentFilter, setIntentFilter] = useState<string | "all">("all");
  const [selected, setSelected] = useState<KeywordResult | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await listKeywords(activeProject?.id);
    if (res.success && res.data) setKeywords(res.data);
    setLoading(false);
  }, [activeProject?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const runSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    const res = await researchKeywords({
      query: query.trim(),
      projectId: activeProject?.id,
    });
    setSearching(false);
    if (res.success && res.data) {
      setKeywords(res.data.keywords);
      setClusters(res.data.clusters);
      toast({ title: "Research complete", description: res.data.summary });
    } else {
      toast({ title: "Research failed", description: res.error, variant: "destructive" });
    }
  };

  const filtered = useMemo(() => {
    let list = [...keywords];
    if (clusterFilter !== "all") list = list.filter((k) => k.cluster === clusterFilter);
    if (intentFilter !== "all") list = list.filter((k) => k.intentType === intentFilter);
    list.sort((a, b) => {
      if (sort === "opportunity") return b.opportunityScore - a.opportunityScore;
      if (sort === "volume") return b.searchVolumeEstimate - a.searchVolumeEstimate;
      if (sort === "competition") return a.competitionScore - b.competitionScore;
      return a.seoDifficulty - b.seoDifficulty;
    });
    return list;
  }, [keywords, clusterFilter, intentFilter, sort]);

  const toggleSaved = async (k: KeywordResult) => {
    const res = await toggleKeywordSaved(k.id, !k.saved);
    if (res.success && res.data) {
      setKeywords((prev) => prev.map((x) => (x.id === k.id ? res.data! : x)));
      if (selected?.id === k.id) setSelected(res.data);
    }
  };

  const toggleFav = async (k: KeywordResult) => {
    const res = await toggleKeywordFavorite(k.id, !k.favorite);
    if (res.success && res.data) {
      setKeywords((prev) => prev.map((x) => (x.id === k.id ? res.data! : x)));
    }
  };

  const TrendIcon = ({ dir }: { dir: KeywordResult["trendDirection"] }) => {
    if (dir === "up") return <ArrowUp className="h-3 w-3 text-emerald-400" />;
    if (dir === "down") return <ArrowDown className="h-3 w-3 text-amber-400" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <div className="pb-8">
      <ToolPageHeader
        title="Keyword research"
        description="Discover opportunities with volume, competition, intent, and clusters — all metrics are estimates."
        badge="AI + scoring"
        actions={
          <ExportMenu
            csvRows={filtered.map((k) => ({
              keyword: k.keyword,
              volume: k.searchVolumeEstimate,
              opportunity: k.opportunityScore,
              competition: k.competitionScore,
              intent: k.intentType,
              cluster: k.cluster,
            }))}
            copyText={filtered.map((k) => k.keyword).join("\n")}
          />
        }
      />

      <Card className="mb-6 border-primary/20">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="glass-input pl-9"
              placeholder="Search a topic or niche… e.g. farming tips for villages"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void runSearch()}
            />
          </div>
          <Button variant="gradient" onClick={() => void runSearch()} disabled={searching}>
            <Sparkles className="mr-2 h-4 w-4" />
            {searching ? "Researching…" : "Research"}
          </Button>
        </CardContent>
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        <select
          className="glass-input h-9 rounded-lg px-3 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="opportunity">Sort: Opportunity</option>
          <option value="volume">Sort: Volume</option>
          <option value="competition">Sort: Competition</option>
          <option value="difficulty">Sort: SEO difficulty</option>
        </select>
        <select
          className="glass-input h-9 rounded-lg px-3 text-sm"
          value={clusterFilter}
          onChange={(e) => setClusterFilter(e.target.value)}
        >
          <option value="all">All clusters</option>
          {clusters.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="glass-input h-9 rounded-lg px-3 text-sm"
          value={intentFilter}
          onChange={(e) => setIntentFilter(e.target.value)}
        >
          <option value="all">All intents</option>
          {["educational", "tutorial", "entertainment", "comparison", "transactional", "trending"].map(
            (i) => (
              <option key={i} value={i}>
                {i}
              </option>
            )
          )}
        </select>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground">
            Enter a topic above to generate keyword opportunities.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((k) => (
            <Card
              key={k.id}
              className={cn(
                "cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg",
                selected?.id === k.id && "border-primary/40 ring-1 ring-primary/30"
              )}
              onClick={() => setSelected(k)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{k.keyword}</CardTitle>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        void toggleFav(k);
                      }}
                    >
                      <Heart
                        className={cn("h-4 w-4", k.favorite && "fill-primary text-primary")}
                      />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        void toggleSaved(k);
                      }}
                    >
                      <Bookmark
                        className={cn("h-4 w-4", k.saved && "fill-primary text-primary")}
                      />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-[10px]">
                    {k.intentType}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {k.cluster}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Opportunity</span>
                  <span className="font-semibold text-primary">{k.opportunityScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    Volume <EstBadge />
                  </span>
                  <span>{k.searchVolumeEstimate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trend</span>
                  <span className="flex items-center gap-1">
                    <TrendIcon dir={k.trendDirection} /> {k.trendScore}
                  </span>
                </div>
                <Link
                  href={`/keywords/${k.id}`}
                  className="inline-block pt-1 text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open detail →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="glass-panel w-full overflow-y-auto sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.keyword}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <p className="text-muted-foreground">{selected.contentFormat}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="glass-panel rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">SEO difficulty</p>
                    <p className="text-lg font-bold">{selected.seoDifficulty}</p>
                  </div>
                  <div className="glass-panel rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Opportunity</p>
                    <p className="text-lg font-bold text-primary">{selected.opportunityScore}</p>
                  </div>
                </div>
                <div>
                  <p className="mb-1 font-medium">Related</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.relatedKeywords.map((r) => (
                      <Badge key={r} variant="outline">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-1 font-medium">Questions</p>
                  <ul className="list-inside list-disc text-muted-foreground">
                    {selected.questionKeywords.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </div>
                <Button variant="gradient" className="w-full" asChild>
                  <Link href={`/keywords/${selected.id}`}>Full analysis</Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
