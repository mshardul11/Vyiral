import type { KeywordIntentType } from "@/types/entities";
import type { TrendDirection } from "@/types/intelligence";
import { buildBreakdown, weightedScore } from "./weighted";
import type { ScoreBreakdown } from "./types";

export function scoreKeywordOpportunity(params: {
  searchVolumeEstimate: number;
  competitionScore: number;
  trendScore: number;
  intentType?: KeywordIntentType;
}): { opportunityScore: number; seoDifficulty: number; breakdown: ScoreBreakdown } {
  const volumeNorm = Math.min(100, (params.searchVolumeEstimate / 50000) * 100);
  const competitionInverse = 100 - params.competitionScore;
  const intentBoost =
    params.intentType === "tutorial" || params.intentType === "educational"
      ? 8
      : params.intentType === "trending"
        ? 12
        : 0;

  const opportunityScore = weightedScore({
    weights: { volume: 0.35, competition: 0.4, trend: 0.25 },
    values: {
      volume: volumeNorm,
      competition: competitionInverse,
      trend: params.trendScore,
    },
  });

  const seoDifficulty = weightedScore({
    weights: { competition: 0.6, volume: 0.25, trend: 0.15 },
    values: {
      competition: params.competitionScore,
      volume: volumeNorm,
      trend: 100 - params.trendScore,
    },
  });

  const breakdown = buildBreakdown("Keyword opportunity", [
    {
      name: "Search volume (est.)",
      impact: volumeNorm,
      note: `~${params.searchVolumeEstimate.toLocaleString()} monthly searches (modeled)`,
    },
    {
      name: "Competition",
      impact: competitionInverse,
      note: `${params.competitionScore}/100 competition — lower is easier`,
    },
    {
      name: "Trend momentum",
      impact: params.trendScore,
      note: `${params.trendScore}/100 trend score`,
    },
    {
      name: "Intent fit",
      impact: Math.min(100, 60 + intentBoost),
      note: params.intentType ?? "general",
    },
  ]);

  return {
    opportunityScore: Math.min(100, opportunityScore + Math.round(intentBoost / 2)),
    seoDifficulty,
    breakdown,
  };
}

export function trendDirectionFromScore(score: number): TrendDirection {
  if (score >= 62) return "up";
  if (score <= 38) return "down";
  return "stable";
}
