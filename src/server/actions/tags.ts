"use server";

import { z } from "zod";
import { hasOpenAIKey } from "@/lib/ai/has-openai";
import { mockTagGeneration } from "@/lib/mock/tags";
import { generateTags } from "@/lib/openai/services/tag-generator";
import { generatedTagsRepository } from "@/server/repositories";
import { getActionContext } from "@/server/actions/context";
import { newId } from "@/lib/utils/id";
import { toActionError } from "@/lib/utils/errors";
import type { ActionResult } from "@/types/api";
import type { TagGenerationResult } from "@/types/intelligence";

const schema = z.object({
  source: z.string().min(2).max(500),
  sourceType: z.enum(["keyword", "title", "url", "topic"]).default("topic"),
  projectId: z.string().optional(),
});

export async function generateTagBatch(
  input: z.infer<typeof schema>
): Promise<ActionResult<TagGenerationResult>> {
  try {
    const ctx = await getActionContext(input.projectId);
    if (!ctx) return { success: false, error: "Unauthorized" };

    const parsed = schema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Invalid input" };

    let result: TagGenerationResult;

    if (hasOpenAIKey()) {
      const data = await generateTags({
        topic: parsed.data.source,
        niche: ctx.prompt.niche,
      });
      result = {
        id: newId("tags"),
        source: parsed.data.source,
        tags: data.tags.map((tag, i) => ({
          tag,
          relevanceScore: 90 - i * 2,
          trendScore: 70 + (i % 5) * 4,
          group: data.categories?.[i % (data.categories?.length ?? 1)] ?? "Topic",
        })),
      };
    } else {
      result = mockTagGeneration(parsed.data.source);
    }

    await generatedTagsRepository.create(result.id, {
      workspaceId: ctx.workspaceId,
      projectId: parsed.data.projectId,
      videoTopic: parsed.data.source,
      tags: result.tags.map((t) => t.tag),
      tagItems: result.tags,
      sourceType: parsed.data.sourceType,
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function listTagHistory(
  projectId?: string
): Promise<ActionResult<TagGenerationResult[]>> {
  try {
    const ctx = await getActionContext(projectId);
    if (!ctx) return { success: false, error: "Unauthorized" };

    const { items } = await generatedTagsRepository.listByWorkspace(ctx.workspaceId, {
      limit: 15,
      projectId,
    });

    return {
      success: true,
      data: items.map((doc) => ({
        id: doc.id,
        source: doc.videoTopic,
        tags:
          doc.tagItems ??
          doc.tags.map((tag, i) => ({
            tag,
            relevanceScore: 80,
            trendScore: 65,
            group: "Topic",
          })),
      })),
    };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
