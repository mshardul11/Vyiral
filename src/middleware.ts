import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

const PUBLIC_PATHS = ["/", "/login", "/api/auth/session"];
const APP_PREFIXES = [
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
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/api/auth/session")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.includes(".")) return true;
  return false;
}

function isAppRoute(pathname: string): boolean {
  return APP_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (isPublic(pathname) && !isAppRoute(pathname)) {
    if (hasSession && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isAppRoute(pathname)) {
    if (!hasSession && pathname !== "/login") {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
