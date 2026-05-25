import type { DashboardMetrics } from "@/server/actions/dashboard";

export const DASHBOARD_PLACEHOLDER_METRICS: DashboardMetrics = {
  subscribers: { value: "12.4K", delta: "+2.4% Est.", connected: false },
  views: { value: "1.2M", delta: "+5.1% Est.", connected: false },
  uploads: { value: "48", delta: "+1", connected: false },
  engagement: { value: "4.2%", delta: "+0.3% Est.", connected: false },
  auditScore: { value: "—", delta: "Run audit" },
  growthTrend: { value: "Up", delta: "30d Est." },
  dataQuality: "estimated",
};

export const DASHBOARD_GROWTH_SERIES = [
  { date: "Mon", subscribers: 11800, views: 98000 },
  { date: "Tue", subscribers: 11950, views: 102000 },
  { date: "Wed", subscribers: 12020, views: 105500 },
  { date: "Thu", subscribers: 12100, views: 108200 },
  { date: "Fri", subscribers: 12200, views: 112000 },
  { date: "Sat", subscribers: 12300, views: 118500 },
  { date: "Sun", subscribers: 12400, views: 121000 },
] as const;
