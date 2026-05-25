import type { TagGenerationResult } from "@/types/intelligence";
import { randInt, seededRandom } from "./seed";

const GROUPS = ["Topic", "Niche", "Format", "Audience", "Trend"];

export function mockTagGeneration(source: string): TagGenerationResult {
  const rng = seededRandom(source);
  const words = source.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  const base = [...new Set([...words, source.replace(/\s+/g, "")])].slice(0, 8);

  const tags = [
    ...base,
    ...base.map((w) => `${w} tutorial`),
    ...base.map((w) => `${w} tips`),
    "youtube",
    "content creator",
    "how to",
    "2025",
    "india",
    "hindi",
  ]
    .slice(0, randInt(rng, 22, 35))
    .map((tag, i) => ({
      tag,
      relevanceScore: randInt(rng, 55, 98),
      trendScore: randInt(rng, 40, 92),
      group: GROUPS[i % GROUPS.length]!,
    }));

  return {
    id: `tags_${Date.now()}`,
    source,
    tags,
  };
}
