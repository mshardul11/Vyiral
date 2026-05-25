"use server";

import { getWorkspaceContext } from "@/server/actions/context";
import {
  generatedDescriptionsRepository,
  activityLogRepository,
} from "@/server/repositories";
import { generateMockDescription } from "@/lib/mock/ai-generators";
import { createJsonCompletion } from "@/lib/openai/client";
import { SYSTEM_VYIRAL_SEO, descriptionPrompt } from "@/lib/openai/prompts/builders";
import { descriptionResponseSchema } from "@/lib/openai/schemas";
import { scoreSeoDescription } from "@/lib/scoring";
import type { ActionResult } from "@/types/api";
import type { DescriptionLength, GeneratedDescriptionResult } from "@/types/seo";
import { toActionError } from "@/lib/utils/errors";

export async function generateDescriptionAction(params: {
  topic: string;
  format: DescriptionLength;
  title?: string;
  keywords?: string[];
}): Promise<ActionResult<{ result: GeneratedDescriptionResult; source: "ai" | "mock" }>> {
  try {
    const ctx = await getWorkspaceContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    let result: GeneratedDescriptionResult;
    let source: "ai" | "mock" = "mock";

    if (process.env.OPENAI_API_KEY) {
      try {
        const { data } = await createJsonCompletion({
          schemaName: "description",
          system: SYSTEM_VYIRAL_SEO,
          user: descriptionPrompt(params.topic, ctx.niche, params.format, params.title),
          parse: (raw) => descriptionResponseSchema.parse(raw),
        });
        const seo = scoreSeoDescription(
          data.description,
          params.keywords ?? [params.topic]
        );
        result = {
          description: data.description,
          hooks: data.hooks,
          chapters: data.timestamps ?? [],
          ctas: data.ctas ?? ["Subscribe for more"],
          hashtags: data.hashtags ?? [],
          seoScore: seo.total,
          readabilityScore: 75,
          format: params.format,
        };
        source = "ai";
      } catch {
        result = generateMockDescription(params.topic, params.format);
      }
    } else {
      result = generateMockDescription(params.topic, params.format);
    }

    await generatedDescriptionsRepository.create(`desc_${Date.now()}`, {
      workspaceId: ctx.user.workspaceId,
      topic: params.topic,
      description: result.description,
      hooks: result.hooks,
    });

    await activityLogRepository.log({
      workspaceId: ctx.user.workspaceId,
      userId: ctx.uid,
      type: "description_generation",
      message: `Generated ${params.format} description`,
    });

    return { success: true, data: { result, source } };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
