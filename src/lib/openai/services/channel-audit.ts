import { createJsonCompletion } from "@/lib/openai/client";
import { SYSTEM_CREATOR, auditPrompt } from "@/lib/openai/prompts";
import { auditResponseSchema } from "@/lib/openai/schemas";

export async function generateChannelAudit(channelSummary: string) {
  const { data } = await createJsonCompletion({
    schemaName: "channelAudit",
    system: SYSTEM_CREATOR,
    user: auditPrompt(channelSummary),
    parse: (raw) => auditResponseSchema.parse(raw),
  });
  return { ...data, dataQuality: "estimated" as const };
}
