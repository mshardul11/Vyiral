"use server";

import { getWorkspaceContext } from "@/server/actions/context";
import { contentIdeasRepository, activityLogRepository } from "@/server/repositories";
import { generateMockContentIdeas } from "@/lib/mock/ai-generators";
import { createJsonCompletion } from "@/lib/openai/client";
import { SYSTEM_VYIRAL_SEO, contentIdeasPrompt } from "@/lib/openai/prompts/builders";
import { contentIdeasResponseSchema } from "@/lib/openai/schemas";
import type { ActionResult } from "@/types/api";
import type { ContentIdeaResult } from "@/types/seo";
import { toActionError } from "@/lib/utils/errors";

export async function generateContentIdeasAction(
  topic: string
): Promise<ActionResult<{ ideas: ContentIdeaResult[]; source: "ai" | "mock" }>> {
  try {
    const ctx = await getWorkspaceContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    let ideas: ContentIdeaResult[];
    let source: "ai" | "mock" = "mock";

    if (process.env.OPENAI_API_KEY) {
      try {
        const { data } = await createJsonCompletion({
          schemaName: "contentIdeas",
          system: SYSTEM_VYIRAL_SEO,
          user: contentIdeasPrompt(topic, ctx.niche, ctx.audience),
          parse: (raw) => contentIdeasResponseSchema.parse(raw),
        });
        ideas = data.ideas.map((idea, i) => ({
          id: `idea_${Date.now()}_${i}`,
          title: idea.title,
          hook: idea.hook,
          thumbnailConcept: idea.thumbnailConcept ?? "Bold text overlay",
          audienceType: idea.audienceType ?? "Mixed",
          viralProbability: idea.viralProbability ?? 55,
          contentAngle: idea.contentAngle ?? idea.format,
          estimatedCompetition: idea.estimatedCompetition ?? "medium",
          recommendedPublishTime: idea.recommendedPublishTime ?? "Thu 6pm",
          format: idea.format,
          series: idea.series ?? undefined,
        }));
        source = "ai";
      } catch {
        ideas = generateMockContentIdeas(topic);
      }
    } else {
      ideas = generateMockContentIdeas(topic);
    }

    await activityLogRepository.log({
      workspaceId: ctx.user.workspaceId,
      userId: ctx.uid,
      type: "content_ideas",
      message: `Generated ${ideas.length} content ideas`,
    });

    return { success: true, data: { ideas, source } };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function saveContentIdea(
  idea: ContentIdeaResult,
  projectId?: string
): Promise<ActionResult<void>> {
  try {
    const ctx = await getWorkspaceContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    await contentIdeasRepository.create(idea.id, {
      workspaceId: ctx.user.workspaceId,
      projectId,
      title: idea.title,
      angle: idea.contentAngle,
      hook: idea.hook,
      format: idea.format,
      estimatedDifficulty: idea.estimatedCompetition,
    });

    return { success: true };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
