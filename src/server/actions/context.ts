"use server";

import { verifySession } from "@/lib/auth/verify-session";
import { usersRepository } from "@/server/repositories/users-repository";
import type { UserDoc, UserProfileDoc } from "@/types/entities";
import type { CreatorPromptContext } from "@/lib/openai/prompts/builders";
import { detectNichePreset } from "@/lib/openai/prompts/builders";

export interface ActionContext {
  uid: string;
  workspaceId: string;
  user: UserDoc;
  profile: UserProfileDoc | null;
  prompt: CreatorPromptContext;
  projectId?: string;
}

export async function getActionContext(
  projectId?: string
): Promise<ActionContext | null> {
  const decoded = await verifySession();
  if (!decoded?.uid) return null;

  const user = await usersRepository.getById(decoded.uid);
  if (!user) return null;

  const profile = await usersRepository.getProfile(decoded.uid);
  const niche = profile?.niche ?? "YouTube creators";
  const audience = profile?.targetAudience ?? "General audience";

  const prompt: CreatorPromptContext = {
    niche,
    audience,
    goals: profile?.goals ?? ["views"],
    cadence: profile?.uploadCadence,
    preset: detectNichePreset(niche),
  };

  return {
    uid: decoded.uid,
    workspaceId: user.workspaceId,
    user,
    profile,
    prompt,
    projectId,
  };
}
