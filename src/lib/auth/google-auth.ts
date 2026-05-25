const AUTH_NEXT_KEY = "vyiral_auth_next";

export function storeAuthReturnPath(path: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_NEXT_KEY, path);
}

export function consumeAuthReturnPath(): string {
  if (typeof window === "undefined") return "/dashboard";
  const path = sessionStorage.getItem(AUTH_NEXT_KEY);
  sessionStorage.removeItem(AUTH_NEXT_KEY);
  if (path && path.startsWith("/") && !path.startsWith("//")) return path;
  return "/dashboard";
}
