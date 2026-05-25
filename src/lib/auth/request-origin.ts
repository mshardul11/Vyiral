import { getAppOrigin } from "@/lib/validators/env";

/** Reject cross-origin session creation in production. */
export function isAllowedAuthOrigin(request: Request): boolean {
  if (process.env.NODE_ENV !== "production") return true;

  const origin = request.headers.get("origin");
  if (!origin) return true;

  const appOrigin = getAppOrigin().replace(/\/$/, "");
  return origin.replace(/\/$/, "") === appOrigin;
}
