import { NextRequest, NextResponse } from "next/server";
import { withAuthRoute } from "@/lib/auth/api-route";
import { completeOnboardingAdmin } from "@/lib/firebase/admin-user-service";
import { onboardingSchema } from "@/lib/validations/onboarding";

export const POST = withAuthRoute(async (request, { session }) => {
  const body = await request.json();
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await completeOnboardingAdmin(session.uid, parsed.data);
  return NextResponse.json({ success: true });
});
