import type { DecodedIdToken } from "firebase-admin/auth";
import { workspaceIdForUser } from "@/server/repositories/users-repository";
import type { UserDoc } from "@/types/entities";

/** Minimal user record from the session cookie when Firestore is temporarily unavailable */
export function userDocFromSession(session: DecodedIdToken): UserDoc {
  const now = new Date().toISOString();
  return {
    uid: session.uid,
    email: session.email ?? "",
    displayName: session.name ?? null,
    photoURL: session.picture ?? null,
    workspaceId: workspaceIdForUser(session.uid),
    role: "owner",
    onboardingCompleted: false,
    createdAt: now,
    updatedAt: now,
  };
}
