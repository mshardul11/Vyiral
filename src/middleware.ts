import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { applySecurityHeaders } from "@/lib/security/headers";

/** Routes that require an authenticated session cookie */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/keywords",
  "/titles",
  "/tags",
  "/descriptions",
  "/ideas",
  "/audit",
  "/competitors",
  "/stats",
  "/projects",
  "/settings",
  "/onboarding",
  "/workspace",
  "/calendar",
  "/trends",
  "/billing",
  "/pricing",
  "/automations",
  "/admin",
] as const;

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/api/health",
  "/api/auth/session",
]);

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/api/auth/session")) return true;
  if (pathname.startsWith("/api/health")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.includes(".")) return true;
  return false;
}

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (isProtected(pathname) && !hasSession) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return applySecurityHeaders(NextResponse.redirect(login));
  }

  if (!isPublic(pathname) && !isProtected(pathname) && pathname.startsWith("/api/")) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Not found" }, { status: 404 })
    );
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
