import type { ScoredTitle } from "@/types/seo";

export interface ScoreBreakdown {
  score: number;
  label: string;
  weight: number;
  value: number;
  explanation: string;
}

export interface ExplainableScore {
  total: number;
  breakdown: ScoreBreakdown[];
  grade: "A" | "B" | "C" | "D" | "F";
}

function gradeFromScore(score: number): ExplainableScore["grade"] {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

export function scoreKeywordOpportunity(params: {
  searchVolume: number;
  competition: number;
  trend: number;
  seoDifficulty: number;
}): ExplainableScore {
  const volumeNorm = Math.min(100, (params.searchVolume / 50000) * 100);
  const competitionInv = 100 - params.competition;
  const trendW = params.trend;
  const difficultyInv = 100 - params.seoDifficulty;

  const breakdown: ScoreBreakdown[] = [
    {
      label: "Volume",
      weight: 0.3,
      value: volumeNorm,
      score: volumeNorm * 0.3,
      explanation: "Estimated search demand relative to niche ceiling",
    },
    {
      label: "Low competition",
      weight: 0.25,
      value: competitionInv,
      score: competitionInv * 0.25,
      explanation: "Inverse of crowded SERP / suggestion density",
    },
    {
      label: "Trend",
      weight: 0.25,
      value: trendW,
      score: trendW * 0.25,
      explanation: "Momentum direction for the topic cluster",
    },
    {
      label: "Rankability",
      weight: 0.2,
      value: difficultyInv,
      score: difficultyInv * 0.2,
      explanation: "Ease of ranking for mid-size channels",
    },
  ];

  const total = Math.round(breakdown.reduce((s, b) => s + b.score, 0));
  return { total, breakdown, grade: gradeFromScore(total) };
}

export function scoreTitle(title: string, targetKeyword?: string): ExplainableScore {
  const len = title.length;
  const lengthScore =
    len >= 40 && len <= 65 ? 100 : len < 30 ? 60 : len > 80 ? 50 : 80;
  const hasNumber = /\d/.test(title) ? 90 : 70;
  const hasPowerWord = /(secret|ultimate|how|why|best|vs|free|proven)/i.test(title)
    ? 95
    : 75;
  const keywordBonus =
    targetKeyword && title.toLowerCase().includes(targetKeyword.toLowerCase())
      ? 100
      : 65;

  const breakdown: ScoreBreakdown[] = [
    {
      label: "Length",
      weight: 0.25,
      value: lengthScore,
      score: lengthScore * 0.25,
      explanation: "Optimal YouTube title length 40–65 chars",
    },
    {
      label: "Curiosity",
      weight: 0.25,
      value: hasPowerWord,
      score: hasPowerWord * 0.25,
      explanation: "Power words and curiosity triggers",
    },
    {
      label: "Specificity",
      weight: 0.2,
      value: hasNumber,
      score: hasNumber * 0.2,
      explanation: "Numbers and specificity improve CTR",
    },
    {
      label: "Keyword fit",
      weight: 0.3,
      value: keywordBonus,
      score: keywordBonus * 0.3,
      explanation: "Target keyword presence in title",
    },
  ];

  const total = Math.round(breakdown.reduce((s, b) => s + b.score, 0));
  return { total, breakdown, grade: gradeFromScore(total) };
}

export function scoreSeoDescription(text: string, keywords: string[]): ExplainableScore {
  const wordCount = text.split(/\s+/).length;
  const lengthScore = wordCount >= 150 && wordCount <= 400 ? 90 : 65;
  const keywordHits = keywords.filter((k) =>
    text.toLowerCase().includes(k.toLowerCase())
  ).length;
  const keywordScore = Math.min(100, (keywordHits / Math.max(1, keywords.length)) * 100);
  const hasCta = /subscribe|link|comment|follow/i.test(text) ? 90 : 60;

  const breakdown: ScoreBreakdown[] = [
    { label: "Length", weight: 0.35, value: lengthScore, score: lengthScore * 0.35, explanation: "Description depth for indexing" },
    { label: "Keywords", weight: 0.4, value: keywordScore, score: keywordScore * 0.4, explanation: "Target keyword coverage" },
    { label: "CTA", weight: 0.25, value: hasCta, score: hasCta * 0.25, explanation: "Clear calls-to-action" },
  ];

  const total = Math.round(breakdown.reduce((s, b) => s + b.score, 0));
  return { total, breakdown, grade: gradeFromScore(total) };
}

export function scoreChannelHealth(subScores: Record<string, number>): ExplainableScore {
  const values = Object.values(subScores);
  const total = values.length
    ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    : 0;
  const breakdown: ScoreBreakdown[] = Object.entries(subScores).map(([label, value]) => ({
    label,
    weight: 1 / values.length,
    value,
    score: value / values.length,
    explanation: `${label} performance vs. niche benchmarks`,
  }));
  return { total, breakdown, grade: gradeFromScore(total) };
}

export function enrichTitleScores(
  titles: string[],
  style: ScoredTitle["style"],
  targetKeyword?: string
): ScoredTitle[] {
  return titles.map((title) => {
    const explained = scoreTitle(title, targetKeyword);
    const triggers: string[] = [];
    if (/how|why|what/i.test(title)) triggers.push("curiosity");
    if (/\d/.test(title)) triggers.push("specificity");
    if (/(you|your)/i.test(title)) triggers.push("personal");
    return {
      title,
      style,
      ctrScore: Math.min(99, explained.total + Math.floor(Math.random() * 8)),
      emotionalTriggers: triggers,
      keywordDensity: targetKeyword
        ? (title.toLowerCase().split(targetKeyword.toLowerCase()).length - 1) * 15
        : 0,
      lengthScore: title.length >= 40 && title.length <= 65 ? 95 : 70,
      overallScore: explained.total,
      reasoning: explained.breakdown.map((b) => b.explanation).join("; "),
    };
  });
}
