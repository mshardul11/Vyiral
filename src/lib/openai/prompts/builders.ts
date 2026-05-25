import type { CreatorGoal } from "@/types/entities";

export type CreatorNichePreset =
  | "gaming"
  | "education"
  | "finance"
  | "tech"
  | "vlog"
  | "shorts"
  | "podcast"
  | "general";

export interface CreatorPromptContext {
  niche: string;
  audience: string;
  goals: CreatorGoal[];
  cadence?: string;
  language?: string;
  preset?: CreatorNichePreset;
}

export function detectNichePreset(niche: string): CreatorNichePreset {
  const n = niche.toLowerCase();
  if (/game|gaming|esport/.test(n)) return "gaming";
  if (/edu|learn|teach|course|exam/.test(n)) return "education";
  if (/finance|money|invest|stock/.test(n)) return "finance";
  if (/tech|code|software|ai/.test(n)) return "tech";
  if (/vlog|daily|life|travel/.test(n)) return "vlog";
  if (/short|reel|tiktok/.test(n)) return "shorts";
  if (/podcast|audio|interview/.test(n)) return "podcast";
  return "general";
}

export function buildSystemPrompt(ctx: CreatorPromptContext): string {
  const preset = ctx.preset ?? detectNichePreset(ctx.niche);
  const goals = ctx.goals.length ? ctx.goals.join(", ") : "views, CTR";
  return `You are Vyiral, a premium YouTube creator intelligence engine.
Niche preset: ${preset}. Creator niche: "${ctx.niche}". Audience: "${ctx.audience}".
Goals: ${goals}. Upload cadence: ${ctx.cadence ?? "weekly"}.
Language preference: ${ctx.language ?? "match audience — support Indian regional creators"}.
Respond ONLY with valid JSON. Label all metrics as estimates in summaries, never claim official YouTube data.`;
}

export function buildKeywordResearchPrompt(ctx: CreatorPromptContext, query: string): string {
  return `${buildSystemPrompt(ctx)}
Expand keyword research for query "${query}".
Return JSON:
{
  "keywords": Array<{
    "keyword": string,
    "searchIntent": "informational"|"navigational"|"commercial"|"transactional",
    "searchVolumeEstimate": number,
    "competitionScore": number,
    "opportunityScore": number,
    "trendScore": number,
    "relatedKeywords": string[],
    "questionKeywords": string[],
    "intentType": "educational"|"entertainment"|"transactional"|"comparison"|"tutorial"|"trending",
    "contentFormat": string,
    "cluster": string
  }>,
  "summary": string
}
Provide 20-25 diverse keywords with clusters and question variants.`;
}

export function buildTitlesPrompt(
  ctx: CreatorPromptContext,
  topic: string,
  count: number,
  styles: string[]
): string {
  return `${buildSystemPrompt(ctx)}
Generate ${count} YouTube titles for topic "${topic}".
Styles to include: ${styles.join(", ")}.
Return JSON: { "titles": string[], "hooks": string[], "ctrTips": string[] }`;
}
