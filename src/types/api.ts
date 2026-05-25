import type { DataQuality } from "@/types/entities";

export interface VyiralApiRequest<T = unknown> {
  context: VyiralApiContext;
  payload: T;
}

export interface VyiralApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  dataQuality?: DataQuality;
}

export interface VyiralApiContext {
  workspaceId: string;
  userId: string;
  channelId?: string;
  projectId?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
  total?: number;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
