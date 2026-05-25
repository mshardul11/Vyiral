import type { KeywordIntentType } from "@/types/entities";
import type { KeywordResearchResult, KeywordResult } from "@/types/intelligence";
import {
  scoreKeywordOpportunity,
  trendDirectionFromScore,
} from "@/lib/scoring/keyword";
import { pick, randInt, seededRandom } from "./seed";

const CLUSTERS = ["How-to guides", "Tool reviews", "Beginner tips", "Trending topics", "Case studies"];
const FORMATS = ["Long-form tutorial", "Short explainer", "Listicle", "Comparison", "Story vlog"];
const INTENTS: KeywordIntentType[] = [
  "educational",
  "tutorial",
  "entertainment",
  "comparison",
  "transactional",
  "trending",
];

const SUFFIXES = [
  "for beginners",
  "2025",
  "step by step",
  "in hindi",
  "tips",
  "mistakes",
  "vs",
  "full course",
  "village",
  "without equipment",
];

function expandKeyword(base: string, topic: string, rng: () => number): KeywordResult {
  const suffix = pick(rng, SUFFIXES);
  const keyword = `${base} ${suffix}`.trim();
  const competitionScore = randInt(rng, 22, 88);
  const trendScore = randInt(rng, 30, 95);
  const searchVolumeEstimate = randInt(rng, 1200, 98000);
  const intentType = pick(rng, INTENTS);
  const scored = scoreKeywordOpportunity({
    searchVolumeEstimate,
    competitionScore,
    trendScore,
    intentType,
  });

  return {
    id: `kw_${keyword.replace(/\W+/g, "_").slice(0, 24)}_${randInt(rng, 1000, 9999)}`,
    keyword,
    topic,
    searchVolumeEstimate,
    competitionScore,
    opportunityScore: scored.opportunityScore,
    seoDifficulty: scored.seoDifficulty,
    trendScore,
    trendDirection: trendDirectionFromScore(trendScore),
    intentType,
    contentFormat: pick(rng, FORMATS),
    cluster: pick(rng, CLUSTERS),
    relatedKeywords: Array.from({ length: 3 }, () =>
      `${base} ${pick(rng, SUFFIXES)}`
    ),
    questionKeywords: [
      `how to ${base}`,
      `what is ${base}`,
      `why ${base} matters`,
    ],
    saved: false,
    favorite: false,
  };
}

export function mockKeywordResearch(query: string, niche: string): KeywordResearchResult {
  const rng = seededRandom(`${query}:${niche}`);
  const base = query.toLowerCase().replace(/[^\w\s]/g, "").trim() || "youtube growth";
  const count = randInt(rng, 18, 28);
  const keywords = Array.from({ length: count }, () => expandKeyword(base, query, rng));

  const clusterSet = new Set(keywords.map((k) => k.cluster));
  return {
    keywords,
    clusters: [...clusterSet],
    summary: `Found ${count} estimated opportunities around "${query}" for ${niche} creators. Volumes and competition are modeled — not official YouTube data.`,
    query,
  };
}
