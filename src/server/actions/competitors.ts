"use server";

import { z } from "zod";
import { mockCompetitorIntel } from "@/lib/mock/competitors";
import { competitorsRepository } from "@/server/repositories";
import { getActionContext } from "@/server/actions/context";
import { newId } from "@/lib/utils/id";
import { toActionError } from "@/lib/utils/errors";
import type { ActionResult } from "@/types/api";
import type { CompetitorChannel, CompetitorIntelligenceResult } from "@/types/intelligence";

const addSchema = z.object({
  channelId: z.string().min(3).max(100),
  channelTitle: z.string().min(1).max(120),
});

export async function addCompetitor(
  input: z.infer<typeof addSchema>
): Promise<ActionResult<CompetitorChannel>> {
  try {
    const ctx = await getActionContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const parsed = addSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Invalid channel" };

    const id = newId("comp");
    const doc = await competitorsRepository.create(id, {
      workspaceId: ctx.workspaceId,
      channelId: parsed.data.channelId,
      channelTitle: parsed.data.channelTitle,
      alertEnabled: true,
      momentumScore: 65,
      keywordOverlap: 40,
      topicOverlap: 38,
      uploadFrequency: "Weekly",
    });

    return {
      success: true,
      data: {
        id: doc.id,
        channelId: doc.channelId,
        channelTitle: doc.channelTitle,
        thumbnailUrl: doc.thumbnailUrl,
        subscriberCount: doc.subscriberCount ?? 0,
        uploadFrequency: doc.uploadFrequency ?? "Weekly",
        momentumScore: doc.momentumScore ?? 50,
        keywordOverlap: doc.keywordOverlap ?? 0,
        topicOverlap: doc.topicOverlap ?? 0,
        alertEnabled: doc.alertEnabled,
      },
    };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function getCompetitorIntelligence(): Promise<
  ActionResult<CompetitorIntelligenceResult>
> {
  try {
    const ctx = await getActionContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const { items } = await competitorsRepository.listByWorkspace(ctx.workspaceId, {
      limit: 20,
    });

    const channels = items.map((doc) => ({
      id: doc.id,
      channelId: doc.channelId,
      channelTitle: doc.channelTitle,
      thumbnailUrl: doc.thumbnailUrl,
      subscriberCount: doc.subscriberCount ?? 0,
      uploadFrequency: doc.uploadFrequency ?? "Weekly",
      momentumScore: doc.momentumScore ?? 55,
      keywordOverlap: doc.keywordOverlap ?? 30,
      topicOverlap: doc.topicOverlap ?? 28,
      alertEnabled: doc.alertEnabled,
    }));

    const intel = mockCompetitorIntel(
      ctx.workspaceId,
      channels.map((c) => c.channelTitle)
    );
    intel.competitors = channels.length ? channels : intel.competitors;

    return { success: true, data: intel };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function removeCompetitor(id: string): Promise<ActionResult<void>> {
  try {
    const ctx = await getActionContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const doc = await competitorsRepository.getById(id);
    if (!doc || doc.workspaceId !== ctx.workspaceId) {
      return { success: false, error: "Not found" };
    }

    await competitorsRepository.delete(id);
    return { success: true };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
