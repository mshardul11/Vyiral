import type { TitleStyle } from "@/types/intelligence";
import { buildBreakdown, weightedScore } from "./weighted";
import type { ScoreBreakdown } from "./types";

const POWER_WORDS =
  /\b(secret|shocking|ultimate|proven|free|new|best|how to|why|never|always|mistake|hack|guide)\b/i;
const CURIOSITY = /\b(what|why|how|you won't|nobody|truth|revealed|actually)\b/i;
const NUMBERS = /\b\d+\b/;

export function scoreTitle(
  text: string,
  style: TitleStyle,
  focusKeyword?: string
): {
  ctrScore: number;
  lengthScore: number;
  keywordDensity: number;
  emotionalTriggers: string[];
  overallScore: number;
  breakdown: ScoreBreakdown;
} {
  const len = text.length;
  const lengthScore =
    len >= 45 && len <= 65 ? 95 : len >= 35 && len <= 75 ? 78 : len < 30 ? 55 : 65;

  let ctrBase = 50;
  const triggers: string[] = [];
  if (POWER_WORDS.test(text)) {
    ctrBase += 12;
    triggers.push("Power word");
  }
  if (CURIOSITY.test(text)) {
    ctrBase += 10;
    triggers.push("Curiosity hook");
  }
  if (NUMBERS.test(text)) {
    ctrBase += 8;
    triggers.push("Specific number");
  }
  if (text.includes("?")) {
    ctrBase += 6;
    triggers.push("Question");
  }
  const styleBoost: Record<TitleStyle, number> = {
    high_ctr: 14,
    curiosity_gap: 12,
    listicle: 10,
    controversial: 9,
    viral_challenge: 8,
    educational: 6,
    storytelling: 5,
    authority: 5,
    minimalist: 3,
  };
  ctrBase += styleBoost[style] ?? 0;
  const ctrScore = Math.min(98, ctrBase + Math.floor(Math.random() * 6));

  let keywordDensity = 0;
  if (focusKeyword) {
    const kw = focusKeyword.toLowerCase().trim();
    const lower = text.toLowerCase();
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = Math.max(words.length, 1);

    if (lower.includes(kw)) {
      const kwWordCount = kw.split(/\s+/).filter(Boolean).length;
      keywordDensity = Math.min(100, Math.round((kwWordCount / wordCount) * 100));
    } else {
      const kwTokens = kw.split(/\s+/).filter(Boolean);
      const hits = words.filter((w) =>
        kwTokens.some(
          (t) => w.toLowerCase() === t || w.toLowerCase().includes(t) || t.includes(w.toLowerCase())
        )
      ).length;
      keywordDensity = Math.round((hits / wordCount) * 100);
    }
  } else {
    keywordDensity = 35 + Math.floor(Math.random() * 20);
  }

  const overallScore = weightedScore({
    weights: { ctr: 0.5, length: 0.25, keyword: 0.25 },
    values: { ctr: ctrScore, length: lengthScore, keyword: keywordDensity },
  });

  const breakdown = buildBreakdown("Title CTR potential", [
    { name: "CTR signals", impact: ctrScore, note: triggers.join(", ") || "Baseline phrasing" },
    { name: "Length fit", impact: lengthScore, note: `${len} characters` },
    {
      name: "Keyword presence",
      impact: keywordDensity,
      note: focusKeyword ? `Target: ${focusKeyword}` : "No focus keyword",
    },
  ]);

  return {
    ctrScore,
    lengthScore,
    keywordDensity,
    emotionalTriggers: triggers,
    overallScore,
    breakdown,
  };
}
