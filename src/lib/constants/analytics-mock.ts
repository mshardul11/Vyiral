/** Realistic mock analytics data for demo mode (no real credentials required) */ // pragma: allowlist secret

export function generateTimeSeries(
  days: number,
  base: number,
  variance: number,
  trend: number = 0
) {
  const data = [];
  let value = base;
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    value = Math.max(0, value + trend + (Math.random() - 0.45) * variance);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.round(value),
    });
  }
  return data;
}

export function getAnalyticsSeries(days: number) {
  return {
    subscribers: generateTimeSeries(days, 1200, 80, 2.5),
    views: generateTimeSeries(days, 18000, 4000, 150),
    watchTime: generateTimeSeries(days, 1400, 300, 10),
    ctr: generateTimeSeries(days, 4.8, 1.2, 0.02).map((d) => ({
      ...d,
      value: parseFloat(d.value.toFixed(2)),
    })),
    engagement: generateTimeSeries(days, 6.2, 1.8, 0.05).map((d) => ({
      ...d,
      value: parseFloat(d.value.toFixed(2)),
    })),
  };
}

export const TRAFFIC_SOURCES = [
  { source: "YouTube Search", percentage: 34, color: "#8b5cf6" },
  { source: "Suggested Videos", percentage: 28, color: "#06b6d4" },
  { source: "Browse Features", percentage: 18, color: "#10b981" },
  { source: "External", percentage: 12, color: "#f59e0b" },
  { source: "Direct / Unknown", percentage: 8, color: "#6b7280" },
];

export const TOP_VIDEOS = [
  {
    id: "v1",
    title: "How I Grew My Channel to 10K Subs in 90 Days",
    views: 142300,
    watchTime: 8420,
    ctr: 7.2,
    likes: 3840,
    comments: 412,
    publishedAt: "2024-11-14",
    thumbnailUrl: null,
    performanceScore: 92,
    trend: "up" as const,
  },
  {
    id: "v2",
    title: "YouTube SEO 2024: The Complete Guide",
    views: 98700,
    watchTime: 6200,
    ctr: 6.8,
    likes: 2910,
    comments: 287,
    publishedAt: "2024-10-28",
    thumbnailUrl: null,
    performanceScore: 86,
    trend: "up" as const,
  },
  {
    id: "v3",
    title: "5 Thumbnail Mistakes Killing Your CTR",
    views: 73400,
    watchTime: 4100,
    ctr: 8.4,
    likes: 2140,
    comments: 198,
    publishedAt: "2024-12-02",
    thumbnailUrl: null,
    performanceScore: 81,
    trend: "stable" as const,
  },
  {
    id: "v4",
    title: "The Algorithm WANTS You to Do This",
    views: 61200,
    watchTime: 3890,
    ctr: 5.9,
    likes: 1870,
    comments: 156,
    publishedAt: "2024-12-10",
    thumbnailUrl: null,
    performanceScore: 75,
    trend: "up" as const,
  },
  {
    id: "v5",
    title: "My Honest Review: Vidly vs TubeBuddy",
    views: 44800,
    watchTime: 3100,
    ctr: 5.1,
    likes: 1230,
    comments: 241,
    publishedAt: "2024-09-19",
    thumbnailUrl: null,
    performanceScore: 68,
    trend: "down" as const,
  },
];

export const WORST_VIDEOS = [
  {
    id: "w1",
    title: "Testing a New Format (Day in My Life)",
    views: 3200,
    watchTime: 820,
    ctr: 1.9,
    publishedAt: "2024-08-30",
    performanceScore: 24,
    trend: "down" as const,
    issue: "Low CTR — thumbnail needs rework",
  },
  {
    id: "w2",
    title: "Q&A with My Subscribers",
    views: 5100,
    watchTime: 2100,
    ctr: 2.4,
    publishedAt: "2024-09-05",
    performanceScore: 31,
    trend: "down" as const,
    issue: "Poor hook — 60% drop in first 30s",
  },
  {
    id: "w3",
    title: "I Tried the Viral Thumbnail Hack",
    views: 7400,
    watchTime: 1900,
    ctr: 3.1,
    publishedAt: "2024-10-12",
    performanceScore: 38,
    trend: "stable" as const,
    issue: "Watch time below channel average",
  },
];

export const AUDIENCE_DEMOGRAPHICS = {
  ageGroups: [
    { group: "18-24", percentage: 32 },
    { group: "25-34", percentage: 41 },
    { group: "35-44", percentage: 18 },
    { group: "45-54", percentage: 7 },
    { group: "55+", percentage: 2 },
  ],
  topCountries: [
    { country: "United States", percentage: 44, flag: "🇺🇸" },
    { country: "United Kingdom", percentage: 12, flag: "🇬🇧" },
    { country: "Canada", percentage: 9, flag: "🇨🇦" },
    { country: "Australia", percentage: 7, flag: "🇦🇺" },
    { country: "India", percentage: 6, flag: "🇮🇳" },
    { country: "Germany", percentage: 4, flag: "🇩🇪" },
  ],
  genderSplit: { male: 62, female: 35, other: 3 },
  watchTime: { mobile: 58, desktop: 32, tv: 10 },
};

export const ENGAGEMENT_HEATMAP = Array.from({ length: 7 }, (_, dayIdx) =>
  Array.from({ length: 24 }, (_, hour) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIdx],
    hour,
    value: Math.round(
      Math.random() * 100 * (hour >= 8 && hour <= 22 ? 1.5 : 0.4)
    ),
  }))
).flat();

export const OVERVIEW_METRICS = {
  subscribers: { value: 12840, delta: 342, deltaPercent: 2.7, trend: "up" as const },
  views: { value: 487200, delta: 24100, deltaPercent: 5.2, trend: "up" as const },
  watchTime: { value: 38400, delta: 1820, deltaPercent: 4.9, trend: "up" as const },
  ctr: { value: 5.8, delta: 0.4, deltaPercent: 7.4, trend: "up" as const },
  avgViewDuration: { value: "4:42", delta: "+0:18", deltaPercent: 6.8, trend: "up" as const },
  engagement: { value: 6.4, delta: 0.3, deltaPercent: 4.9, trend: "up" as const },
};
