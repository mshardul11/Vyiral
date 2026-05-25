import type { ScoreBreakdown, WeightedScoreInput } from "./types";

export function weightedScore(input: WeightedScoreInput): number {
  const entries = Object.entries(input.weights);
  const totalWeight = entries.reduce((s, [, w]) => s + w, 0) || 1;
  const sum = entries.reduce(
    (s, [key, weight]) => s + (input.values[key] ?? 0) * weight,
    0
  );
  return Math.round(Math.min(100, Math.max(0, sum / totalWeight)));
}

export function buildBreakdown(
  label: string,
  factors: ScoreBreakdown["factors"]
): ScoreBreakdown {
  const score = Math.round(
    factors.reduce((s, f) => s + f.impact, 0) / Math.max(factors.length, 1)
  );
  return { score: Math.min(100, Math.max(0, score)), label, factors };
}
