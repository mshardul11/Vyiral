export const PUBLIC_ROUTES = ["/", "/login"] as const;

export const APP_ROUTES = {
  dashboard: "/dashboard",
  keywords: "/keywords",
  titles: "/titles",
  tags: "/tags",
  descriptions: "/descriptions",
  ideas: "/ideas",
  audit: "/audit",
  competitors: "/competitors",
  stats: "/stats",
  projects: "/projects",
  settings: "/settings",
  onboarding: "/onboarding",
} as const;

export const API_ROUTES = {
  keywordResearch: "/api/ai/keyword-research",
  titleGenerator: "/api/ai/title-generator",
  tagGenerator: "/api/ai/tag-generator",
  descriptionGenerator: "/api/ai/description-generator",
  contentIdeas: "/api/ai/content-ideas",
  channelAudit: "/api/ai/channel-audit",
  channelStats: "/api/youtube/channel-stats",
  competitors: "/api/youtube/competitors",
  channelConnect: "/api/youtube/channel-connect",
  syncScheduler: "/api/sync/scheduler",
} as const;
