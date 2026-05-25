import type {
  ChannelAuditResult,
  CompetitorInsight,
  ContentIdeaResult,
  GeneratedDescriptionResult,
  ScoredTag,
  ScoredTitle,
  TitleStyle,
} from "@/types/seo";
import { enrichTitleScores } from "@/lib/scoring";
import { generateMockKeywords } from "@/lib/mock/keyword-generator";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

const TITLE_TEMPLATES: Record<TitleStyle, (t: string) => string[]> = {
  high_ctr: (t) => [
    `I Tested ${t} — Results Shocked Me`,
    `The ${t} Strategy That Actually Works`,
  ],
  educational: (t) => [`${t} Explained Simply`, `Learn ${t} in 10 Minutes`],
  curiosity_gap: (t) => [`What ${t} Experts Won't Tell You`, `The Hidden Side of ${t}`],
  storytelling: (t) => [`How ${t} Changed Everything for Me`, `My ${t} Journey`],
  authority: (t) => [`The Definitive ${t} Guide`, `${t}: Expert Breakdown`],
  listicle: (t) => [`7 ${t} Mistakes to Avoid`, `5 ${t} Hacks That Work`],
  controversial: (t) => [`${t} Is Overrated (Here's Why)`, `Stop Doing ${t} Wrong`],
  viral_challenge: (t) => [`${t} Challenge — Day 1`, `Can You Master ${t} in 7 Days?`],
  minimalist: (t) => [`${t}.`, `${t} — Done Right`],
};

export function generateMockTitles(
  topic: string,
  style: TitleStyle,
  count: number,
  keyword?: string
): ScoredTitle[] {
  const templates = TITLE_TEMPLATES[style](topic);
  const titles: string[] = [];
  while (titles.length < count) {
    titles.push(...templates.map((t) => t.replace(/\s+/g, " ").trim()));
  }
  return enrichTitleScores(titles.slice(0, count), style, keyword).sort(
    (a, b) => b.overallScore - a.overallScore
  );
}

export function generateMockTags(topic: string, count = 25): ScoredTag[] {
  const base = topic.toLowerCase().split(/\s+/).filter(Boolean);
  const tags = new Set<string>([
    topic,
    ...base,
    `${topic} tips`,
    `${topic} 2025`,
    `how to ${topic}`,
  ]);
  let i = 0;
  while (tags.size < count) {
    tags.add(`${topic} ${["guide", "tutorial", "review", "hack"][i % 4]}`);
    i++;
  }
  return [...tags].slice(0, count).map((tag, idx) => ({
    tag,
    relevanceScore: 95 - (idx % 30),
    trendScore: 50 + (hash(tag) % 45),
    group: idx < 8 ? "Primary" : idx < 16 ? "Secondary" : "Long-tail",
  }));
}

export function generateMockDescription(
  topic: string,
  format: "short" | "medium" | "long"
): GeneratedDescriptionResult {
  const short = `Discover ${topic} with actionable tips. Subscribe for weekly ${topic} breakdowns.`;
  const medium = `${short}\n\nIn this video we cover fundamentals, common mistakes, and next steps for ${topic}. Timestamps below.\n\n🔗 Resources in pinned comment.`;
  const long = `${medium}\n\nChapters help you navigate. Keywords: ${topic}, tutorial, guide.\n\nAffiliate disclosure: Some links may be affiliate links at no extra cost to you.`;

  const body = format === "short" ? short : format === "medium" ? medium : long;
  return {
    description: body,
    hooks: [`Why ${topic} matters now`, `What you'll learn today`],
    chapters: [
      { label: "Intro", time: "0:00" },
      { label: "Core concept", time: "1:20" },
      { label: "Action steps", time: "4:10" },
      { label: "Outro", time: "7:00" },
    ],
    ctas: ["Subscribe for more", "Comment your biggest question", "Check the playlist"],
    hashtags: [`#${topic.replace(/\s/g, "")}`, "#youtube", "#creator"],
    seoScore: 72 + (hash(topic) % 20),
    readabilityScore: 78 + (hash(topic + "r") % 15),
    format,
  };
}

export function generateMockContentIdeas(topic: string, count = 8): ContentIdeaResult[] {
  const formats = ["Long-form", "Short", "Series ep.", "Community post", "Live Q&A"];
  return Array.from({ length: count }, (_, i) => ({
    id: `idea_${hash(topic)}_${i}`,
    title: `${topic} — angle ${i + 1}`,
    hook: `Open with a surprising stat about ${topic}`,
    thumbnailConcept: ["Bold text", "Face + arrow", "Before/after"][i % 3]!,
    audienceType: ["New viewers", "Returning subs", "Search traffic"][i % 3]!,
    viralProbability: 40 + (hash(`${topic}${i}`) % 50),
    contentAngle: generateMockKeywords(topic, "general", 1)[0]?.contentFormatRecommendation ?? "Tutorial",
    estimatedCompetition: (["low", "medium", "high"] as const)[i % 3]!,
    recommendedPublishTime: ["Tue 2pm", "Thu 6pm", "Sat 10am"][i % 3]!,
    format: formats[i % formats.length]!,
    series: i % 3 === 0 ? `${topic} Masterclass` : undefined,
  }));
}

export function generateMockAudit(channelTitle: string): ChannelAuditResult {
  const subScores = {
    thumbnails: 68 + (hash(channelTitle) % 25),
    titles: 72 + (hash(channelTitle + "t") % 20),
    descriptions: 61 + (hash(channelTitle + "d") % 30),
    cadence: 75,
    branding: 70,
    engagement: 66,
    seo: 64,
  };
  const overall = Math.round(
    Object.values(subScores).reduce((a, b) => a + b, 0) / Object.keys(subScores).length
  );
  return {
    id: `audit_${hash(channelTitle)}`,
    channelId: "mock_channel",
    channelTitle,
    overallScore: overall,
    subScores,
    categories: Object.entries(subScores).map(([name, score]) => ({
      name,
      score,
      summary: `${name} vs niche median — room to optimize`,
    })),
    issues: [
      {
        id: "1",
        category: "titles",
        severity: "medium",
        title: "Inconsistent title formulas",
        description: "Mix of listicle and vague titles reduces CTR predictability",
        fix: "Adopt 2–3 proven title templates per content pillar",
      },
      {
        id: "2",
        category: "seo",
        severity: "high",
        title: "Thin descriptions",
        description: "Many uploads lack keyword-rich first 2 lines",
        fix: "Front-load target keyword + value prop in 150 chars",
      },
    ],
    opportunities: [
      "Double down on top 20% performing topic cluster",
      "Add Shorts repurposing from long-form hooks",
    ],
    nextSteps: [
      "Run keyword research on top-performing video topic",
      "A/B test thumbnails on next 3 uploads",
      "Batch descriptions with AI generator",
    ],
    recommendedUploads: [
      "Tutorial deep-dive (8–12 min)",
      "Comparison video with clear winner",
      "Weekly update short",
    ],
    weakPatterns: ["Generic thumbnails", "Upload gaps > 10 days"],
    strongThemes: ["How-to content", "Beginner-friendly pacing"],
    dataQuality: "estimated",
  };
}

export function generateMockCompetitors(count = 3): CompetitorInsight[] {
  const names = ["Creator Alpha", "Niche Pro", "Trend Labs"];
  return names.slice(0, count).map((name, i) => ({
    id: `comp_${i}`,
    channelId: `UC_mock_${i}`,
    channelTitle: name,
    subscriberCount: 50000 * (i + 1) + hash(name) % 20000,
    growthTrend: 2 + (hash(name) % 12),
    uploadFrequency: ["3x/week", "Weekly", "2x/week"][i]!,
    momentumScore: 60 + (hash(name) % 35),
    keywordOverlap: ["tutorial", "tips", "review"].slice(0, 2 + i),
    topicOverlap: ["education", "how-to"],
    alertEnabled: i === 0,
  }));
}
