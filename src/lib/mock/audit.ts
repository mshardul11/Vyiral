import type { ChannelAuditResult } from "@/types/intelligence";
import { scoreChannelHealth, scoreContentConsistency } from "@/lib/scoring/channel";
import { randInt, seededRandom } from "./seed";

export function mockChannelAudit(
  channelId: string,
  channelTitle: string
): ChannelAuditResult {
  const rng = seededRandom(channelId);
  const categories = [
    { name: "Titles & SEO", score: randInt(rng, 52, 88) },
    { name: "Thumbnails", score: randInt(rng, 48, 90) },
    { name: "Descriptions", score: randInt(rng, 45, 82) },
    { name: "Upload cadence", score: scoreContentConsistency(randInt(rng, 2, 14)) },
    { name: "Branding", score: randInt(rng, 55, 92) },
    { name: "Engagement", score: randInt(rng, 50, 85) },
    { name: "Topic focus", score: randInt(rng, 58, 90) },
  ];
  const { overall } = scoreChannelHealth(categories);

  return {
    id: `audit_${Date.now()}`,
    channelId,
    channelTitle,
    overallScore: overall,
    subScores: categories.map((c) => ({
      ...c,
      summary: `${c.name} scored ${c.score}/100 based on public signals (estimated).`,
      severity: c.score < 55 ? "high" : c.score < 70 ? "medium" : "low",
    })),
    issues: [
      {
        id: "1",
        title: "Inconsistent title keywords",
        severity: "medium",
        category: "SEO",
        description: "Several recent titles miss primary search phrases.",
        fix: "Add one clear keyword phrase in the first 40 characters.",
      },
      {
        id: "2",
        title: "Thumbnail style drift",
        severity: "low",
        category: "Branding",
        description: "Color and font vary across last 10 uploads.",
        fix: "Use one template with 2 accent colors.",
      },
    ],
    opportunities: [
      "Double down on your best-performing topic cluster",
      "Add question-based titles for suggested queries",
      "Batch film 2 videos per session to stabilize cadence",
    ],
    nextSteps: [
      "Run keyword research on your top 3 themes",
      "Refresh descriptions on last 5 videos",
      "A/B test thumbnails on the next upload",
    ],
    recommendedUploads: [
      `Tutorial: core topic for ${channelTitle}`,
      "Short: quick tip from your best video",
      "Community post: ask viewers for next topic",
    ],
    weakPatterns: ["Long gaps between uploads", "Generic titles without hooks"],
    strongThemes: ["How-to content", "Practical tips for beginners"],
    radarData: categories.map((c) => ({ subject: c.name, score: c.score })),
  };
}
