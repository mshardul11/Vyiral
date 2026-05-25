"use server";

import { z } from "zod";
import { hasOpenAIKey } from "@/lib/ai/has-openai";
import { mockContentIdeas } from "@/lib/mock/ideas";
import { generateContentIdeas } from "@/lib/openai/services/content-ideas";
import { contentIdeasRepository } from "@/server/repositories";
import { getActionContext } from "@/server/actions/context";
import { newId } from "@/lib/utils/id";
import { toActionError } from "@/lib/utils/errors";
import type { ActionResult } from "@/types/api";
import type { ContentIdeaItem, ContentIdeasResult } from "@/types/intelligence";

const generateSchema = z.object({
  projectId: z.string().optional(),
});

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["backlog", "planned", "filming", "published"]),
});

export async function generateIdeasBatch(
  input: z.infer<typeof generateSchema> = {}
): Promise<ActionResult<ContentIdeasResult>> {
  try {
    const ctx = await getActionContext(input.projectId);
    if (!ctx) return { success: false, error: "Unauthorized" };

    let result: ContentIdeasResult;

    if (hasOpenAIKey()) {
      const data = await generateContentIdeas({
        niche: ctx.prompt.niche,
        audience: ctx.prompt.audience,
      });
      result = {
        ideas: data.ideas.map((idea, i) => ({
          id: newId("idea"),
          type: "video",
          title: idea.title,
          hook: idea.hook,
          thumbnailConcept: `Visual for: ${idea.title}`,
          audienceType: ctx.prompt.audience,
          viralProbability: idea.estimatedDifficulty === "low" ? 78 : idea.estimatedDifficulty === "medium" ? 62 : 45,
          contentAngle: idea.angle,
          estimatedCompetition: idea.estimatedDifficulty === "low" ? 35 : idea.estimatedDifficulty === "medium" ? 55 : 75,
          recommendedPublishTime: "Saturday 10 AM IST",
          status: "backlog",
          favorite: false,
        })),
        summary: `Generated ${data.ideas.length} ideas for ${ctx.prompt.niche}`,
      };
    } else {
      result = mockContentIdeas(ctx.prompt.niche, ctx.prompt.audience);
    }

    await contentIdeasRepository.batchCreate(
      result.ideas.map((idea) => ({
        id: idea.id,
        data: {
          workspaceId: ctx.workspaceId,
          projectId: input.projectId,
          title: idea.title,
          angle: idea.contentAngle,
          hook: idea.hook,
          format: idea.type,
          estimatedDifficulty:
            idea.estimatedCompetition < 45
              ? "low"
              : idea.estimatedCompetition < 65
                ? "medium"
                : "high",
          ideaType: idea.type,
          thumbnailConcept: idea.thumbnailConcept,
          audienceType: idea.audienceType,
          viralProbability: idea.viralProbability,
          estimatedCompetition: idea.estimatedCompetition,
          recommendedPublishTime: idea.recommendedPublishTime,
          status: idea.status,
          favorite: idea.favorite,
        },
      }))
    );

    return { success: true, data: result };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function listIdeas(projectId?: string): Promise<ActionResult<ContentIdeaItem[]>> {
  try {
    const ctx = await getActionContext(projectId);
    if (!ctx) return { success: false, error: "Unauthorized" };

    const { items } = await contentIdeasRepository.listByWorkspace(ctx.workspaceId, {
      limit: 80,
      projectId,
    });

    const ideas: ContentIdeaItem[] = items.map((doc) => ({
      id: doc.id,
      type: doc.ideaType ?? "video",
      title: doc.title,
      hook: doc.hook,
      thumbnailConcept: doc.thumbnailConcept ?? "",
      audienceType: doc.audienceType ?? ctx.prompt.audience,
      viralProbability: doc.viralProbability ?? 60,
      contentAngle: doc.angle,
      estimatedCompetition: doc.estimatedCompetition ?? 50,
      recommendedPublishTime: doc.recommendedPublishTime ?? "Weekly",
      status: doc.status ?? "backlog",
      favorite: doc.favorite ?? false,
    }));

    return { success: true, data: ideas };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function updateIdeaStatus(
  input: z.infer<typeof updateStatusSchema>
): Promise<ActionResult<ContentIdeaItem>> {
  try {
    const ctx = await getActionContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const parsed = updateStatusSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Invalid status" };

    const doc = await contentIdeasRepository.getById(parsed.data.id);
    if (!doc || doc.workspaceId !== ctx.workspaceId) {
      return { success: false, error: "Not found" };
    }

    const updated = await contentIdeasRepository.update(parsed.data.id, {
      status: parsed.data.status,
    });

    return {
      success: true,
      data: {
        id: updated.id,
        type: updated.ideaType ?? "video",
        title: updated.title,
        hook: updated.hook,
        thumbnailConcept: updated.thumbnailConcept ?? "",
        audienceType: updated.audienceType ?? "",
        viralProbability: updated.viralProbability ?? 60,
        contentAngle: updated.angle,
        estimatedCompetition: updated.estimatedCompetition ?? 50,
        recommendedPublishTime: updated.recommendedPublishTime ?? "",
        status: updated.status ?? "backlog",
        favorite: updated.favorite ?? false,
      },
    };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function toggleIdeaFavorite(
  id: string,
  favorite: boolean
): Promise<ActionResult<void>> {
  try {
    const ctx = await getActionContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const doc = await contentIdeasRepository.getById(id);
    if (!doc || doc.workspaceId !== ctx.workspaceId) {
      return { success: false, error: "Not found" };
    }

    await contentIdeasRepository.update(id, { favorite });
    return { success: true };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
