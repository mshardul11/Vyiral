"use server";

import { getWorkspaceContext } from "@/server/actions/context";
import { competitorsRepository, activityLogRepository } from "@/server/repositories";
import { generateMockCompetitors } from "@/lib/mock/ai-generators";
import { fetchChannel, searchYouTube } from "@/lib/youtube";
import type { ActionResult } from "@/types/api";
import type { CompetitorInsight } from "@/types/seo";
import { toActionError } from "@/lib/utils/errors";

export async function listCompetitors(): Promise<ActionResult<CompetitorInsight[]>> {
  try {
    const ctx = await getWorkspaceContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const result = await competitorsRepository.listByWorkspace(
      ctx.user.workspaceId,
      { limit: 20 }
    );

    const insights: CompetitorInsight[] = result.items.map((c) => ({
      id: c.id,
      channelId: c.channelId,
      channelTitle: c.channelTitle,
      thumbnailUrl: c.thumbnailUrl,
      subscriberCount: c.subscriberCount ?? 0,
      growthTrend: 5,
      uploadFrequency: "Weekly",
      momentumScore: 70,
      keywordOverlap: [],
      topicOverlap: [],
      alertEnabled: c.alertEnabled,
    }));

    if (!insights.length) {
      return { success: true, data: generateMockCompetitors(3) };
    }

    return { success: true, data: insights };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function addCompetitor(
  query: string
): Promise<ActionResult<CompetitorInsight>> {
  try {
    const ctx = await getWorkspaceContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    let channelId = query;
    let channelTitle = query;
    let thumbnailUrl: string | undefined;
    let subscriberCount = 0;

    if (process.env.YOUTUBE_API_KEY) {
      const results = await searchYouTube(query, "channel", 1);
      if (results[0]) {
        channelId = results[0].id;
        channelTitle = results[0].title;
        thumbnailUrl = results[0].thumbnailUrl;
        const ch = await fetchChannel(channelId);
        if (ch) subscriberCount = ch.subscriberCount;
      }
    } else {
      channelId = `UC_${Date.now()}`;
      channelTitle = query;
      subscriberCount = 50000 + Math.floor(Math.random() * 100000);
    }

    const id = `comp_${Date.now()}`;
    await competitorsRepository.create(id, {
      workspaceId: ctx.user.workspaceId,
      channelId,
      channelTitle,
      thumbnailUrl,
      subscriberCount,
      alertEnabled: true,
    });

    await activityLogRepository.log({
      workspaceId: ctx.user.workspaceId,
      userId: ctx.uid,
      type: "competitor_added",
      message: `Added competitor ${channelTitle}`,
    });

    return {
      success: true,
      data: {
        id,
        channelId,
        channelTitle,
        thumbnailUrl,
        subscriberCount,
        growthTrend: 8,
        uploadFrequency: "2x/week",
        momentumScore: 72,
        keywordOverlap: ["tutorial", "tips"],
        topicOverlap: [ctx.niche],
        alertEnabled: true,
      },
    };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
