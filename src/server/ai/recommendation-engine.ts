import type { AiRecommendation } from "@/types/seo";
import type { KeywordResearchResult } from "@/types/seo";
import type { ChannelAuditResult } from "@/types/seo";

export function buildRecommendations(params: {
  keywords?: KeywordResearchResult[];
  audit?: ChannelAuditResult | null;
  niche: string;
}): AiRecommendation[] {
  const recs: AiRecommendation[] = [];
  const topKw = params.keywords?.[0];

  if (topKw) {
    recs.push({
      id: "rec_kw",
      type: "keyword",
      title: `Target "${topKw.keyword}"`,
      description: `Opportunity score ${topKw.opportunityScore} · ${topKw.contentFormatRecommendation}`,
      priority: topKw.opportunityScore > 75 ? "high" : "medium",
      score: topKw.opportunityScore,
    });
    recs.push({
      id: "rec_video",
      type: "next_video",
      title: `Film: ${topKw.contentFormatRecommendation}`,
      description: `Angle: ${topKw.searchIntent} intent · trend ${topKw.trendDirection}`,
      priority: "high",
      score: topKw.trendScore,
    });
  }

  if (params.audit) {
    const topIssue = params.audit.issues[0];
    if (topIssue) {
      recs.push({
        id: "rec_seo",
        type: "seo_fix",
        title: topIssue.title,
        description: topIssue.fix,
        priority: topIssue.severity === "high" ? "high" : "medium",
        score: params.audit.overallScore,
      });
    }
    recs.push({
      id: "rec_timing",
      type: "upload_timing",
      title: "Upload Tuesday or Thursday PM",
      description: "Based on cadence analysis — consistent mid-week slots",
      priority: "medium",
      score: params.audit.subScores.cadence ?? 70,
    });
  }

  recs.push({
    id: "rec_gap",
    type: "content_gap",
    title: `Expand ${params.niche} tutorial cluster`,
    description: "Series content builds session time and returning viewers",
    priority: "medium",
    score: 68,
  });

  return recs.sort((a, b) => b.score - a.score).slice(0, 6);
}
