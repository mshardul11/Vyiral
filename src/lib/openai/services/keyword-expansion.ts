import { createJsonCompletion } from "@/lib/openai/client";
import { SYSTEM_CREATOR, keywordPrompt } from "@/lib/openai/prompts";
import { keywordsResponseSchema } from "@/lib/openai/schemas";

export async function expandKeywords(params: { topic: string; niche: string }) {
  const { data } = await createJsonCompletion({
    schemaName: "keywords",
    system: SYSTEM_CREATOR,
    user: keywordPrompt(params.topic, params.niche),
    parse: (raw) => keywordsResponseSchema.parse(raw),
  });
  return data;
}
