import OpenAI from "openai";
import { requireOpenAIKey } from "@/lib/validators/env";
import { logger } from "@/lib/utils/logger";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: requireOpenAIKey() });
  }
  return client;
}

export interface CompletionUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export async function createJsonCompletion<T>(params: {
  model?: string;
  system: string;
  user: string;
  schemaName: string;
  maxRetries?: number;
  parse: (raw: unknown) => T;
}): Promise<{ data: T; usage: CompletionUsage }> {
  const openai = getOpenAIClient();
  const maxRetries = params.maxRetries ?? 2;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: params.model ?? "gpt-4o-mini",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: params.system },
          { role: "user", content: params.user },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("Empty OpenAI response");

      const parsed = JSON.parse(content) as unknown;
      const data = params.parse(parsed);

      const usage: CompletionUsage = {
        promptTokens: response.usage?.prompt_tokens ?? 0,
        completionTokens: response.usage?.completion_tokens ?? 0,
        totalTokens: response.usage?.total_tokens ?? 0,
      };

      logger.info("openai", `${params.schemaName} completion`, {
        tokens: usage.totalTokens,
        attempt,
      });

      return { data, usage };
    } catch (error) {
      lastError = error;
      logger.warn("openai", `Retry ${attempt + 1}/${maxRetries}`, {
        schema: params.schemaName,
        error: error instanceof Error ? error.message : error,
      });
      if (attempt === maxRetries) break;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("OpenAI request failed");
}
