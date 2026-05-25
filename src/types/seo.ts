/** Creator SEO & intelligence types */

export type ContentIntent =
  | "educational"
  | "entertainment"
  | "transactional"
  | "comparison"
  | "tutorial"
  | "trending";

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

export type NicheCategory =
  | "gaming"
  | "education"
  | "finance"
  | "tech"
  | "vlog"
  | "shorts"
  | "podcast"
  | "general";

export type DescriptionLength = "short" | "medium" | "long";

export type IdeaViewMode = "grid" | "kanban" | "calendar";

export interface KeywordResearchResult {
  id: string;
  keyword: string;
  topic: string;
  searchVolumeEstimate: number;
  competitionScore: number;
  opportunityScore: number;
  seoDifficulty: number;
  trendScore: number;
  trendDirection: TrendDirection;
  searchIntent: ContentIntent;
  contentFormatRecommendation: string;
  relatedKeywords: string[];
  questionKeywords: string[];
  cluster?: string;
  saved?: boolean;
}

export interface ScoredTitle {
  title: string;
  style: TitleStyle;
  ctrScore: number;
  emotionalTriggers: string[];
  keywordDensity: number;
  lengthScore: number;
  overallScore: number;
  reasoning: string;
}

export interface ScoredTag {
  tag: string;
  relevanceScore: number;
  trendScore: number;
  group?: string;
}

export interface GeneratedDescriptionResult {
  description: string;
  hooks: string[];
  chapters: Array<{ label: string; time: string }>;
  ctas: string[];
  hashtags: string[];
  seoScore: number;
  readabilityScore: number;
  format: DescriptionLength;
}

export interface ContentIdeaResult {
  id: string;
  title: string;
  hook: string;
  thumbnailConcept: string;
  audienceType: string;
  viralProbability: number;
  contentAngle: string;
  estimatedCompetition: "low" | "medium" | "high";
  recommendedPublishTime: string;
  format: string;
  series?: string;
  favorite?: boolean;
}

export interface AuditIssue {
  id: string;
  category: string;
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  fix: string;
}

export interface ChannelAuditResult {
  id: string;
  channelId: string;
  channelTitle: string;
  overallScore: number;
  subScores: Record<string, number>;
  categories: Array<{ name: string; score: number; summary: string }>;
  issues: AuditIssue[];
  opportunities: string[];
  nextSteps: string[];
  recommendedUploads: string[];
  weakPatterns: string[];
  strongThemes: string[];
  dataQuality: "official" | "estimated" | "unavailable";
}

export interface CompetitorInsight {
  id: string;
  channelId: string;
  channelTitle: string;
  thumbnailUrl?: string;
  subscriberCount: number;
  growthTrend: number;
  uploadFrequency: string;
  momentumScore: number;
  keywordOverlap: string[];
  topicOverlap: string[];
  alertEnabled: boolean;
}

export interface AiRecommendation {
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
  priority: "low" | "medium" | "high";
  score: number;
}
