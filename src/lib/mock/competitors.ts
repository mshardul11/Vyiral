import type { CompetitorIntelligenceResult } from "@/types/intelligence";
import { randInt, seededRandom } from "./seed";

export function mockCompetitorIntel(
  workspaceSeed: string,
  channelTitles: string[] = []
): CompetitorIntelligenceResult {
  const rng = seededRandom(workspaceSeed);
  const defaults = channelTitles.length
    ? channelTitles
    : ["Creator Academy IN", "Village Vlogs Pro", "Tech Hindi Hub"];

  const competitors = defaults.map((title, i) => ({
    id: `comp_${i}`,
    channelId: `UC_mock_${i}`,
    channelTitle: title,
    thumbnailUrl: undefined,
    subscriberCount: randInt(rng, 12000, 890000),
    uploadFrequency: pickFreq(rng),
    momentumScore: randInt(rng, 40, 95),
    keywordOverlap: randInt(rng, 18, 72),
    topicOverlap: randInt(rng, 22, 68),
    alertEnabled: i === 0,
  }));

  return {
    competitors,
    growthComparison: competitors.map((c) => ({
      name: c.channelTitle,
      growth: randInt(rng, -5, 28),
    })),
    topContent: Array.from({ length: 5 }, (_, i) => {
      const c = competitors[i % competitors.length]!;
      return {
        title: `Top video #${i + 1} from ${c.channelTitle}`,
        views: `${randInt(rng, 20, 450)}K`,
        channel: c.channelTitle,
      };
    }),
    opportunityGaps: [
      "Competitors rarely post Shorts in your niche — own quick tips",
      "Question-style titles underused in your cluster",
      "Regional language hooks are trending up",
    ],
    trendingTopics: ["AI tools for editing", "Village storytelling", "Zero-budget setup"],
  };
}

function pickFreq(rng: () => number): string {
  const opts = ["Daily", "3× per week", "Weekly", "Biweekly"];
  return opts[Math.floor(rng() * opts.length)]!;
}
