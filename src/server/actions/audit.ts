"use server";

import { z } from "zod";
import { hasOpenAIKey } from "@/lib/ai/has-openai";
import { mockChannelAudit } from "@/lib/mock/audit";
import { mapAuditDocToResult, mapOpenAiAuditToResult } from "@/lib/intelligence/audit-mapper";
import { generateChannelAudit } from "@/lib/openai/services/channel-audit";
import { auditsRepository } from "@/server/repositories";
import { getActionContext } from "@/server/actions/context";
import { newId } from "@/lib/utils/id";
import { toActionError } from "@/lib/utils/errors";
import type { ActionResult } from "@/types/api";
import type { ChannelAuditResult } from "@/types/intelligence";

const schema = z.object({
  channelId: z.string().min(3).max(100),
  channelTitle: z.string().min(1).max(120),
  projectId: z.string().optional(),
});

export async function runAudit(
  input: z.infer<typeof schema>
): Promise<ActionResult<ChannelAuditResult>> {
  try {
    const ctx = await getActionContext(input.projectId);
    if (!ctx) return { success: false, error: "Unauthorized" };

    const parsed = schema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Invalid channel" };

    let result: ChannelAuditResult;

    if (hasOpenAIKey()) {
      const summary = `Channel: ${parsed.data.channelTitle} (${parsed.data.channelId}). Niche: ${ctx.prompt.niche}.`;
      const data = await generateChannelAudit(summary);
      result = mapOpenAiAuditToResult(data, {
        id: newId("audit"),
        channelId: parsed.data.channelId,
        channelTitle: parsed.data.channelTitle,
      });
    } else {
      result = mockChannelAudit(parsed.data.channelId, parsed.data.channelTitle);
    }

    await auditsRepository.create(result.id, {
      workspaceId: ctx.workspaceId,
      projectId: parsed.data.projectId,
      channelId: parsed.data.channelId,
      channelTitle: parsed.data.channelTitle,
      overallScore: result.overallScore,
      categories: result.subScores.map((s) => ({
        name: s.name,
        score: s.score,
        summary: s.summary,
      })),
      // Legacy field mirrors nextSteps only — not used for opportunities on read
      recommendations: result.nextSteps,
      issues: result.issues,
      opportunities: result.opportunities,
      nextSteps: result.nextSteps,
      weakPatterns: result.weakPatterns,
      strongThemes: result.strongThemes,
      dataQuality: "estimated",
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function getLatestAudit(): Promise<ActionResult<ChannelAuditResult | null>> {
  try {
    const ctx = await getActionContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const { items } = await auditsRepository.listByWorkspace(ctx.workspaceId, { limit: 1 });
    const doc = items[0];
    if (!doc) return { success: true, data: null };

    return { success: true, data: mapAuditDocToResult(doc) };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
