import type { CreatorRecommendation } from "@/types/intelligence";
import type { KeywordDoc } from "@/types/entities";
import { newId } from "@/lib/utils/id";

export function buildRecommendations(params: {
  keywords: KeywordDoc[];
  niche: string;
  hasAudit: boolean;
  auditScore?: number;
}): CreatorRecommendation[] {
  const recs: CreatorRecommendation[] = [];
  const top = [...params.keywords]
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 3);

  if (top[0]) {
    recs.push({
      id: newId("rec"),
      type: "keyword",
      title: `Target keyword: ${top[0].keyword}`,
      description: `High opportunity (${top[0].opportunityScore}/100 est.) in cluster "${top[0].cluster ?? "General"}".`,
      priority: "high",
      actionHref: `/keywords/${top[0].id}`,
    });
  }

  recs.push({
    id: newId("rec"),
    type: "next_video",
    title: `Next video: ${params.niche} tutorial`,
    description: "Educational tutorials perform well for new audiences in your niche.",
    priority: "high",
    actionHref: "/ideas",
  });

  recs.push({
    id: newId("rec"),
    type: "upload_timing",
    title: "Best upload window: Saturday 10 AM IST",
    description: "Based on audience patterns for regional creators (modeled).",
    priority: "medium",
  });

  if (params.hasAudit && params.auditScore != null && params.auditScore < 70) {
    recs.push({
      id: newId("rec"),
      type: "seo_fix",
      title: "Improve title keyword placement",
      description: "Your audit suggests adding primary keywords earlier in titles.",
      priority: "high",
      actionHref: "/audit",
    });
  }

  recs.push({
    id: newId("rec"),
    type: "content_gap",
    title: "Shorts gap in your niche",
    description: "Competitors underuse quick tip Shorts — easy reach opportunity.",
    priority: "medium",
    actionHref: "/competitors",
  });

  return recs.slice(0, 6);
}
