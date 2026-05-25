"use server";

import { getWorkspaceContext } from "@/server/actions/context";
import { generatedTagsRepository, activityLogRepository } from "@/server/repositories";
import { generateMockTags } from "@/lib/mock/ai-generators";
import { createJsonCompletion } from "@/lib/openai/client";
import { SYSTEM_VYIRAL_SEO, tagsPrompt } from "@/lib/openai/prompts/builders";
import { tagsResponseSchema } from "@/lib/openai/schemas";
import type { ActionResult } from "@/types/api";
import type { ScoredTag } from "@/types/seo";
import { toActionError } from "@/lib/utils/errors";

export async function generateTagsAction(params: {
  source: string;
  sourceType: "keyword" | "title" | "url" | "topic";
}): Promise<ActionResult<{ tags: ScoredTag[]; source: "ai" | "mock" }>> {
  try {
    const ctx = await getWorkspaceContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const label = `${params.sourceType}: ${params.source}`;
    let tags: ScoredTag[];
    let source: "ai" | "mock" = "mock";

    if (process.env.OPENAI_API_KEY) {
      try {
        const { data } = await createJsonCompletion({
          schemaName: "tags",
          system: SYSTEM_VYIRAL_SEO,
          user: tagsPrompt(label, ctx.niche),
          parse: (raw) => tagsResponseSchema.parse(raw),
        });
        tags = data.tags.map((tag, idx) => ({
          tag,
          relevanceScore: 95 - (idx % 25),
          trendScore: 60 + (idx % 30),
          group: data.categories?.[idx % (data.categories?.length || 1)],
        }));
        source = "ai";
      } catch {
        tags = generateMockTags(params.source);
      }
    } else {
      tags = generateMockTags(params.source);
    }

    await generatedTagsRepository.create(`tags_${Date.now()}`, {
      workspaceId: ctx.user.workspaceId,
      videoTopic: params.source,
      tags: tags.map((t) => t.tag),
    });

    await activityLogRepository.log({
      workspaceId: ctx.user.workspaceId,
      userId: ctx.uid,
      type: "tag_generation",
      message: `Generated tags for ${params.sourceType}`,
    });

    return { success: true, data: { tags, source } };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
