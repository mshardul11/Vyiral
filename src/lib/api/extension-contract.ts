/**
 * Extension-ready API contract — browser extension can call the same routes
 * with Authorization: Bearer <session> or cookie session on vyiral.com
 */
import type { VyiralApiContext } from "@/types/firestore";

export const VYIRAL_API_ROUTES = {
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

export type VyiralApiRoute =
  (typeof VYIRAL_API_ROUTES)[keyof typeof VYIRAL_API_ROUTES];

/** Shared request envelope for extension + web */
export interface VyiralApiRequest<T = unknown> {
  context: VyiralApiContext;
  payload: T;
}

export interface VyiralApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  /** When metrics are modeled, not from YouTube official APIs */
  dataQuality?: "official" | "estimated" | "unavailable";
}

/** UI state slice extension overlays can mirror */
export interface ExtensionUiState {
  activeVideoId?: string;
  activeChannelId?: string;
  suggestedKeywords: string[];
  quickActions: Array<{ id: string; label: string; route: VyiralApiRoute }>;
}
