"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ScoreRing } from "@/components/tools/score-ring";
import { EstBadge } from "@/components/tools/est-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getKeywordById } from "@/server/actions/keywords";
import type { KeywordDetailInsight } from "@/types/intelligence";

export function KeywordDetailClient({ id }: { id: string }) {
  const [insight, setInsight] = useState<KeywordDetailInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const res = await getKeywordById(id);
      if (res.success && res.data) setInsight(res.data);
      else setError(res.error ?? "Not found");
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!insight) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          {error ?? "Keyword not found"}
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link href="/keywords">Back to research</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { keyword } = insight;

  return (
    <div className="pb-8">
      <Button variant="ghost" size="sm" className="mb-4" asChild>
        <Link href="/keywords">
          <ArrowLeft className="mr-2 h-4 w-4" /> Keywords
        </Link>
      </Button>

      <ToolPageHeader
        title={keyword.keyword}
        description={`${keyword.intentType} intent · ${keyword.cluster} · ${keyword.contentFormat}`}
        badge={keyword.intentType}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="gradient" size="sm" asChild>
              <Link href={`/titles?topic=${encodeURIComponent(keyword.keyword)}`}>
                <Wand2 className="mr-2 h-4 w-4" /> Titles
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/tags?source=${encodeURIComponent(keyword.keyword)}`}>Tags</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/descriptions?topic=${encodeURIComponent(keyword.keyword)}`}>
                Description
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/ideas">
                <Sparkles className="mr-2 h-4 w-4" /> Ideas
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col items-center justify-center p-4">
          <ScoreRing score={keyword.opportunityScore} label="Opportunity" />
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Ranking difficulty</p>
          <p className="text-3xl font-bold">{insight.rankingDifficulty}</p>
        </Card>
        <Card className="p-4">
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Volume <EstBadge />
          </p>
          <p className="text-3xl font-bold">{keyword.searchVolumeEstimate.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Competition</p>
          <p className="text-3xl font-bold">{keyword.competitionScore}</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Video angles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {insight.videoAngles.map((a) => (
                <li key={a} className="rounded-lg border border-white/10 p-2">
                  {a}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Suggested hooks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {insight.hooks.map((h) => (
                <li key={h} className="font-medium">
                  “{h}”
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thumbnail concepts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {insight.thumbnailConcepts.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {insight.aiRecommendations.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Related topics & competitor gaps</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Topics</p>
              <div className="flex flex-wrap gap-1">
                {insight.relatedTopics.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                Opportunities
              </p>
              <ul className="text-sm text-muted-foreground">
                {insight.competitorOpportunities.map((o) => (
                  <li key={o}>• {o}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
