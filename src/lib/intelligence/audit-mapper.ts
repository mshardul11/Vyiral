import type { z } from "zod";
import type { auditResponseSchema } from "@/lib/openai/schemas";
import type { AuditIssue, ChannelAuditResult } from "@/types/intelligence";
import type { AuditDoc } from "@/types/entities";

type AuditResponse = z.infer<typeof auditResponseSchema>;

function normalizeIssues(
  raw: AuditResponse["issues"],
  categories: AuditResponse["categories"],
  fallbackFix: string
): AuditIssue[] {
  const fromModel = (raw ?? []).map((issue, i) => ({
    id: issue.id ?? String(i + 1),
    title: issue.title,
    severity: issue.severity,
    category: issue.category,
    description: issue.description,
    fix: issue.fix,
  }));

  if (fromModel.length > 0) return fromModel;

  return categories
    .filter((c) => c.score < 70)
    .map((c, i) => ({
      id: `derived-${i + 1}`,
      title: `Improve ${c.name}`,
      severity: c.score < 55 ? ("high" as const) : ("medium" as const),
      category: c.name,
      description: c.summary,
      fix: fallbackFix,
    }));
}

export function mapOpenAiAuditToResult(
  data: AuditResponse,
  meta: { id: string; channelId: string; channelTitle: string }
): ChannelAuditResult {
  const recs = data.recommendations ?? [];
  const nextSteps = data.nextSteps?.length ? data.nextSteps : recs;
  const opportunities = data.opportunities?.length ? data.opportunities : recs.slice(0, 3);
  const fallbackFix =
    nextSteps[0] ?? "Apply the top recommendation in your next upload cycle.";

  return {
    id: meta.id,
    channelId: meta.channelId,
    channelTitle: meta.channelTitle,
    overallScore: data.overallScore,
    subScores: data.categories.map((c) => ({
      ...c,
      severity: c.score < 55 ? "high" : c.score < 70 ? "medium" : "low",
    })),
    issues: normalizeIssues(data.issues, data.categories, fallbackFix),
    opportunities,
    nextSteps,
    recommendedUploads: data.recommendedUploads ?? [],
    weakPatterns: data.weakPatterns ?? [],
    strongThemes: data.strongThemes ?? [],
    radarData: data.categories.map((c) => ({ subject: c.name, score: c.score })),
  };
}

/** Rehydrate stored audit — do not map opportunities from legacy `recommendations` (nextSteps mirror). */
export function mapAuditDocToResult(doc: AuditDoc): ChannelAuditResult {
  const legacyNextSteps = doc.recommendations ?? [];

  return {
    id: doc.id,
    channelId: doc.channelId,
    channelTitle: doc.channelTitle ?? doc.channelId,
    overallScore: doc.overallScore,
    subScores: doc.categories.map((c) => ({
      name: c.name,
      score: c.score,
      summary: c.summary,
    })),
    issues: doc.issues ?? [],
    opportunities: doc.opportunities ?? [],
    nextSteps: doc.nextSteps?.length ? doc.nextSteps : legacyNextSteps,
    recommendedUploads: [],
    weakPatterns: doc.weakPatterns ?? [],
    strongThemes: doc.strongThemes ?? [],
    radarData: doc.categories.map((c) => ({ subject: c.name, score: c.score })),
  };
}
