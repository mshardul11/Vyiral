"use server";

import { z } from "zod";
import { hasOpenAIKey } from "@/lib/ai/has-openai";
import { mockTitleGeneration } from "@/lib/mock/titles";
import { generateTitles } from "@/lib/openai/services/title-generator";
import { scoreTitle } from "@/lib/scoring/title";
import { generatedTitlesRepository } from "@/server/repositories";
import { activityLogRepository } from "@/server/repositories";
import { getActionContext } from "@/server/actions/context";
import { newId } from "@/lib/utils/id";
import { toActionError } from "@/lib/utils/errors";
import type { ActionResult } from "@/types/api";
import type { TitleGenerationResult, TitleStyle, TitleVariant } from "@/types/intelligence";
import type { TitleVariantMeta } from "@/types/entities";

const generateSchema = z.object({
  topic: z.string().min(2).max(200),
  count: z.number().min(5).max(50).default(20),
  focusKeyword: z.string().optional(),
  styles: z.array(z.string()).optional(),
  projectId: z.string().optional(),
});

const STYLES: TitleStyle[] = [
  "high_ctr",
  "educational",
  "curiosity_gap",
  "storytelling",
  "authority",
  "listicle",
  "controversial",
  "viral_challenge",
  "minimalist",
];

function toVariants(
  titles: string[],
  topic: string,
  focusKeyword?: string
): TitleVariant[] {
  return titles.map((text, i) => {
    const style = STYLES[i % STYLES.length]!;
    return { text, style, ...scoreTitle(text, style, focusKeyword), favorite: false };
  }).sort((a, b) => b.overallScore - a.overallScore);
}

function rehydrateTitleVariant(v: TitleVariantMeta, index: number): TitleVariant {
  const style = STYLES.includes(v.style as TitleStyle)
    ? (v.style as TitleStyle)
    : STYLES[index % STYLES.length]!;

  const hasAllScores =
    typeof v.ctrScore === "number" &&
    typeof v.lengthScore === "number" &&
    typeof v.keywordDensity === "number" &&
    Array.isArray(v.emotionalTriggers) &&
    typeof v.overallScore === "number";

  if (hasAllScores) {
    return {
      text: v.text,
      style,
      ctrScore: v.ctrScore,
      lengthScore: v.lengthScore,
      keywordDensity: v.keywordDensity,
      emotionalTriggers: v.emotionalTriggers,
      overallScore: v.overallScore,
      favorite: v.favorite,
    };
  }

  const scored = scoreTitle(v.text, style);
  return {
    text: v.text,
    style,
    ctrScore: scored.ctrScore,
    lengthScore: scored.lengthScore,
    keywordDensity: scored.keywordDensity,
    emotionalTriggers: scored.emotionalTriggers,
    overallScore: scored.overallScore,
    favorite: v.favorite ?? false,
  };
}

export async function generateTitleBatch(
  input: z.infer<typeof generateSchema>
): Promise<ActionResult<TitleGenerationResult>> {
  try {
    const ctx = await getActionContext(input.projectId);
    if (!ctx) return { success: false, error: "Unauthorized" };

    const parsed = generateSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Invalid input" };

    let variants: TitleVariant[];

    if (hasOpenAIKey()) {
      const data = await generateTitles({
        topic: parsed.data.topic,
        niche: ctx.prompt.niche,
        count: parsed.data.count,
      });
      variants = toVariants(data.titles, parsed.data.topic, parsed.data.focusKeyword);
    } else {
      const mock = mockTitleGeneration(
        parsed.data.topic,
        parsed.data.count,
        parsed.data.focusKeyword
      );
      variants = mock.variants;
    }

    const id = newId("titles");
    const meta: TitleVariantMeta[] = variants;
    await generatedTitlesRepository.create(id, {
      workspaceId: ctx.workspaceId,
      projectId: parsed.data.projectId,
      topic: parsed.data.topic,
      titles: variants.map((v) => v.text),
      variants: meta,
      selectedIndex: 0,
    });

    await activityLogRepository.log({
      workspaceId: ctx.workspaceId,
      userId: ctx.uid,
      type: "titles_generated",
      message: `Generated ${variants.length} titles for "${parsed.data.topic}"`,
    });

    return {
      success: true,
      data: {
        id,
        topic: parsed.data.topic,
        variants,
        bestIndex: 0,
      },
    };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function listTitleHistory(
  projectId?: string
): Promise<ActionResult<TitleGenerationResult[]>> {
  try {
    const ctx = await getActionContext(projectId);
    if (!ctx) return { success: false, error: "Unauthorized" };

    const { items } = await generatedTitlesRepository.listByWorkspace(ctx.workspaceId, {
      limit: 20,
      projectId,
    });

    const data: TitleGenerationResult[] = items.map((doc) => {
      const raw = doc.variants ?? doc.titles.map((text, i) => {
        const style = STYLES[i % STYLES.length]!;
        return { text, style, ...scoreTitle(text, style), favorite: false };
      });
      const variants: TitleVariant[] = raw.map((v, i) => rehydrateTitleVariant(v, i));
      return {
        id: doc.id,
        topic: doc.topic,
        variants,
        bestIndex: doc.selectedIndex ?? 0,
      };
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
