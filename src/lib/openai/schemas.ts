import { z } from "zod";

export const contentIntentSchema = z.enum([
  "educational",
  "entertainment",
  "transactional",
  "comparison",
  "tutorial",
  "trending",
]);

export const keywordItemSchema = z.object({
  keyword: z.string(),
  searchIntent: contentIntentSchema,
  searchVolumeEstimate: z.number(),
  competitionScore: z.number().min(0).max(100),
  opportunityScore: z.number().min(0).max(100),
  seoDifficulty: z.number().min(0).max(100).optional(),
  trendScore: z.number().min(0).max(100),
  trendDirection: z.enum(["up", "down", "stable"]).optional(),
  contentFormatRecommendation: z.string().optional(),
  relatedKeywords: z.array(z.string()),
  questionKeywords: z.array(z.string()),
  cluster: z.string().optional(),
});

export const keywordsResponseSchema = z.object({
  keywords: z.array(keywordItemSchema),
  summary: z.string().optional(),
});

export const titlesResponseSchema = z.object({
  titles: z.array(z.string()).min(1),
  hooks: z.array(z.string()).optional(),
  ctrTips: z.array(z.string()).optional(),
});

export const tagsResponseSchema = z.object({
  tags: z.array(z.string()).min(1),
  categories: z.array(z.string()).optional(),
});

export const descriptionResponseSchema = z.object({
  description: z.string(),
  hooks: z.array(z.string()),
  timestamps: z
    .array(z.object({ label: z.string(), time: z.string() }))
    .optional(),
  ctas: z.array(z.string()).optional(),
  hashtags: z.array(z.string()).optional(),
});

export const contentIdeasResponseSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      hook: z.string(),
      thumbnailConcept: z.string().optional(),
      audienceType: z.string().optional(),
      viralProbability: z.number().optional(),
      contentAngle: z.string().optional(),
      estimatedCompetition: z.enum(["low", "medium", "high"]).optional(),
      recommendedPublishTime: z.string().optional(),
      format: z.string(),
      series: z.string().nullable().optional(),
    })
  ),
});

export const auditResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  subScores: z.record(z.number()).optional(),
  categories: z.array(
    z.object({
      name: z.string(),
      score: z.number().min(0).max(100),
      summary: z.string(),
    })
  ),
  issues: z
    .array(
      z.object({
        category: z.string(),
        severity: z.enum(["low", "medium", "high"]),
        title: z.string(),
        description: z.string(),
        fix: z.string(),
      })
    )
    .optional(),
  opportunities: z.array(z.string()).optional(),
  nextSteps: z.array(z.string()).optional(),
  recommendedUploads: z.array(z.string()).optional(),
  weakPatterns: z.array(z.string()).optional(),
  strongThemes: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
});
