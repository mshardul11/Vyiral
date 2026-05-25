import { createJsonCompletion } from "@/lib/openai/client";
import { SYSTEM_CREATOR, contentIdeasPrompt } from "@/lib/openai/prompts";
import { contentIdeasResponseSchema } from "@/lib/openai/schemas";

export async function generateContentIdeas(params: {
  niche: string;
  audience: string;
  count?: number;
}) {
  const { data } = await createJsonCompletion({
    schemaName: "contentIdeas",
    system: SYSTEM_CREATOR,
    user: contentIdeasPrompt(params.niche, params.audience, params.count),
    parse: (raw) => contentIdeasResponseSchema.parse(raw),
  });
  return data;
}
