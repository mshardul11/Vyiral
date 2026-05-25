import { z } from "zod";

export const titlesResponseSchema = z.object({
  titles: z.array(z.string()).min(1),
  hooks: z.array(z.string()).optional(),
  ctrTips: z.array(z.string()).optional(),
});

export const keywordItemSchema = z.object({
  keyword: z.string(),
  searchIntent: z.enum([
    "informational",
    "navigational",
    "commercial",
    "transactional",
  ]),
  searchVolumeEstimate: z.number(),
  competitionScore: z.number().min(0).max(100),
  opportunityScore: z.number().min(0).max(100),
  trendScore: z.number().min(0).max(100),
  relatedKeywords: z.array(z.string()),
  questionKeywords: z.array(z.string()),
});

export const keywordsResponseSchema = z.object({
  keywords: z.array(keywordItemSchema),
  summary: z.string().optional(),
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
});

export const contentIdeasResponseSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      angle: z.string(),
      hook: z.string(),
      format: z.string(),
      estimatedDifficulty: z.enum(["low", "medium", "high"]),
    })
  ),
});

export const auditResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  categories: z.array(
    z.object({
      name: z.string(),
      score: z.number().min(0).max(100),
      summary: z.string(),
    })
  ),
  recommendations: z.array(z.string()),
});
