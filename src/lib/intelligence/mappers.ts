import type { KeywordDoc, KeywordIntentType, SearchIntent } from "@/types/entities";
import type { KeywordResult } from "@/types/intelligence";
import {
  scoreKeywordOpportunity,
  trendDirectionFromScore,
} from "@/lib/scoring/keyword";

const INTENT_MAP: Record<SearchIntent, KeywordIntentType> = {
  informational: "educational",
  navigational: "comparison",
  commercial: "transactional",
  transactional: "transactional",
};

export function mapKeywordDoc(doc: KeywordDoc): KeywordResult {
  return {
    id: doc.id,
    keyword: doc.keyword,
    topic: doc.topic,
    searchVolumeEstimate: doc.searchVolumeEstimate,
    competitionScore: doc.competitionScore,
    opportunityScore: doc.opportunityScore,
    seoDifficulty: doc.seoDifficulty ?? doc.competitionScore,
    trendScore: doc.trendScore,
    trendDirection: doc.trendDirection ?? trendDirectionFromScore(doc.trendScore),
    intentType: doc.intentType ?? INTENT_MAP[doc.searchIntent],
    contentFormat: doc.contentFormat ?? "Long-form tutorial",
    cluster: doc.cluster ?? "General",
    relatedKeywords: doc.relatedKeywords,
    questionKeywords: doc.questionKeywords,
    saved: doc.saved,
    favorite: doc.favorite ?? false,
  };
}

export function enrichKeywordFromRaw(
  raw: {
    keyword: string;
    searchIntent: SearchIntent;
    searchVolumeEstimate: number;
    competitionScore: number;
    opportunityScore?: number;
    trendScore: number;
    relatedKeywords: string[];
    questionKeywords: string[];
    intentType?: KeywordIntentType;
    contentFormat?: string;
    cluster?: string;
  },
  topic: string,
  id: string
): KeywordResult {
  const intentType =
    raw.intentType ?? INTENT_MAP[raw.searchIntent] ?? "educational";
  const scored = scoreKeywordOpportunity({
    searchVolumeEstimate: raw.searchVolumeEstimate,
    competitionScore: raw.competitionScore,
    trendScore: raw.trendScore,
    intentType,
  });

  return {
    id,
    keyword: raw.keyword,
    topic,
    searchVolumeEstimate: raw.searchVolumeEstimate,
    competitionScore: raw.competitionScore,
    opportunityScore: raw.opportunityScore ?? scored.opportunityScore,
    seoDifficulty: scored.seoDifficulty,
    trendScore: raw.trendScore,
    trendDirection: trendDirectionFromScore(raw.trendScore),
    intentType,
    contentFormat: raw.contentFormat ?? "Long-form tutorial",
    cluster: raw.cluster ?? "General",
    relatedKeywords: raw.relatedKeywords,
    questionKeywords: raw.questionKeywords,
    saved: false,
    favorite: false,
  };
}
