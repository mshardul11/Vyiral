import type { KeywordIntentType } from "@/types/entities";

export type TrendDirection = "up" | "down" | "stable";
export type TitleStyle =
  | "high_ctr"
  | "educational"
  | "curiosity_gap"
  | "storytelling"
  | "authority"
  | "listicle"
  | "controversial"
  | "viral_challenge"
  | "minimalist";

export type DescriptionLength = "short" | "medium" | "long";
export type IdeaBoardStatus = "backlog" | "planned" | "filming" | "published";
export type ContentIdeaType =
  | "video"
  | "series"
  | "shorts"
  | "community"
  | "livestream";

export interface KeywordResult {
  id: string;
  keyword: string;
  topic: string;
  searchVolumeEstimate: number;
  competitionScore: number;
  opportunityScore: number;
  seoDifficulty: number;
  trendScore: number;
  trendDirection: TrendDirection;
  intentType: KeywordIntentType;
  contentFormat: string;
  cluster: string;
  relatedKeywords: string[];
  questionKeywords: string[];
  saved: boolean;
  favorite: boolean;
  createdAt?: string;
}

export interface KeywordResearchResult {
  keywords: KeywordResult[];
  clusters: string[];
  summary: string;
  query: string;
}

export interface KeywordDetailInsight {
  keyword: KeywordResult;
  relatedTopics: string[];
  videoAngles: string[];
  competitorOpportunities: string[];
  hooks: string[];
  thumbnailConcepts: string[];
  aiRecommendations: string[];
  rankingDifficulty: number;
}

export interface TitleVariant {
  text: string;
  style: TitleStyle;
  ctrScore: number;
  lengthScore: number;
  keywordDensity: number;
  emotionalTriggers: string[];
  overallScore: number;
  favorite?: boolean;
}

export interface TitleGenerationResult {
  id: string;
  topic: string;
  variants: TitleVariant[];
  bestIndex: number;
  createdAt?: string;
}

export interface TagItem {
  tag: string;
  relevanceScore: number;
  trendScore: number;
  group: string;
}

export interface TagGenerationResult {
  id: string;
  source: string;
  tags: TagItem[];
  createdAt?: string;
}

export interface DescriptionVariant {
  length: DescriptionLength;
  text: string;
  readabilityScore: number;
  seoScore: number;
  hashtags: string[];
  chapters: Array<{ label: string; time: string }>;
  cta: string;
}

export interface DescriptionGenerationResult {
  id: string;
  topic: string;
  variants: DescriptionVariant[];
  createdAt?: string;
}

export interface ContentIdeaItem {
  id: string;
  type: ContentIdeaType;
  title: string;
  hook: string;
  thumbnailConcept: string;
  audienceType: string;
  viralProbability: number;
  contentAngle: string;
  estimatedCompetition: number;
  recommendedPublishTime: string;
  status: IdeaBoardStatus;
  favorite: boolean;
}

export interface ContentIdeasResult {
  ideas: ContentIdeaItem[];
  summary: string;
}

export interface AuditSubScore {
  name: string;
  score: number;
  summary: string;
  severity?: "low" | "medium" | "high";
}

export interface AuditIssue {
  id: string;
  title: string;
  severity: "low" | "medium" | "high";
  category: string;
  description: string;
  fix: string;
}

export interface ChannelAuditResult {
  id: string;
  channelId: string;
  channelTitle: string;
  overallScore: number;
  subScores: AuditSubScore[];
  issues: AuditIssue[];
  opportunities: string[];
  nextSteps: string[];
  recommendedUploads: string[];
  weakPatterns: string[];
  strongThemes: string[];
  radarData: Array<{ subject: string; score: number }>;
}

export interface CompetitorChannel {
  id: string;
  channelId: string;
  channelTitle: string;
  thumbnailUrl?: string;
  subscriberCount: number;
  uploadFrequency: string;
  momentumScore: number;
  keywordOverlap: number;
  topicOverlap: number;
  alertEnabled: boolean;
}

export interface CompetitorIntelligenceResult {
  competitors: CompetitorChannel[];
  growthComparison: Array<{ name: string; growth: number }>;
  topContent: Array<{ title: string; views: string; channel: string }>;
  opportunityGaps: string[];
  trendingTopics: string[];
}

export interface CreatorRecommendation {
  id: string;
  type:
    | "next_video"
    | "keyword"
    | "upload_timing"
    | "seo_fix"
    | "title_improvement"
    | "content_gap";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionHref?: string;
}
