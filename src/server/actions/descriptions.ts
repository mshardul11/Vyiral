"use server";

import { z } from "zod";
import { hasOpenAIKey } from "@/lib/ai/has-openai";
import { mockDescriptionGeneration } from "@/lib/mock/descriptions";
import { generateDescription } from "@/lib/openai/services/description-generator";
import { scoreDescriptionSeo } from "@/lib/scoring/seo";
import { generatedDescriptionsRepository } from "@/server/repositories";
import { getActionContext } from "@/server/actions/context";
import { newId } from "@/lib/utils/id";
import { toActionError } from "@/lib/utils/errors";
import type { ActionResult } from "@/types/api";
import type { DescriptionGenerationResult } from "@/types/intelligence";

const schema = z.object({
  topic: z.string().min(2).max(200),
  title: z.string().optional(),
  projectId: z.string().optional(),
});

export async function generateDescriptionBatch(
  input: z.infer<typeof schema>
): Promise<ActionResult<DescriptionGenerationResult>> {
  try {
    const ctx = await getActionContext(input.projectId);
    if (!ctx) return { success: false, error: "Unauthorized" };

    const parsed = schema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Invalid input" };

    let result: DescriptionGenerationResult;

    if (hasOpenAIKey()) {
      const data = await generateDescription({
        topic: parsed.data.topic,
        niche: ctx.prompt.niche,
        title: parsed.data.title,
      });
      const text = data.description;
      const { seoScore, readabilityScore } = scoreDescriptionSeo(text, [parsed.data.topic]);
      result = {
        id: newId("desc"),
        topic: parsed.data.topic,
        variants: [
          {
            length: "medium",
            text,
            seoScore,
            readabilityScore,
            hashtags: [`#${parsed.data.topic.replace(/\s+/g, "")}`, "#youtube"],
            chapters: data.timestamps ?? [],
            cta: "Subscribe for more videos like this.",
          },
        ],
      };
    } else {
      result = mockDescriptionGeneration(parsed.data.topic, parsed.data.title);
    }

    const primary =
      result.variants.find((v) => v.length === "medium") ?? result.variants[0];
    if (!primary) {
      return { success: false, error: "No description generated" };
    }

    await generatedDescriptionsRepository.create(result.id, {
      workspaceId: ctx.workspaceId,
      projectId: parsed.data.projectId,
      topic: parsed.data.topic,
      description: primary.text,
      hooks: [],
      variants: result.variants,
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
