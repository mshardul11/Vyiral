/**
 * Extension-ready API contract — browser extension can call the same routes
 * with Authorization: Bearer <session> or cookie session on vyiral.com
 */
import type { VyiralApiContext } from "@/types/api";
import { API_ROUTES } from "@/lib/constants/routes";

export const VYIRAL_API_ROUTES = API_ROUTES;

export type VyiralApiRoute =
  (typeof VYIRAL_API_ROUTES)[keyof typeof VYIRAL_API_ROUTES];

export type { VyiralApiRequest, VyiralApiResponse } from "@/types/api";

export interface ExtensionUiState {
  activeVideoId?: string;
  activeChannelId?: string;
  suggestedKeywords: string[];
  quickActions: Array<{ id: string; label: string; route: VyiralApiRoute }>;
}

export type { VyiralApiContext };
