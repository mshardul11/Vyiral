export interface ScoreBreakdown {
  score: number;
  label: string;
  factors: Array<{ name: string; impact: number; note: string }>;
}

export interface WeightedScoreInput {
  weights: Record<string, number>;
  values: Record<string, number>;
}
