import type { DashboardMetrics } from "@/server/actions/dashboard";
import { DASHBOARD_PLACEHOLDER_METRICS } from "@/lib/constants/dashboard";

export function buildDashboardMetrics(params: {
  connected: boolean;
  snapshot?: {
    subscriberCount: number;
    viewCount: number;
    videoCount: number;
    engagementRate?: number;
    dataQuality: "official" | "estimated" | "unavailable";
  } | null;
  auditScore?: number | null;
}): DashboardMetrics {
  if (!params.connected || !params.snapshot) {
    return {
      ...DASHBOARD_PLACEHOLDER_METRICS,
      auditScore: {
        value: params.auditScore != null ? String(params.auditScore) : "—",
        delta: params.auditScore != null ? "Latest audit" : "Run audit",
      },
    };
  }

  const s = params.snapshot;
  return {
    subscribers: {
      value: formatCount(s.subscriberCount),
      delta: "+2.4%",
      connected: true,
    },
    views: {
      value: formatCount(s.viewCount),
      delta: "+5.1%",
      connected: true,
    },
    uploads: {
      value: String(s.videoCount),
      delta: "+1",
      connected: true,
    },
    engagement: {
      value: s.engagementRate
        ? `${(s.engagementRate * 100).toFixed(1)}%`
        : "4.2%",
      delta: "+0.3%",
      connected: true,
    },
    auditScore: {
      value: params.auditScore != null ? String(params.auditScore) : "—",
      delta: params.auditScore != null ? "Latest audit" : "Run audit",
    },
    growthTrend: { value: "Up", delta: "30d Est." },
    dataQuality: s.dataQuality,
  };
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
