import type { TitleGenerationResult, TitleStyle, TitleVariant } from "@/types/intelligence";
import { scoreTitle } from "@/lib/scoring/title";
import { pick, randInt, seededRandom } from "./seed";

const STYLES: TitleStyle[] = [
  "high_ctr",
  "educational",
  "curiosity_gap",
  "storytelling",
  "authority",
  "listicle",
  "controversial",
  "viral_challenge",
  "minimalist",
];

const TEMPLATES: Record<TitleStyle, string[]> = {
  high_ctr: ["I Tried {topic} for 30 Days — Here's What Happened", "The {topic} Strategy Nobody Talks About"],
  educational: ["{topic}: Complete Guide for Beginners (2025)", "How to Master {topic} — Step by Step"],
  curiosity_gap: ["Why Your {topic} Videos Aren't Growing", "What I Wish I Knew About {topic}"],
  storytelling: ["I Failed at {topic} Until I Did This", "My Honest {topic} Journey"],
  authority: ["{topic} Explained by a Creator with 100K Subs", "The Science of {topic} for YouTube"],
  listicle: ["7 {topic} Mistakes Killing Your Views", "5 {topic} Hacks That Actually Work"],
  controversial: ["Stop Doing {topic} Wrong (Most Creators Do)", "{topic} Is Overrated — Do This Instead"],
  viral_challenge: ["Can You Grow with ONLY {topic}? Challenge", "24 Hours of {topic} — Insane Results"],
  minimalist: ["{topic}.", "Real talk: {topic}"],
};

export function mockTitleGeneration(
  topic: string,
  count = 20,
  focusKeyword?: string
): TitleGenerationResult {
  const rng = seededRandom(topic);
  const variants: TitleVariant[] = [];

  for (let i = 0; i < count; i++) {
    const style = STYLES[i % STYLES.length]!;
    const template = pick(rng, TEMPLATES[style]);
    const text = template.replace(/\{topic\}/g, topic);
    const scored = scoreTitle(text, style, focusKeyword);
    variants.push({ text, style, ...scored, favorite: false });
  }

  variants.sort((a, b) => b.overallScore - a.overallScore);
  const bestIndex = 0;

  return {
    id: `titles_${Date.now()}`,
    topic,
    variants,
    bestIndex,
  };
}
