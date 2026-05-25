"use server";

import { buildRecommendations } from "@/server/ai/recommendation-engine";
import { keywordsRepository } from "@/server/repositories/keywords-repository";
import { auditsRepository } from "@/server/repositories";
import { getActionContext } from "@/server/actions/context";
import { toActionError } from "@/lib/utils/errors";
import type { ActionResult } from "@/types/api";
import type { CreatorRecommendation } from "@/types/intelligence";

export async function getCreatorRecommendations(): Promise<
  ActionResult<CreatorRecommendation[]>
> {
  try {
    const ctx = await getActionContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const keywords = await keywordsRepository.topOpportunities(ctx.workspaceId, 10);
    const audits = await auditsRepository.listByWorkspace(ctx.workspaceId, { limit: 1 });
    const latest = audits.items[0];

    const data = buildRecommendations({
      keywords,
      niche: ctx.prompt.niche,
      hasAudit: Boolean(latest),
      auditScore: latest?.overallScore,
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
