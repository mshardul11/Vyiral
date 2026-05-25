import type { Messages } from "./messages/en";

type NestedKeyOf<O> = O extends object
  ? {
      [K in keyof O]: K extends string
        ? O[K] extends object
          ? `${K}.${NestedKeyOf<O[K]>}`
          : K
        : never;
    }[keyof O]
  : never;

export type MessageKey = NestedKeyOf<Messages>;

export function getMessage(
  messages: Messages,
  key: MessageKey
): string {
  const parts = key.split(".");
  let current: unknown = messages;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return key;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : key;
}
