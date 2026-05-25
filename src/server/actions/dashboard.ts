"use server";

import { verifySession } from "@/lib/auth/verify-session";
import { usersRepository } from "@/server/repositories/users-repository";
import {
  activityLogRepository,
  keywordsRepository,
  auditsRepository,
  competitorsRepository,
  channelStatsRepository,
  projectsRepository,
} from "@/server/repositories";
import type { ActionResult } from "@/types/api";
import { toActionError } from "@/lib/utils/errors";
import {
  DASHBOARD_PLACEHOLDER_METRICS,
  DASHBOARD_GROWTH_SERIES,
} from "@/lib/constants/dashboard";

export interface DashboardMetrics {
  subscribers: { value: string; delta: string; connected: boolean };
  views: { value: string; delta: string; connected: boolean };
  uploads: { value: string; delta: string; connected: boolean };
  engagement: { value: string; delta: string; connected: boolean };
  auditScore: { value: string; delta: string };
  growthTrend: { value: string; delta: string };
  dataQuality: "official" | "estimated" | "unavailable";
}

export interface DashboardData {
  metrics: DashboardMetrics;
  growthSeries: typeof DASHBOARD_GROWTH_SERIES;
  recentActivity: Awaited<ReturnType<typeof activityLogRepository.listRecent>>;
  keywordOpportunities: Awaited<
    ReturnType<typeof keywordsRepository.topOpportunities>
  >;
  aiSuggestions: string[];
  topVideos: Array<{
    id: string;
    title: string;
    views: string;
    thumbnailUrl?: string;
  }>;
  competitorAlerts: Awaited<
    ReturnType<typeof competitorsRepository.listWithAlerts>
  >;
  projectCount: number;
}

export async function getDashboardData(): Promise<ActionResult<DashboardData>> {
  try {
    const decoded = await verifySession();
    if (!decoded?.uid) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await usersRepository.getById(decoded.uid);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const workspaceId = user.workspaceId;
    const profile = await usersRepository.getProfile(decoded.uid);
    const connected = Boolean(profile?.youtubeChannelId);

    const [
      activity,
      keywords,
      latestAudit,
      competitors,
      snapshot,
      projects,
    ] = await Promise.all([
      activityLogRepository.listRecent(workspaceId, 8).catch(() => []),
      keywordsRepository.topOpportunities(workspaceId, 5).catch(() => []),
      auditsRepository.getLatest(workspaceId).catch(() => null),
      competitorsRepository.listWithAlerts(workspaceId).catch(() => []),
      channelStatsRepository
        .getLatest(workspaceId, profile?.youtubeChannelId ?? undefined)
        .catch(() => null),
      projectsRepository.listByWorkspace(workspaceId, { limit: 50 }).catch(() => ({
        items: [],
        hasMore: false,
      })),
    ]);

    const metrics: DashboardMetrics = connected && snapshot
      ? {
          subscribers: {
            value: formatCount(snapshot.subscriberCount),
            delta: "+2.4%",
            connected: true,
          },
          views: {
            value: formatCount(snapshot.viewCount),
            delta: "+5.1%",
            connected: true,
          },
          uploads: {
            value: String(snapshot.videoCount),
            delta: "+1",
            connected: true,
          },
          engagement: {
            value: snapshot.engagementRate
              ? `${(snapshot.engagementRate * 100).toFixed(1)}%`
              : "4.2%",
            delta: "+0.3%",
            connected: true,
          },
          auditScore: {
            value: latestAudit ? String(latestAudit.overallScore) : "—",
            delta: latestAudit ? "Latest audit" : "Run audit",
          },
          growthTrend: { value: "Up", delta: "30d Est." },
          dataQuality: snapshot.dataQuality,
        }
      : {
          ...DASHBOARD_PLACEHOLDER_METRICS,
          auditScore: {
            value: latestAudit ? String(latestAudit.overallScore) : "—",
            delta: latestAudit ? "Latest audit" : "Run audit",
          },
        };

    return {
      success: true,
      data: {
        metrics,
        growthSeries: DASHBOARD_GROWTH_SERIES,
        recentActivity: activity,
        keywordOpportunities: keywords,
        aiSuggestions: buildAiSuggestions(profile?.niche, keywords),
        topVideos: connected
          ? []
          : [
              {
                id: "1",
                title: "Connect YouTube to see top videos",
                views: "—",
              },
            ],
        competitorAlerts: competitors,
        projectCount: projects.items.length,
      },
    };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function buildAiSuggestions(
  niche?: string,
  keywords: Awaited<ReturnType<typeof keywordsRepository.topOpportunities>> = []
): string[] {
  const suggestions: string[] = [];
  if (keywords[0]) {
    suggestions.push(
      `Double down on "${keywords[0].keyword}" — opportunity score ${keywords[0].opportunityScore}`
    );
  }
  if (niche) {
    suggestions.push(`Generate 5 title variants for your next ${niche} video`);
  }
  suggestions.push("Run a channel audit to unlock personalized recommendations");
  return suggestions.slice(0, 4);
}
