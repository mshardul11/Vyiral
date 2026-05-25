import { buildBreakdown, weightedScore } from "./weighted";
import type { ScoreBreakdown } from "./types";

export function scoreDescriptionSeo(text: string, keywords: string[] = []): {
  seoScore: number;
  readabilityScore: number;
  breakdown: ScoreBreakdown;
} {
  const words = text.split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
  const avgSentence = words / sentences;

  const readabilityScore = weightedScore({
    weights: { length: 0.4, sentence: 0.35, structure: 0.25 },
    values: {
      length: words >= 120 && words <= 400 ? 90 : words >= 80 ? 72 : 55,
      sentence: avgSentence >= 8 && avgSentence <= 22 ? 88 : 65,
      structure: text.includes("\n") ? 85 : 60,
    },
  });

  const keywordHits = keywords.filter((k) =>
    text.toLowerCase().includes(k.toLowerCase())
  ).length;
  const hashtagBonus = (text.match(/#\w+/g) ?? []).length >= 3 ? 10 : 0;
  const linkBonus = text.includes("http") ? 8 : 0;

  const seoScore = weightedScore({
    weights: { keywords: 0.45, length: 0.3, extras: 0.25 },
    values: {
      keywords: Math.min(100, keywordHits * 25 + 30),
      length: words >= 150 ? 88 : 70,
      extras: Math.min(100, 50 + hashtagBonus + linkBonus),
    },
  });

  const breakdown = buildBreakdown("Description SEO", [
    {
      name: "Keyword coverage",
      impact: Math.min(100, keywordHits * 30),
      note: `${keywordHits}/${keywords.length || 0} target keywords used`,
    },
    { name: "Readability", impact: readabilityScore, note: `${words} words, ~${avgSentence.toFixed(0)} words/sentence` },
    { name: "Structure", impact: seoScore, note: "Hashtags, links, and chapters boost discoverability" },
  ]);

  return { seoScore, readabilityScore, breakdown };
}
