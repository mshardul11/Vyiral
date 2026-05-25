"use server";

import { withAuthAction } from "@/lib/auth/action";
import {
  getWorkspaceContext,
  type WorkspaceContext,
} from "@/lib/auth/server";
import { keywordsRepository, activityLogRepository } from "@/server/repositories";
import { generateMockKeywords, generateMockKeywordDetail } from "@/lib/mock/keyword-generator";
import { createJsonCompletion } from "@/lib/openai/client";
import { SYSTEM_VYIRAL_SEO, keywordResearchPrompt } from "@/lib/openai/prompts/builders";
import { keywordsResponseSchema } from "@/lib/openai/schemas";
import { scoreKeywordOpportunity } from "@/lib/scoring";
import type { ActionResult } from "@/types/api";
import type { KeywordResearchResult, ContentIntent, TrendDirection } from "@/types/seo";
import type { KeywordDoc } from "@/types/entities";
import { toActionError } from "@/lib/utils/errors";

function toResult(
  item: {
    keyword: string;
    searchIntent: ContentIntent;
    searchVolumeEstimate: number;
    competitionScore: number;
    opportunityScore?: number;
    seoDifficulty?: number;
    trendScore: number;
    trendDirection?: TrendDirection;
    contentFormatRecommendation?: string;
    relatedKeywords: string[];
    questionKeywords: string[];
    cluster?: string;
  },
  topic: string,
  id?: string
): KeywordResearchResult {
  const seoDifficulty = item.seoDifficulty ?? Math.round(item.competitionScore * 0.9);
  const opportunity =
    item.opportunityScore ??
    scoreKeywordOpportunity({
      searchVolume: item.searchVolumeEstimate,
      competition: item.competitionScore,
      trend: item.trendScore,
      seoDifficulty,
    }).total;

  return {
    id: id ?? `kw_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    keyword: item.keyword,
    topic,
    searchVolumeEstimate: item.searchVolumeEstimate,
    competitionScore: item.competitionScore,
    opportunityScore: opportunity,
    seoDifficulty,
    trendScore: item.trendScore,
    trendDirection: item.trendDirection ?? "stable",
    searchIntent: item.searchIntent,
    contentFormatRecommendation:
      item.contentFormatRecommendation ?? "Long-form tutorial",
    relatedKeywords: item.relatedKeywords,
    questionKeywords: item.questionKeywords,
    cluster: item.cluster,
  };
}

export async function researchKeywords(
  topic: string
): Promise<ActionResult<{ keywords: KeywordResearchResult[]; summary?: string; source: "ai" | "mock" }>> {
  return withAuthAction(async (ctx) => {
    const trimmed = topic.trim();
    if (!trimmed) throw new Error("Enter a topic");

    let keywords: KeywordResearchResult[];
    let summary: string | undefined;
    let source: "ai" | "mock" = "mock";

    if (process.env.OPENAI_API_KEY) {
      try {
        const { data } = await createJsonCompletion({
          schemaName: "keywordResearch",
          system: SYSTEM_VYIRAL_SEO,
          user: keywordResearchPrompt(trimmed, ctx.niche, ctx.audience),
          parse: (raw) => keywordsResponseSchema.parse(raw),
        });
        keywords = data.keywords.map((k) => toResult(k, trimmed));
        summary = data.summary;
        source = "ai";
      } catch {
        keywords = generateMockKeywords(trimmed, ctx.niche);
      }
    } else {
      keywords = generateMockKeywords(trimmed, ctx.niche);
    }

    await logKeywordResearch(ctx, trimmed, keywords.length, source);

    return { keywords, summary, source };
  });
}

async function logKeywordResearch(
  ctx: WorkspaceContext,
  topic: string,
  count: number,
  source: string
) {
  await activityLogRepository.log({
    workspaceId: ctx.user.workspaceId,
    userId: ctx.uid,
    type: "keyword_research",
    message: `Researched keywords for "${topic}"`,
    metadata: { count, source },
  });
}

export async function listSavedKeywords(): Promise<ActionResult<KeywordDoc[]>> {
  try {
    const ctx = await getWorkspaceContext();
    if (!ctx) return { success: false, error: "Unauthorized" };
    const result = await keywordsRepository.listByWorkspace(ctx.user.workspaceId, {
      limit: 100,
      orderBy: "opportunityScore",
      orderDirection: "desc",
    });
    return { success: true, data: result.items };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function saveKeyword(
  keyword: KeywordResearchResult,
  projectId?: string
): Promise<ActionResult<KeywordDoc>> {
  try {
    const ctx = await getWorkspaceContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const id = keyword.id.startsWith("kw_") ? keyword.id : `kw_${Date.now()}`;
    const doc = await keywordsRepository.create(id, {
      workspaceId: ctx.user.workspaceId,
      projectId,
      keyword: keyword.keyword,
      topic: keyword.topic,
      searchIntent: mapIntentToLegacy(keyword.searchIntent),
      searchVolumeEstimate: keyword.searchVolumeEstimate,
      competitionScore: keyword.competitionScore,
      opportunityScore: keyword.opportunityScore,
      trendScore: keyword.trendScore,
      relatedKeywords: keyword.relatedKeywords,
      questionKeywords: keyword.questionKeywords,
      saved: true,
      seoDifficulty: keyword.seoDifficulty,
      trendDirection: keyword.trendDirection,
      contentIntent: keyword.searchIntent,
      contentFormatRecommendation: keyword.contentFormatRecommendation,
      cluster: keyword.cluster,
    } as Parameters<typeof keywordsRepository.create>[1]);

    return { success: true, data: doc };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function toggleKeywordFavorite(
  id: string,
  saved: boolean
): Promise<ActionResult<void>> {
  try {
    const ctx = await getWorkspaceContext();
    if (!ctx) return { success: false, error: "Unauthorized" };
    await keywordsRepository.update(id, { saved });
    return { success: true };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function getKeywordById(
  id: string
): Promise<ActionResult<KeywordResearchResult & { detail: ReturnType<typeof generateMockKeywordDetail> }>> {
  try {
    const ctx = await getWorkspaceContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const doc = await keywordsRepository.getById(id);
    if (!doc) return { success: false, error: "Keyword not found" };

    const result: KeywordResearchResult = {
      id: doc.id,
      keyword: doc.keyword,
      topic: doc.topic,
      searchVolumeEstimate: doc.searchVolumeEstimate,
      competitionScore: doc.competitionScore,
      opportunityScore: doc.opportunityScore,
      seoDifficulty: (doc as KeywordDoc & { seoDifficulty?: number }).seoDifficulty ?? 50,
      trendScore: doc.trendScore,
      trendDirection:
        ((doc as KeywordDoc & { trendDirection?: TrendDirection }).trendDirection) ?? "stable",
      searchIntent:
        ((doc as KeywordDoc & { contentIntent?: ContentIntent }).contentIntent) ?? "educational",
      contentFormatRecommendation:
        (doc as KeywordDoc & { contentFormatRecommendation?: string })
          .contentFormatRecommendation ?? "Tutorial",
      relatedKeywords: doc.relatedKeywords,
      questionKeywords: doc.questionKeywords,
      cluster: (doc as KeywordDoc & { cluster?: string }).cluster,
      saved: doc.saved,
    };

    const detail = generateMockKeywordDetail(doc.keyword, ctx.niche);
    return { success: true, data: { ...result, detail } };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

function mapIntentToLegacy(
  intent: ContentIntent
): "informational" | "navigational" | "commercial" | "transactional" {
  if (intent === "transactional") return "transactional";
  if (intent === "comparison") return "commercial";
  if (intent === "entertainment" || intent === "trending") return "navigational";
  return "informational";
}
