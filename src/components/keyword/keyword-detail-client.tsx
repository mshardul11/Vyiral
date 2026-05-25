"use client";

import Link from "next/link";
import { Sparkles, Tags, FileText, Lightbulb } from "lucide-react";
import type { KeywordResearchResult } from "@/types/seo";
import { ScoreRing } from "@/components/shared/score-badge";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function KeywordDetailClient({
  keyword,
  detail,
}: {
  keyword: KeywordResearchResult;
  detail: {
    relatedTopics: string[];
    videoAngles: string[];
    competitorOpportunities: string[];
    aiRecommendations: string[];
    suggestedHooks: string[];
    thumbnailConcepts: string[];
    rankingDifficulty: number;
  };
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{keyword.keyword}</h1>
          <p className="mt-2 text-muted-foreground">
            Topic: {keyword.topic} · {keyword.contentFormatRecommendation}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{keyword.searchIntent}</Badge>
            <Badge variant="outline">Trend {keyword.trendDirection}</Badge>
          </div>
        </div>
        <ScoreRing score={keyword.opportunityScore} size={80} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <p className="text-xs text-muted-foreground">Volume Est.</p>
          <p className="text-xl font-bold">{keyword.searchVolumeEstimate.toLocaleString()}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Competition</p>
          <p className="text-xl font-bold">{keyword.competitionScore}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">SEO difficulty</p>
          <p className="text-xl font-bold">{keyword.seoDifficulty}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Rank difficulty</p>
          <p className="text-xl font-bold">{detail.rankingDifficulty}</p>
        </GlassCard>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="gradient" asChild>
          <Link href={`/titles?keyword=${encodeURIComponent(keyword.keyword)}`}>
            <Sparkles className="h-4 w-4" />
            Generate titles
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href={`/tags?topic=${encodeURIComponent(keyword.keyword)}`}>
            <Tags className="h-4 w-4" />
            Tags
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href={`/descriptions?topic=${encodeURIComponent(keyword.keyword)}`}>
            <FileText className="h-4 w-4" />
            Description
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href={`/ideas?topic=${encodeURIComponent(keyword.topic)}`}>
            <Lightbulb className="h-4 w-4" />
            Ideas
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InsightList title="Related topics" items={detail.relatedTopics} />
        <InsightList title="Video angles" items={detail.videoAngles} />
        <InsightList title="Competitor gaps" items={detail.competitorOpportunities} />
        <InsightList title="AI recommendations" items={detail.aiRecommendations} />
        <InsightList title="Suggested hooks" items={detail.suggestedHooks} />
        <InsightList title="Thumbnail concepts" items={detail.thumbnailConcepts} />
      </div>

      <div>
        <h2 className="mb-2 font-semibold">Related & question keywords</h2>
        <div className="flex flex-wrap gap-2">
          {[...keyword.relatedKeywords, ...keyword.questionKeywords].map((k) => (
            <Badge key={k} variant="outline">
              {k}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  return (
    <GlassCard>
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-border/40 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
