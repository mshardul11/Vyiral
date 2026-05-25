import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/verify-session";
import { getAdminAuth } from "@/lib/firebase/admin";
import {
  ensureUserDocumentAdmin,
  getUserDocumentAdmin,
} from "@/lib/firebase/admin-user-service";
import { logger } from "@/lib/utils/logger";

export async function GET() {
  const decoded = await verifySession();
  if (!decoded?.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let userDoc = await getUserDocumentAdmin(decoded.uid);

    if (!userDoc) {
      let email = decoded.email ?? "";
      let displayName: string | null = decoded.name ?? null;
      let photoURL: string | null = decoded.picture ?? null;

      try {
        const authUser = await getAdminAuth().getUser(decoded.uid);
        email = email || authUser.email || "";
        displayName = displayName ?? authUser.displayName ?? null;
        photoURL = photoURL ?? authUser.photoURL ?? null;
      } catch {
        /* user record may not exist in admin yet */
      }

      userDoc = await ensureUserDocumentAdmin({
        uid: decoded.uid,
        email,
        displayName,
        photoURL,
      });
    }

    return NextResponse.json(userDoc);
  } catch (error) {
    logger.error("auth/me", "GET failed", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
