/** Route classification for middleware and auth guards */

export const PUBLIC_PATHS = ["/", "/login"] as const;

export const AUTH_API_PUBLIC_PREFIXES = ["/api/auth/session"] as const;

export const AUTH_API_PROTECTED_PREFIXES = [
  "/api/auth/me",
  "/api/onboarding",
] as const;

export const APP_ROUTE_PREFIXES = [
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
] as const;

export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname as (typeof PUBLIC_PATHS)[number])) {
    return true;
  }
  if (pathname.startsWith("/_next")) return true;
  if (/\.[a-z0-9]+$/i.test(pathname)) return true;
  return AUTH_API_PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export function isAppRoute(pathname: string): boolean {
  return APP_ROUTE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function isProtectedApiRoute(pathname: string): boolean {
  return AUTH_API_PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}
