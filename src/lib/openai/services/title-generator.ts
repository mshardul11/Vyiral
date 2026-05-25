import { createJsonCompletion } from "@/lib/openai/client";
import { SYSTEM_CREATOR, titlePrompt } from "@/lib/openai/prompts";
import { titlesResponseSchema } from "@/lib/openai/schemas";

export async function generateTitles(params: {
  topic: string;
  niche: string;
  count?: number;
}) {
  const { data } = await createJsonCompletion({
    schemaName: "titles",
    system: SYSTEM_CREATOR,
    user: titlePrompt(params.topic, params.niche, params.count),
    parse: (raw) => titlesResponseSchema.parse(raw),
  });
  return data;
}
