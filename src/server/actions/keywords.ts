"use server";

import { z } from "zod";
import { hasOpenAIKey } from "@/lib/ai/has-openai";
import { enrichKeywordFromRaw } from "@/lib/intelligence/mappers";
import { mockKeywordResearch } from "@/lib/mock/keywords";
import { buildKeywordResearchPrompt } from "@/lib/openai/prompts/builders";
import { createJsonCompletion } from "@/lib/openai/client";
import { keywordsResponseSchema } from "@/lib/openai/schemas";
import { buildSystemPrompt } from "@/lib/openai/prompts/builders";
import { keywordsRepository } from "@/server/repositories/keywords-repository";
import { activityLogRepository } from "@/server/repositories";
import { getActionContext } from "@/server/actions/context";
import { newId } from "@/lib/utils/id";
import { toActionError } from "@/lib/utils/errors";
import type { ActionResult } from "@/types/api";
import type { KeywordDetailInsight, KeywordResearchResult, KeywordResult } from "@/types/intelligence";
import { mapKeywordDoc } from "@/lib/intelligence/mappers";
import type { KeywordDoc } from "@/types/entities";

const researchSchema = z.object({
  query: z.string().min(2).max(120),
  projectId: z.string().optional(),
});

export async function researchKeywords(
  input: z.infer<typeof researchSchema>
): Promise<ActionResult<KeywordResearchResult>> {
  try {
    const ctx = await getActionContext(input.projectId);
    if (!ctx) return { success: false, error: "Unauthorized" };

    const parsed = researchSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Invalid query" };

    let result: KeywordResearchResult;

    if (hasOpenAIKey()) {
      const prompt = buildKeywordResearchPrompt(ctx.prompt, parsed.data.query);
      const { data } = await createJsonCompletion({
        schemaName: "keywords-expanded",
        system: buildSystemPrompt(ctx.prompt),
        user: prompt,
        parse: (raw) => keywordsResponseSchema.parse(raw),
      });

      const keywords = data.keywords.map((k) =>
        enrichKeywordFromRaw(k, parsed.data.query, newId("kw"))
      );

      result = {
        keywords,
        clusters: [...new Set(keywords.map((k) => k.cluster))],
        summary: data.summary ?? `Research for "${parsed.data.query}"`,
        query: parsed.data.query,
      };
    } else {
      result = mockKeywordResearch(parsed.data.query, ctx.prompt.niche);
    }

    await keywordsRepository.batchCreate(
      result.keywords.map((k) => ({
        id: k.id,
        data: {
          workspaceId: ctx.workspaceId,
          projectId: parsed.data.projectId,
          keyword: k.keyword,
          topic: k.topic,
          searchIntent: "informational" as const,
          searchVolumeEstimate: k.searchVolumeEstimate,
          competitionScore: k.competitionScore,
          opportunityScore: k.opportunityScore,
          trendScore: k.trendScore,
          seoDifficulty: k.seoDifficulty,
          trendDirection: k.trendDirection,
          intentType: k.intentType,
          contentFormat: k.contentFormat,
          cluster: k.cluster,
          relatedKeywords: k.relatedKeywords,
          questionKeywords: k.questionKeywords,
          saved: false,
          favorite: false,
        },
      }))
    );

    await activityLogRepository.log({
      workspaceId: ctx.workspaceId,
      userId: ctx.uid,
      type: "keyword_research",
      message: `Researched keywords for "${parsed.data.query}"`,
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function listKeywords(projectId?: string): Promise<ActionResult<KeywordResult[]>> {
  try {
    const ctx = await getActionContext(projectId);
    if (!ctx) return { success: false, error: "Unauthorized" };

    const { items } = await keywordsRepository.listByWorkspace(ctx.workspaceId, {
      limit: 100,
      projectId,
    });
    return { success: true, data: items.map(mapKeywordDoc) };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function getKeywordById(id: string): Promise<ActionResult<KeywordDetailInsight>> {
  try {
    const ctx = await getActionContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const doc = await keywordsRepository.getById(id);
    if (!doc || doc.workspaceId !== ctx.workspaceId) {
      return { success: false, error: "Keyword not found" };
    }

    const keyword = mapKeywordDoc(doc);
    const insight: KeywordDetailInsight = {
      keyword,
      relatedTopics: doc.relatedKeywords.slice(0, 8),
      videoAngles: [
        `Beginner guide to ${doc.keyword}`,
        `Mistakes people make with ${doc.keyword}`,
        `${doc.keyword} — village / local angle`,
      ],
      competitorOpportunities: [
        `Few creators combine "${doc.keyword}" with Shorts`,
        `Question titles around "${doc.questionKeywords[0] ?? doc.keyword}"`,
      ],
      hooks: [
        `I tried ${doc.keyword} so you don't have to`,
        `The truth about ${doc.keyword} in 2025`,
      ],
      thumbnailConcepts: [
        `Bold "${doc.keyword}" text + reaction face`,
        `Before/after split with high contrast`,
      ],
      aiRecommendations: [
        `Publish a tutorial-format video — intent is ${keyword.intentType}`,
        `Target ${keyword.contentFormat} structure`,
        `Best cluster: ${keyword.cluster}`,
      ],
      rankingDifficulty: keyword.seoDifficulty,
    };

    return { success: true, data: insight };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function toggleKeywordSaved(
  id: string,
  saved: boolean
): Promise<ActionResult<KeywordResult>> {
  try {
    const ctx = await getActionContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const doc = await keywordsRepository.getById(id);
    if (!doc || doc.workspaceId !== ctx.workspaceId) {
      return { success: false, error: "Not found" };
    }

    const updated = await keywordsRepository.update(id, { saved });
    return { success: true, data: mapKeywordDoc(updated) };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function toggleKeywordFavorite(
  id: string,
  favorite: boolean
): Promise<ActionResult<KeywordResult>> {
  try {
    const ctx = await getActionContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const doc = await keywordsRepository.getById(id);
    if (!doc || doc.workspaceId !== ctx.workspaceId) {
      return { success: false, error: "Not found" };
    }

    const updated = await keywordsRepository.update(id, { favorite });
    return { success: true, data: mapKeywordDoc(updated) };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
