import type { Timestamp } from "firebase/firestore";

export type UserRole = "owner" | "admin" | "member" | "viewer";
export type SearchIntent =
  | "informational"
  | "navigational"
  | "commercial"
  | "transactional";

export type KeywordIntentType =
  | "educational"
  | "entertainment"
  | "transactional"
  | "comparison"
  | "tutorial"
  | "trending";

export type TrendDirection = "up" | "down" | "stable";
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
  seoDifficulty?: number;
  trendDirection?: TrendDirection;
  intentType?: KeywordIntentType;
  contentFormat?: string;
  cluster?: string;
  relatedKeywords: string[];
  questionKeywords: string[];
  saved: boolean;
  favorite?: boolean;
}

export interface TitleVariantMeta {
  text: string;
  style: string;
  ctrScore: number;
  lengthScore: number;
  keywordDensity: number;
  emotionalTriggers: string[];
  overallScore: number;
  favorite?: boolean;
}

export interface GeneratedTitleDoc extends BaseEntity {
  projectId?: string;
  topic: string;
  titles: string[];
  variants?: TitleVariantMeta[];
  selectedIndex?: number;
}

export interface TagItemMeta {
  tag: string;
  relevanceScore: number;
  trendScore: number;
  group: string;
}

export interface GeneratedTagDoc extends BaseEntity {
  projectId?: string;
  videoTopic: string;
  tags: string[];
  tagItems?: TagItemMeta[];
  sourceType?: string;
}

export interface DescriptionVariantMeta {
  length: "short" | "medium" | "long";
  text: string;
  readabilityScore: number;
  seoScore: number;
  hashtags: string[];
  chapters: Array<{ label: string; time: string }>;
  cta: string;
}

export interface GeneratedDescriptionDoc extends BaseEntity {
  projectId?: string;
  topic: string;
  description: string;
  hooks: string[];
  variants?: DescriptionVariantMeta[];
}

export interface ContentIdeaDoc extends BaseEntity {
  projectId?: string;
  title: string;
  angle: string;
  hook: string;
  format: string;
  estimatedDifficulty: "low" | "medium" | "high";
  ideaType?: "video" | "series" | "shorts" | "community" | "livestream";
  thumbnailConcept?: string;
  audienceType?: string;
  viralProbability?: number;
  estimatedCompetition?: number;
  recommendedPublishTime?: string;
  status?: "backlog" | "planned" | "filming" | "published";
  favorite?: boolean;
}

export interface AuditIssueMeta {
  id: string;
  title: string;
  severity: "low" | "medium" | "high";
  category: string;
  description: string;
  fix: string;
}

export interface AuditDoc extends BaseEntity {
  projectId?: string;
  channelId: string;
  channelTitle?: string;
  overallScore: number;
  categories: AuditCategoryScore[];
  recommendations: string[];
  issues?: AuditIssueMeta[];
  opportunities?: string[];
  nextSteps?: string[];
  recommendedUploads?: string[];
  weakPatterns?: string[];
  strongThemes?: string[];
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
  uploadFrequency?: string;
  momentumScore?: number;
  keywordOverlap?: number;
  topicOverlap?: number;
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
