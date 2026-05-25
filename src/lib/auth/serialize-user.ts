import { toIsoString } from "@/lib/firebase/converters";
import type { UserDoc } from "@/types/entities";

/** JSON-safe user payload for client / API responses */
function isServerTimestampSentinel(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "_methodName" in value &&
    (value as { _methodName: string })._methodName === "FieldValue.serverTimestamp"
  );
}

export function serializeUserDoc(user: UserDoc): UserDoc {
  return {
    ...user,
    email: user.email ?? "",
    workspaceId:
      user.workspaceId?.trim() || `ws_${user.uid}`,
    onboardingCompleted: Boolean(user.onboardingCompleted),
    createdAt: isServerTimestampSentinel(user.createdAt)
      ? new Date().toISOString()
      : toIsoString(user.createdAt),
    updatedAt: isServerTimestampSentinel(user.updatedAt)
      ? new Date().toISOString()
      : toIsoString(user.updatedAt),
  };
}
