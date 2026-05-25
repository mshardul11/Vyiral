"use server";

import { getWorkspaceContext } from "@/server/actions/context";
import { auditsRepository, activityLogRepository } from "@/server/repositories";
import { generateMockAudit } from "@/lib/mock/ai-generators";
import { createJsonCompletion } from "@/lib/openai/client";
import { SYSTEM_VYIRAL_SEO, auditPrompt } from "@/lib/openai/prompts/builders";
import { auditResponseSchema } from "@/lib/openai/schemas";
import { fetchChannel } from "@/lib/youtube";
import type { ActionResult } from "@/types/api";
import type { ChannelAuditResult } from "@/types/seo";
import { toActionError } from "@/lib/utils/errors";

export async function runChannelAudit(params: {
  channelId?: string;
  channelTitle?: string;
}): Promise<ActionResult<ChannelAuditResult>> {
  try {
    const ctx = await getWorkspaceContext();
    if (!ctx) return { success: false, error: "Unauthorized" };

    const channelId =
      params.channelId ?? ctx.profile?.youtubeChannelId ?? "public";
    const channelTitle =
      params.channelTitle ??
      ctx.profile?.youtubeChannelTitle ??
      "Your Channel";

    let channelSummary = `Channel: ${channelTitle}. Niche: ${ctx.niche}.`;
    if (params.channelId && process.env.YOUTUBE_API_KEY) {
      const ch = await fetchChannel(params.channelId);
      if (ch) {
        channelSummary = `${ch.title}: ${ch.subscriberCount} subs, ${ch.videoCount} videos, ${ch.viewCount} views. ${ch.description.slice(0, 200)}`;
      }
    }

    let audit: ChannelAuditResult;
    if (process.env.OPENAI_API_KEY) {
      try {
        const { data } = await createJsonCompletion({
          schemaName: "audit",
          system: SYSTEM_VYIRAL_SEO,
          user: auditPrompt(channelSummary, ctx.niche),
          parse: (raw) => auditResponseSchema.parse(raw),
        });
        audit = {
          id: `audit_${Date.now()}`,
          channelId,
          channelTitle,
          overallScore: data.overallScore,
          subScores: data.subScores ?? {},
          categories: data.categories,
          issues: (data.issues ?? []).map((issue, i) => ({
            id: String(i),
            ...issue,
          })),
          opportunities: data.opportunities ?? data.recommendations ?? [],
          nextSteps: data.nextSteps ?? [],
          recommendedUploads: data.recommendedUploads ?? [],
          weakPatterns: data.weakPatterns ?? [],
          strongThemes: data.strongThemes ?? [],
          dataQuality: "estimated",
        };
      } catch {
        audit = generateMockAudit(channelTitle);
      }
    } else {
      audit = generateMockAudit(channelTitle);
    }

    await auditsRepository.create(audit.id, {
      workspaceId: ctx.user.workspaceId,
      channelId,
      overallScore: audit.overallScore,
      categories: audit.categories,
      recommendations: audit.nextSteps,
      dataQuality: audit.dataQuality,
      subScores: audit.subScores,
      issues: audit.issues,
      opportunities: audit.opportunities,
    } as Parameters<typeof auditsRepository.create>[1]);

    await activityLogRepository.log({
      workspaceId: ctx.user.workspaceId,
      userId: ctx.uid,
      type: "channel_audit",
      message: `Audit completed — score ${audit.overallScore}`,
    });

    return { success: true, data: audit };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function getLatestAudit(): Promise<ActionResult<ChannelAuditResult | null>> {
  try {
    const ctx = await getWorkspaceContext();
    if (!ctx) return { success: false, error: "Unauthorized" };
    const doc = await auditsRepository.getLatest(ctx.user.workspaceId);
    if (!doc) return { success: true, data: null };
    const extended = doc as typeof doc & {
      subScores?: Record<string, number>;
      issues?: ChannelAuditResult["issues"];
      opportunities?: string[];
    };
    return {
      success: true,
      data: {
        id: doc.id,
        channelId: doc.channelId,
        channelTitle: ctx.profile?.youtubeChannelTitle ?? "Channel",
        overallScore: doc.overallScore,
        subScores: extended.subScores ?? {},
        categories: doc.categories,
        issues: extended.issues ?? [],
        opportunities: extended.opportunities ?? doc.recommendations,
        nextSteps: doc.recommendations,
        recommendedUploads: [],
        weakPatterns: [],
        strongThemes: [],
        dataQuality: doc.dataQuality,
      },
    };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
