import { createJsonCompletion } from "@/lib/openai/client";
import { SYSTEM_CREATOR, descriptionPrompt } from "@/lib/openai/prompts";
import { descriptionResponseSchema } from "@/lib/openai/schemas";

export async function generateDescription(params: {
  topic: string;
  niche: string;
  title?: string;
}) {
  const { data } = await createJsonCompletion({
    schemaName: "description",
    system: SYSTEM_CREATOR,
    user: descriptionPrompt(params.topic, params.niche, params.title),
    parse: (raw) => descriptionResponseSchema.parse(raw),
  });
  return data;
}
