import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/verify-session";
import { logger } from "@/lib/utils/logger";

type SessionUser = NonNullable<Awaited<ReturnType<typeof verifySession>>>;

type RouteContext = { params: Promise<Record<string, string>> };

type AuthedHandler = (
  request: Request,
  context: RouteContext & { session: SessionUser }
) => Promise<Response>;

export function withAuth(handler: AuthedHandler) {
  return async (request: Request, context: RouteContext) => {
    try {
      const session = await verifySession();
      if (!session?.uid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return await handler(request, { ...context, session });
    } catch (error) {
      logger.error("api", "Unhandled route error", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
