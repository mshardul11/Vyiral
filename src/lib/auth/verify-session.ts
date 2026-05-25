import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import type { DecodedIdToken } from "firebase-admin/auth";

export async function verifySession(): Promise<DecodedIdToken | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;

  try {
    return await getAdminAuth().verifySessionCookie(session, true);
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<DecodedIdToken> {
  const decoded = await verifySession();
  if (!decoded) throw new Error("Unauthorized");
  return decoded;
}
