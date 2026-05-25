import type { UserDoc } from "@/types/entities";

export function getPostLoginPath(
  userDoc: Pick<UserDoc, "onboardingCompleted"> | null,
  next?: string
): string {
  if (!userDoc || !userDoc.onboardingCompleted) return "/onboarding";
  if (next?.startsWith("/") && !next.startsWith("//")) return next;
  return "/dashboard";
}
