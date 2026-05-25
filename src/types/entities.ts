import type { Timestamp } from "firebase/firestore";

export type UserRole = "owner" | "admin" | "member" | "viewer";
export type SearchIntent =
  | "informational"
  | "navigational"
  | "commercial"
  | "transactional";
export type CreatorGoal = "views" | "subs" | "ctr" | "watch_time";
export type UploadCadence =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "irregular";
export type SubscriptionPlan = "free" | "pro" | "team";
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "canceled"
  | "past_due";
export type DataQuality = "official" | "estimated" | "unavailable";

export type FirestoreTimestamp = Timestamp | string | Date;

export interface BaseEntity {
  id: string;
  workspaceId: string;
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

export interface UserDoc {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  workspaceId: string;
  role: UserRole;
  onboardingCompleted: boolean;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
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
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export interface ProjectDoc extends BaseEntity {
  ownerId: string;
  name: string;
  description?: string;
  color?: string;
  isDefault?: boolean;
}

export interface KeywordDoc extends BaseEntity {
  projectId?: string;
  keyword: string;
  topic: string;
  searchIntent: SearchIntent;
  searchVolumeEstimate: number;
  competitionScore: number;
  opportunityScore: number;
  trendScore: number;
  relatedKeywords: string[];
  questionKeywords: string[];
  saved: boolean;
}

export interface GeneratedTitleDoc extends BaseEntity {
  projectId?: string;
  topic: string;
  titles: string[];
  selectedIndex?: number;
}

export interface GeneratedTagDoc extends BaseEntity {
  projectId?: string;
  videoTopic: string;
  tags: string[];
}

export interface GeneratedDescriptionDoc extends BaseEntity {
  projectId?: string;
  topic: string;
  description: string;
  hooks: string[];
}

export interface ContentIdeaDoc extends BaseEntity {
  projectId?: string;
  title: string;
  angle: string;
  hook: string;
  format: string;
  estimatedDifficulty: "low" | "medium" | "high";
}

export interface AuditDoc extends BaseEntity {
  projectId?: string;
  channelId: string;
  overallScore: number;
  categories: AuditCategoryScore[];
  recommendations: string[];
  dataQuality: DataQuality;
}

export interface AuditCategoryScore {
  name: string;
  score: number;
  summary: string;
}

export interface CompetitorDoc extends BaseEntity {
  channelId: string;
  channelTitle: string;
  thumbnailUrl?: string;
  subscriberCount?: number;
  notes?: string;
  alertEnabled: boolean;
}

export interface ChannelStatsSnapshotDoc extends BaseEntity {
  channelId: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  engagementRate?: number;
  snapshotAt: FirestoreTimestamp;
  dataQuality: DataQuality;
}

export interface SavedItemDoc extends BaseEntity {
  userId: string;
  resourceType:
    | "keyword"
    | "title"
    | "tag"
    | "description"
    | "idea"
    | "audit";
  resourceId: string;
  label: string;
}

export interface ActivityLogDoc {
  id: string;
  workspaceId: string;
  userId: string;
  type: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: FirestoreTimestamp;
}

export interface SubscriptionDoc {
  workspaceId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: FirestoreTimestamp;
}
