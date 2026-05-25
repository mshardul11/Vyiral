"use server";

import { getWorkspaceContext } from "@/server/actions/context";
import { generatedTitlesRepository, activityLogRepository } from "@/server/repositories";
import { generateMockTitles } from "@/lib/mock/ai-generators";
import { createJsonCompletion } from "@/lib/openai/client";
import { SYSTEM_VYIRAL_SEO, titlesPrompt } from "@/lib/openai/prompts/builders";
import { titlesResponseSchema } from "@/lib/openai/schemas";
import { enrichTitleScores } from "@/lib/scoring";
import type { ActionResult } from "@/types/api";
import type { ScoredTitle, TitleStyle } from "@/types/seo";
import { toActionError } from "@/lib/utils/errors";

export async function generateTitlesAction(params: {
  topic: string;
  style: TitleStyle;
  count: number;
  keyword?: string;
}): Promise<ActionResult<{ titles: ScoredTitle[]; source: "ai" | "mock" }>> {
  try {
    const ctx = await getWorkspaceContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    let titles: ScoredTitle[];
    let source: "ai" | "mock" = "mock";

    if (process.env.OPENAI_API_KEY) {
      try {
        const { data } = await createJsonCompletion({
          schemaName: "titles",
          system: SYSTEM_VYIRAL_SEO,
          user: titlesPrompt(params.topic, ctx.niche, params.style, params.count, params.keyword),
          parse: (raw) => titlesResponseSchema.parse(raw),
        });
        titles = enrichTitleScores(data.titles.slice(0, params.count), params.style, params.keyword);
        source = "ai";
      } catch {
        titles = generateMockTitles(params.topic, params.style, params.count, params.keyword);
      }
    } else {
      titles = generateMockTitles(params.topic, params.style, params.count, params.keyword);
    }

    const id = `titles_${Date.now()}`;
    await generatedTitlesRepository.create(id, {
      workspaceId: ctx.user.workspaceId,
      topic: params.topic,
      titles: titles.map((t) => t.title),
    });

    await activityLogRepository.log({
      workspaceId: ctx.user.workspaceId,
      userId: ctx.uid,
      type: "title_generation",
      message: `Generated ${titles.length} titles for "${params.topic}"`,
    });

    return { success: true, data: { titles, source } };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
