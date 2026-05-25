export const SYSTEM_CREATOR = `You are Vyiral, an expert YouTube growth strategist.
Respond only with valid JSON matching the requested schema.
All search volume and competition metrics must be labeled as estimates in reasoning, not presented as official YouTube data.`;

export function titlePrompt(topic: string, niche: string, count = 8) {
  return `Generate ${count} high-CTR YouTube video titles for topic "${topic}" in niche "${niche}".
Return JSON: { "titles": string[], "hooks": string[], "ctrTips": string[] }`;
}

export function keywordPrompt(topic: string, niche: string) {
  return `Expand keyword research for topic "${topic}" in niche "${niche}".
Return JSON: {
  "keywords": Array<{ "keyword": string, "searchIntent": "informational"|"navigational"|"commercial"|"transactional", "searchVolumeEstimate": number, "competitionScore": number, "opportunityScore": number, "trendScore": number, "relatedKeywords": string[], "questionKeywords": string[] }>,
  "summary": string
}`;
}

export function tagsPrompt(topic: string, niche: string) {
  return `Generate YouTube tags for video topic "${topic}" in niche "${niche}".
Return JSON: { "tags": string[], "categories": string[] }`;
}

export function descriptionPrompt(topic: string, niche: string, title?: string) {
  return `Write a YouTube description for topic "${topic}" in niche "${niche}"${title ? ` with title "${title}"` : ""}.
Return JSON: { "description": string, "hooks": string[], "timestamps": Array<{ "label": string, "time": string }> }`;
}

export function contentIdeasPrompt(niche: string, audience: string, count = 6) {
  return `Generate ${count} content ideas for niche "${niche}" targeting "${audience}".
Return JSON: { "ideas": Array<{ "title": string, "angle": string, "hook": string, "format": string, "estimatedDifficulty": "low"|"medium"|"high" }> }`;
}

export function auditPrompt(channelSummary: string) {
  return `Audit this YouTube channel based on public signals:
${channelSummary}
Return JSON: {
  "overallScore": number (0-100),
  "categories": Array<{ "name": string, "score": number, "summary": string }> (titles, thumbnails, descriptions, cadence, branding, engagement, topic focus),
  "issues": Array<{ "title": string, "severity": "low"|"medium"|"high", "category": string, "description": string, "fix": string }> (2-5 actionable issues),
  "opportunities": string[] (2-4 growth opportunities),
  "nextSteps": string[] (3-5 prioritized actions),
  "recommendedUploads": string[] (2-3 video ideas),
  "weakPatterns": string[] (1-3 patterns hurting performance),
  "strongThemes": string[] (1-3 themes that work well)
}`;
}
