import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Liveness probe for load balancers / uptime checks.
 * Does not expose secrets or call external APIs.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "vyiral",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV ?? "unknown",
  });
}
