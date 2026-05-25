import { NextResponse } from "next/server";
import type { DecodedIdToken } from "firebase-admin/auth";
import { verifySession } from "@/lib/auth/verify-session";

type AuthRouteHandler = (
  request: Request,
  context: { session: DecodedIdToken }
) => Promise<Response>;

/**
 * Wraps an API route handler — returns 401 if session cookie is missing/invalid.
 */
export function withAuthRoute(handler: AuthRouteHandler) {
  return async function authenticatedRoute(request: Request): Promise<Response> {
    const session = await verifySession();
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      return await handler(request, { session });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Server error";
      console.error("[api] handler error", error);
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
  };
}
