"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  Minus,
  Search,
  Star,
} from "lucide-react";
import {
  researchKeywords,
  listSavedKeywords,
  saveKeyword,
} from "@/server/actions/keywords";
import type { KeywordResearchResult, ContentIntent } from "@/types/seo";
import { SectionHeader } from "@/components/shared/section-header";
import { FilterBar } from "@/components/shared/filter-bar";
import { ScoreBadge } from "@/components/shared/score-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/contexts/workspace-context";
import { copyToClipboard } from "@/lib/utils/export";
import { toolPageMeta } from "@/lib/constants/navigation";

type SortKey = "opportunity" | "volume" | "competition" | "trend";

export function KeywordResearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KeywordResearchResult[]>([]);
  const [saved, setSaved] = useState<KeywordResearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"ai" | "mock">("mock");
  const [sort, setSort] = useState<SortKey>("opportunity");
  const intentFilter = "all";
  const clusterFilter = "all";
  const [drawerKw, setDrawerKw] = useState<KeywordResearchResult | null>(null);
  const { toast } = useToast();
  const { activeProject } = useWorkspace();

  const loadSaved = useCallback(async () => {
    const res = await listSavedKeywords();
    if (res.success && res.data) {
      setSaved(
        res.data.map((d) => ({
          id: d.id,
          keyword: d.keyword,
          topic: d.topic,
          searchVolumeEstimate: d.searchVolumeEstimate,
          competitionScore: d.competitionScore,
          opportunityScore: d.opportunityScore,
          seoDifficulty: d.seoDifficulty ?? 50,
          trendScore: d.trendScore,
          trendDirection: d.trendDirection ?? "stable",
          searchIntent: (d.contentIntent as ContentIntent) ?? "educational",
          contentFormatRecommendation:
            d.contentFormatRecommendation ?? "Tutorial",
          relatedKeywords: d.relatedKeywords,
          questionKeywords: d.questionKeywords,
          cluster: d.cluster,
          saved: d.saved,
        }))
      );
    }
  }, []);

  useEffect(() => {
    void loadSaved();
  }, [loadSaved]);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    const res = await researchKeywords(query.trim());
    setLoading(false);
    if (res.success && res.data) {
      setResults(res.data.keywords);
      setSource(res.data.source);
      toast({ title: "Research complete", description: res.data.summary });
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
  }

  const clusters = useMemo(
    () => [...new Set(results.map((r) => r.cluster).filter(Boolean))] as string[],
    [results]
  );

  const filtered = useMemo(() => {
    let list = [...results];
    if (intentFilter !== "all") {
      list = list.filter((k) => k.searchIntent === intentFilter);
    }
    if (clusterFilter !== "all") {
      list = list.filter((k) => k.cluster === clusterFilter);
    }
    list.sort((a, b) => {
      if (sort === "opportunity") return b.opportunityScore - a.opportunityScore;
      if (sort === "volume") return b.searchVolumeEstimate - a.searchVolumeEstimate;
      if (sort === "competition") return a.competitionScore - b.competitionScore;
      return b.trendScore - a.trendScore;
    });
    return list;
  }, [results, intentFilter, clusterFilter, sort]);

  async function handleSave(kw: KeywordResearchResult) {
    const res = await saveKeyword(kw, activeProject?.id);
    if (res.success) {
      toast({ title: "Saved to project" });
      void loadSaved();
    }
  }

  function TrendIcon({ dir }: { dir: KeywordResearchResult["trendDirection"] }) {
    if (dir === "up") return <ArrowUp className="h-3 w-3 text-emerald-400" />;
    if (dir === "down") return <ArrowDown className="h-3 w-3 text-red-400" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title={toolPageMeta["/keywords"]!.title}
        description={toolPageMeta["/keywords"]!.description}
      />

      <FilterBar onSearchChange={setQuery}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={toolPageMeta["/keywords"]!.placeholder}
          className="max-w-md"
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4" />
          {loading ? "Searching…" : toolPageMeta["/keywords"]!.actionLabel}
        </Button>
      </FilterBar>

      {loading && (
        <div className="grid gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid gap-3">
          {filtered.map((kw) => (
            <div
              key={kw.id}
              className="group rounded-2xl border border-border/60 bg-card/50 p-4 transition-all hover:border-primary/40 hover:bg-card/80"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <button
                  type="button"
                  className="text-left"
                  onClick={() => setDrawerKw(kw)}
                >
                  <h3 className="font-semibold group-hover:text-primary">{kw.keyword}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {kw.contentFormatRecommendation} · {kw.cluster ?? "General"}
                  </p>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <ScoreBadge score={kw.opportunityScore} label="Opp" />
                  <Badge variant="outline" className="gap-1">
                    <TrendIcon dir={kw.trendDirection} />
                    {kw.trendDirection}
                  </Badge>
                  <Badge variant="secondary">{kw.searchIntent}</Badge>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                <span>Vol Est. {kw.searchVolumeEstimate.toLocaleString()}</span>
                <span>Comp {kw.competitionScore}</span>
                <span>SEO diff {kw.seoDifficulty}</span>
                <span>Trend {kw.trendScore}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleSave(kw)}>
                  <Bookmark className="h-3 w-3" />
                  Save
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <Link href={`/keywords/${kw.id}`}>Details</Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(kw.keyword)}
                >
                  Copy
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && (
        <EmptyState
          icon={Search}
          title="Research a topic"
          description="Enter a niche or video topic to generate keyword clusters, questions, and opportunity scores."
        />
      )}

      {saved.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Star className="h-4 w-4 text-primary" />
            Saved keywords
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {saved.map((kw) => (
              <Link
                key={kw.id}
                href={`/keywords/${kw.id}`}
                className="rounded-xl border border-border/40 px-3 py-2 text-sm hover:bg-white/5"
              >
                {kw.keyword}
              </Link>
            ))}
          </div>
        </section>
      )}


      <Sheet open={!!drawerKw} onOpenChange={() => setDrawerKw(null)}>
        <SheetContent>
          {drawerKw && (
            <>
              <SheetHeader>
                <SheetTitle>{drawerKw.keyword}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex flex-wrap gap-2">
                  <ScoreBadge score={drawerKw.opportunityScore} label="Opportunity" />
                  <Badge>{drawerKw.searchIntent}</Badge>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Related</p>
                  <ul className="mt-1 list-inside list-disc">
                    {drawerKw.relatedKeywords.map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Questions</p>
                  <ul className="mt-1 list-inside list-disc">
                    {drawerKw.questionKeywords.map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/keywords/${drawerKw.id}`}>Open full detail</Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
