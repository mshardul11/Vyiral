import { NextResponse } from "next/server";
import { withAuthRoute } from "@/lib/auth/api-route";
import { serializeUserDoc } from "@/lib/auth/serialize-user";
import { userDocFromSession } from "@/lib/auth/session-user";
import { getAdminAuth } from "@/lib/firebase/admin";
import { usersRepository } from "@/server/repositories/users-repository";

export const GET = withAuthRoute(async (_request, { session }) => {
  let user = null;

  try {
    user = await usersRepository.getById(session.uid);
  } catch (error) {
    console.error("[auth/me] getById failed", error);
  }

  if (!user) {
    let email = session.email ?? "";
    let displayName: string | null = session.name ?? null;
    let photoURL: string | null = session.picture ?? null;

    try {
      const authUser = await getAdminAuth().getUser(session.uid);
      email = email || authUser.email || "";
      displayName = displayName ?? authUser.displayName ?? null;
      photoURL = photoURL ?? authUser.photoURL ?? null;
    } catch {
      /* optional enrichment */
    }

    try {
      user = await usersRepository.ensureUser({
        uid: session.uid,
        email,
        displayName,
        photoURL,
      });
    } catch (error) {
      console.error("[auth/me] ensureUser failed", error);
      user = userDocFromSession(session);
      if (email) user.email = email;
      if (displayName) user.displayName = displayName;
      if (photoURL) user.photoURL = photoURL;
    }
  }

  return NextResponse.json(serializeUserDoc(user));
});
