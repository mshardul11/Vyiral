import type { DecodedIdToken } from "firebase-admin/auth";
import { verifySession, requireSession } from "@/lib/auth/verify-session";
import { usersRepository } from "@/server/repositories/users-repository";
import { UnauthorizedError } from "@/lib/utils/errors";
import type { UserDoc, UserProfileDoc } from "@/types/entities";

export interface WorkspaceContext {
  uid: string;
  session: DecodedIdToken;
  user: UserDoc;
  profile: UserProfileDoc | null;
  niche: string;
  audience: string;
}

/** Resolve Firestore user for the current session, bootstrapping on first sign-in */
export async function resolveSessionUser(): Promise<UserDoc | null> {
  const decoded = await verifySession();
  if (!decoded?.uid) return null;

  let user = await usersRepository.getById(decoded.uid);
  if (!user) {
    try {
      user = await usersRepository.ensureUser({
        uid: decoded.uid,
        email: decoded.email ?? "",
        displayName: decoded.name ?? null,
        photoURL: decoded.picture ?? null,
      });
    } catch (error) {
      console.error("[auth] ensureUser failed", error);
      return null;
    }
  }
  return user;
}

export async function getWorkspaceContext(): Promise<WorkspaceContext | null> {
  const decoded = await verifySession();
  if (!decoded?.uid) return null;

  const user = await resolveSessionUser();
  if (!user) return null;

  const profile = await usersRepository.getProfile(decoded.uid);
  return {
    uid: decoded.uid,
    session: decoded,
    user,
    profile,
    niche: profile?.niche ?? "general",
    audience: profile?.targetAudience ?? "YouTube viewers",
  };
}

export async function requireWorkspaceContext(): Promise<WorkspaceContext> {
  const ctx = await getWorkspaceContext();
  if (!ctx) {
    throw new UnauthorizedError("Sign in required");
  }
  return ctx;
}

export { verifySession, requireSession };
