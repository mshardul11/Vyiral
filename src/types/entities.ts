import type { Timestamp } from "firebase/firestore";

export type UserRole = "owner" | "admin" | "editor" | "viewer";
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
export type SubscriptionPlan = "free" | "pro" | "business" | "agency";
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "canceled"
  | "past_due";
export type DataQuality = "official" | "estimated" | "unavailable";
export type NotificationType =
  | "audit_completed"
  | "ai_generation_completed"
  | "competitor_uploaded"
  | "trending_keyword"
  | "milestone_reached"
  | "performance_drop"
  | "upload_reminder"
  | "system";
export type CalendarItemType = "video" | "short" | "live" | "idea" | "series";
export type CalendarItemStatus = "idea" | "draft" | "scheduled" | "published";
export type AutomationTrigger =
  | "keyword_scan"
  | "competitor_monitor"
  | "trending_detection"
  | "weekly_audit"
  | "performance_alert";
export type TrendCategory =
  | "general"
  | "shorts"
  | "gaming"
  | "tech"
  | "lifestyle"
  | "finance"
  | "education"
  | "entertainment";

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
  trendDirection?: "up" | "down" | "stable";
  contentIntent?: string;
  contentFormatRecommendation?: string;
  cluster?: string;
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
  subScores?: Record<string, number>;
  issues?: Array<{
    category: string;
    severity: "low" | "medium" | "high";
    title: string;
    description: string;
    fix: string;
  }>;
  opportunities?: string[];
  nextSteps?: string[];
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
  trialEnd?: FirestoreTimestamp;
  aiUsageCount?: number;
  exportCount?: number;
  competitorTrackingCount?: number;
}

export interface WorkspaceMemberDoc {
  id: string;
  workspaceId: string;
  userId: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  invitedBy: string;
  joinedAt: FirestoreTimestamp;
  createdAt: FirestoreTimestamp;
}

export interface WorkspaceInviteDoc {
  id: string;
  workspaceId: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  token: string;
  expiresAt: FirestoreTimestamp;
  acceptedAt?: FirestoreTimestamp;
  createdAt: FirestoreTimestamp;
}

export interface NotificationDoc {
  id: string;
  workspaceId: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: FirestoreTimestamp;
}

export interface CalendarItemDoc extends BaseEntity {
  title: string;
  description?: string;
  type: CalendarItemType;
  status: CalendarItemStatus;
  scheduledFor?: FirestoreTimestamp;
  publishedAt?: FirestoreTimestamp;
  linkedIdeaId?: string;
  linkedKeywords?: string[];
  thumbnailUrl?: string;
  notes?: string;
  seriesName?: string;
  assignedTo?: string;
  color?: string;
}

export interface AutomationDoc extends BaseEntity {
  name: string;
  trigger: AutomationTrigger;
  enabled: boolean;
  lastRunAt?: FirestoreTimestamp;
  nextRunAt?: FirestoreTimestamp;
  config: Record<string, unknown>;
  runCount: number;
}

export interface TrendDoc {
  id: string;
  keyword: string;
  category: TrendCategory;
  region: string;
  momentum: number;
  weeklyGrowth: number;
  searchVolume: number;
  opportunityScore: number;
  relatedKeywords: string[];
  contentGap: boolean;
  format: "long_form" | "short" | "live" | "any";
  detectedAt: FirestoreTimestamp;
}

export interface VideoAnalyticsDoc extends BaseEntity {
  videoId: string;
  videoTitle: string;
  thumbnailUrl?: string;
  publishedAt: FirestoreTimestamp;
  views: number;
  watchTimeMinutes: number;
  averageViewDurationSec: number;
  averageViewPercentage: number;
  likes: number;
  comments: number;
  shares: number;
  ctr: number;
  impressions: number;
  subscribersGained: number;
  retentionData: Array<{ second: number; retention: number }>;
  trafficSources: Array<{ source: string; percentage: number }>;
  performanceScore: number;
  dataQuality: DataQuality;
}

export interface AiChatMessageDoc {
  id: string;
  workspaceId: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: FirestoreTimestamp;
}

export interface AdminUserView {
  uid: string;
  email: string;
  displayName: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  workspaceId: string;
  createdAt: FirestoreTimestamp;
  onboardingCompleted: boolean;
  aiUsageCount: number;
}
