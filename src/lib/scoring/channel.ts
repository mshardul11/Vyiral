import { buildBreakdown, weightedScore } from "./weighted";
import type { ScoreBreakdown } from "./types";

export function scoreChannelHealth(categories: Array<{ name: string; score: number }>): {
  overall: number;
  breakdown: ScoreBreakdown;
} {
  const values = Object.fromEntries(categories.map((c) => [c.name, c.score]));
  const weights = Object.fromEntries(
    categories.map((c) => [c.name, 1 / categories.length])
  );
  const overall = weightedScore({ weights, values });
  const breakdown = buildBreakdown(
    "Channel health",
    categories.map((c) => ({
      name: c.name,
      impact: c.score,
      note: `${c.score}/100`,
    }))
  );
  return { overall, breakdown };
}

export function scoreContentConsistency(uploadsPerMonth: number): number {
  if (uploadsPerMonth >= 12) return 92;
  if (uploadsPerMonth >= 8) return 82;
  if (uploadsPerMonth >= 4) return 68;
  if (uploadsPerMonth >= 2) return 52;
  return 35;
}

export function scoreThumbnailConsistency(variance: number): number {
  return Math.max(40, Math.min(95, 100 - variance));
}
