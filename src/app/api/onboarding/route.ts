import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/verify-session";
import { completeOnboardingAdmin } from "@/lib/firebase/admin-user-service";
import { onboardingSchema } from "@/lib/validations/onboarding";
import { logger } from "@/lib/utils/logger";

export async function POST(request: NextRequest) {
  const decoded = await verifySession();
  if (!decoded?.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await completeOnboardingAdmin(decoded.uid, parsed.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("onboarding", "POST failed", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
