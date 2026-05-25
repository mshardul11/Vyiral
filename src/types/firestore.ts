import type { Timestamp } from "firebase/firestore";

/** Workspace-ready: future team roles attach to workspaceId */
export type UserRole = "owner" | "admin" | "member" | "viewer";

export type SearchIntent = "informational" | "navigational" | "commercial" | "transactional";

export type CreatorGoal = "views" | "subs" | "ctr" | "watch_time";

export type UploadCadence = "daily" | "weekly" | "biweekly" | "monthly" | "irregular";

export interface UserDoc {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  workspaceId: string;
  role: UserRole;
  onboardingCompleted: boolean;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

export interface UserProfileDoc {
  uid: string;
  workspaceId: string;
  niche: string;
  targetAudience: string;
  goals: CreatorGoal[];
  uploadCadence: UploadCadence;
  youtubeChannelId: string | null;
  youtubeChannelTitle: string | null;
  youtubeChannelThumbnail: string | null;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

export interface ProjectDoc {
  id: string;
  workspaceId: string;
  ownerId: string;
  name: string;
  description?: string;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

export interface KeywordDoc {
  id: string;
  workspaceId: string;
  projectId?: string;
  keyword: string;
  topic: string;
  searchIntent: SearchIntent;
  /** Labeled estimates — not YouTube official metrics */
  searchVolumeEstimate: number;
  competitionScore: number;
  opportunityScore: number;
  trendScore: number;
  relatedKeywords: string[];
  questionKeywords: string[];
  saved: boolean;
  createdAt: Timestamp | string;
}

export interface SubscriptionDoc {
  workspaceId: string;
  plan: "free" | "pro" | "team";
  status: "active" | "trialing" | "canceled" | "past_due";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Timestamp | string;
}

export interface ActivityLogDoc {
  id: string;
  workspaceId: string;
  userId: string;
  type: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: Timestamp | string;
}

/** Extension-ready API contract types */
export interface VyiralApiContext {
  workspaceId: string;
  userId: string;
  channelId?: string;
}
