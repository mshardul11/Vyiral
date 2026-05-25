/** Check server session without 401 noise. */
export async function probeServerSession(): Promise<boolean> {
  const res = await fetch("/api/auth/session", {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { authenticated?: boolean };
  return Boolean(data.authenticated);
}
