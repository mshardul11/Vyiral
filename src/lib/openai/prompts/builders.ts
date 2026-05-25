import type { NicheCategory, TitleStyle } from "@/types/seo";

export const SYSTEM_VYIRAL_SEO = `You are Vyiral, an elite YouTube SEO and creator growth AI.
Output ONLY valid JSON matching the requested schema.
Label all volume/competition metrics as estimates in internal reasoning.
Optimize for CTR, search intent, and watch-time retention.`;

export function nicheContext(niche: string, audience: string, goals?: string[]) {
  return `Creator niche: ${niche}. Target audience: ${audience}.${goals?.length ? ` Goals: ${goals.join(", ")}.` : ""}`;
}

export function mapNicheToCategory(niche: string): NicheCategory {
  const n = niche.toLowerCase();
  if (/game|gaming|esport/.test(n)) return "gaming";
  if (/edu|learn|course|teach/.test(n)) return "education";
  if (/finance|money|invest|crypto/.test(n)) return "finance";
  if (/tech|software|code|ai/.test(n)) return "tech";
  if (/vlog|lifestyle|daily/.test(n)) return "vlog";
  if (/short|reel|tik/.test(n)) return "shorts";
  if (/podcast|interview|audio/.test(n)) return "podcast";
  return "general";
}

export function keywordResearchPrompt(topic: string, niche: string, audience: string) {
  return `${nicheContext(niche, audience)}
Research YouTube keywords for topic: "${topic}".
Return JSON:
{
  "keywords": [{
    "keyword": string,
    "searchIntent": "educational"|"entertainment"|"transactional"|"comparison"|"tutorial"|"trending",
    "searchVolumeEstimate": number,
    "competitionScore": number,
    "opportunityScore": number,
    "seoDifficulty": number,
    "trendScore": number,
    "trendDirection": "up"|"down"|"stable",
    "contentFormatRecommendation": string,
    "relatedKeywords": string[],
    "questionKeywords": string[],
    "cluster": string
  }],
  "summary": string
}
Provide 10-15 diverse keywords with clusters.`;
}

export function titlesPrompt(
  topic: string,
  niche: string,
  style: TitleStyle,
  count: number,
  keyword?: string
) {
  return `${nicheContext(niche, "creators")}
Generate ${count} YouTube titles for topic "${topic}"${keyword ? ` targeting keyword "${keyword}"` : ""}.
Style: ${style.replace(/_/g, " ")}.
Return JSON: { "titles": string[], "hooks": string[], "ctrTips": string[] }`;
}

export function tagsPrompt(source: string, niche: string) {
  return `${nicheContext(niche, "creators")}
Generate YouTube tags from: ${source}.
Return JSON: { "tags": string[], "categories": string[] } with 20-35 tags.`;
}

export function descriptionPrompt(
  topic: string,
  niche: string,
  format: "short" | "medium" | "long",
  title?: string
) {
  return `${nicheContext(niche, "creators")}
Write a ${format} YouTube description for "${topic}"${title ? ` titled "${title}"` : ""}.
Return JSON: {
  "description": string,
  "hooks": string[],
  "timestamps": [{"label": string, "time": string}],
  "ctas": string[],
  "hashtags": string[]
}`;
}

export function contentIdeasPrompt(topic: string, niche: string, audience: string) {
  return `${nicheContext(niche, audience)}
Generate diverse content ideas for: "${topic}".
Include long-form, shorts, series, community, livestream angles.
Return JSON: {
  "ideas": [{
    "title": string,
    "hook": string,
    "thumbnailConcept": string,
    "audienceType": string,
    "viralProbability": number,
    "contentAngle": string,
    "estimatedCompetition": "low"|"medium"|"high",
    "recommendedPublishTime": string,
    "format": string,
    "series": string | null
  }]
}`;
}

export function auditPrompt(channelSummary: string, niche: string) {
  return `${nicheContext(niche, "creators")}
Audit channel: ${channelSummary}
Return JSON: {
  "overallScore": number,
  "subScores": { "thumbnails": number, "titles": number, "descriptions": number, "cadence": number, "branding": number, "engagement": number, "seo": number },
  "categories": [{"name": string, "score": number, "summary": string}],
  "issues": [{"category": string, "severity": "low"|"medium"|"high", "title": string, "description": string, "fix": string}],
  "opportunities": string[],
  "nextSteps": string[],
  "recommendedUploads": string[],
  "weakPatterns": string[],
  "strongThemes": string[]
}`;
}
