import { createJsonCompletion } from "@/lib/openai/client";
import { SYSTEM_CREATOR, tagsPrompt } from "@/lib/openai/prompts";
import { tagsResponseSchema } from "@/lib/openai/schemas";

export async function generateTags(params: { topic: string; niche: string }) {
  const { data } = await createJsonCompletion({
    schemaName: "tags",
    system: SYSTEM_CREATOR,
    user: tagsPrompt(params.topic, params.niche),
    parse: (raw) => tagsResponseSchema.parse(raw),
  });
  return data;
}
