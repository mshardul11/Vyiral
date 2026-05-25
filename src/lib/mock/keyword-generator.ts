import type { ContentIntent, KeywordResearchResult, TrendDirection } from "@/types/seo";
import { scoreKeywordOpportunity } from "@/lib/scoring";

const INTENTS: ContentIntent[] = [
  "educational",
  "entertainment",
  "transactional",
  "comparison",
  "tutorial",
  "trending",
];

const FORMATS = [
  "Long-form tutorial",
  "Short explainer",
  "Listicle roundup",
  "Case study",
  "Reaction / commentary",
  "Challenge format",
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function seeded(seed: string, min: number, max: number): number {
  return min + (hash(seed) % (max - min + 1));
}

function trendDirection(seed: string): TrendDirection {
  const v = hash(seed) % 3;
  return v === 0 ? "up" : v === 1 ? "down" : "stable";
}

export function generateMockKeywords(
  topic: string,
  niche: string,
  count = 12
): KeywordResearchResult[] {
  const base = topic.trim().toLowerCase() || "youtube growth";
  const prefixes = ["how to", "best", "why", "vs", "top", ""];
  const suffixes = ["2025", "for beginners", "tips", "guide", "explained", ""];

  const keywords: KeywordResearchResult[] = [];
  const clusters = ["Core topic", "Questions", "Comparisons", "Trending"];

  for (let i = 0; i < count; i++) {
    const kw =
      i === 0
        ? base
        : `${prefixes[i % prefixes.length]} ${base} ${suffixes[i % suffixes.length]}`.trim();
    const seed = `${niche}:${kw}:${i}`;
    const volume = seeded(seed, 1200, 89000);
    const competition = seeded(seed + "c", 25, 92);
    const trend = seeded(seed + "t", 30, 98);
    const seoDifficulty = seeded(seed + "d", 20, 85);
    const opportunity = scoreKeywordOpportunity({
      searchVolume: volume,
      competition,
      trend,
      seoDifficulty,
    }).total;

    keywords.push({
      id: `mock_${hash(kw)}_${i}`,
      keyword: kw,
      topic: base,
      searchVolumeEstimate: volume,
      competitionScore: competition,
      opportunityScore: opportunity,
      seoDifficulty,
      trendScore: trend,
      trendDirection: trendDirection(seed),
      searchIntent: INTENTS[i % INTENTS.length]!,
      contentFormatRecommendation: FORMATS[i % FORMATS.length]!,
      relatedKeywords: [
        `${base} tutorial`,
        `${base} tips`,
        `${base} strategy`,
      ].slice(0, 3),
      questionKeywords: [
        `how to ${base}`,
        `what is ${base}`,
        `why ${base} matters`,
      ],
      cluster: clusters[i % clusters.length],
    });
  }

  return keywords.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

export function generateMockKeywordDetail(
  keyword: string,
  niche: string
): {
  relatedTopics: string[];
  videoAngles: string[];
  competitorOpportunities: string[];
  aiRecommendations: string[];
  suggestedHooks: string[];
  thumbnailConcepts: string[];
  rankingDifficulty: number;
} {
  const seed = hash(keyword);
  return {
    relatedTopics: [
      `${keyword} fundamentals`,
      `${keyword} advanced tactics`,
      `${niche} + ${keyword} workflow`,
    ],
    videoAngles: [
      `I tried ${keyword} for 30 days`,
      `The truth about ${keyword} in ${niche}`,
      `${keyword}: complete beginner guide`,
    ],
    competitorOpportunities: [
      "Gap: Short-form explainers under 60s",
      "Gap: Comparison videos with data visuals",
      "Gap: Weekly series with consistent branding",
    ],
    aiRecommendations: [
      `Lead with a bold hook about ${keyword} outcomes`,
      "Add chapters in the first 48 hours for retention",
      "Pair with 3 related tags from your top cluster",
    ],
    suggestedHooks: [
      `Stop ignoring ${keyword} if you want growth`,
      `Nobody talks about this ${keyword} mistake`,
      `I wish I knew this about ${keyword} sooner`,
    ],
    thumbnailConcepts: [
      "Split face + bold 3-word text",
      "Before/after metric overlay",
      "High-contrast icon + question mark",
    ],
    rankingDifficulty: 20 + (seed % 65),
  };
}
