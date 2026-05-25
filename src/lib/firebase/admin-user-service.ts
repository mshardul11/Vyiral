import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { stripUndefined } from "@/lib/firebase/converters";
import type { UserDoc, UserProfileDoc } from "@/types/firestore";
import type { OnboardingFormValues } from "@/lib/validations/onboarding";

export function workspaceIdForUser(uid: string): string {
  return `ws_${uid}`;
}

export async function ensureUserDocumentAdmin(params: {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}): Promise<UserDoc> {
  const db = getAdminDb();
  const ref = db.collection(COLLECTIONS.users).doc(params.uid);
  const snap = await ref.get();

  if (snap.exists) {
    return snap.data() as UserDoc;
  }

  const workspaceId = workspaceIdForUser(params.uid);
  const now = FieldValue.serverTimestamp();
  const user: Record<string, unknown> = {
    uid: params.uid,
    email: params.email,
    displayName: params.displayName,
    photoURL: params.photoURL,
    workspaceId,
    role: "owner",
    onboardingCompleted: false,
    createdAt: now,
    updatedAt: now,
  };

  await ref.set(user, { merge: true });
  await db.collection(COLLECTIONS.subscriptions).doc(workspaceId).set(
    { workspaceId, plan: "free", status: "active" },
    { merge: true }
  );

  return {
    ...(user as Omit<UserDoc, "createdAt" | "updatedAt">),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function getUserDocumentAdmin(uid: string): Promise<UserDoc | null> {
  const snap = await getAdminDb().collection(COLLECTIONS.users).doc(uid).get();
  if (!snap.exists) return null;
  return snap.data() as UserDoc;
}

export async function getUserProfileAdmin(
  uid: string
): Promise<UserProfileDoc | null> {
  const snap = await getAdminDb()
    .collection(COLLECTIONS.userProfiles)
    .doc(uid)
    .get();
  if (!snap.exists) return null;
  return snap.data() as UserProfileDoc;
}

function resolveWorkspaceId(uid: string, userData: Record<string, unknown> | undefined): string {
  const fromDoc = userData?.workspaceId;
  if (typeof fromDoc === "string" && fromDoc.trim()) {
    return fromDoc;
  }
  return workspaceIdForUser(uid);
}

export async function completeOnboardingAdmin(
  uid: string,
  values: OnboardingFormValues
): Promise<void> {
  const db = getAdminDb();
  const userRef = db.collection(COLLECTIONS.users).doc(uid);
  const userSnap = await userRef.get();
  const userData = userSnap.exists ? userSnap.data() : undefined;
  const workspaceId = resolveWorkspaceId(uid, userData);

  const now = FieldValue.serverTimestamp();

  if (!userSnap.exists) {
    await userRef.set(
      stripUndefined({
        uid,
        email: "",
        displayName: null,
        photoURL: null,
        workspaceId,
        role: "owner",
        onboardingCompleted: false,
        createdAt: now,
        updatedAt: now,
      }),
      { merge: true }
    );
    await db.collection(COLLECTIONS.subscriptions).doc(workspaceId).set(
      { workspaceId, plan: "free", status: "active" },
      { merge: true }
    );
  } else if (!userData?.workspaceId) {
    await userRef.set({ workspaceId, updatedAt: now }, { merge: true });
  }

  await db.collection(COLLECTIONS.userProfiles).doc(uid).set(
    stripUndefined({
      uid,
      workspaceId,
      niche: values.niche,
      targetAudience: values.targetAudience ?? "YouTube viewers",
      goals: values.goals?.length ? values.goals : ["views"],
      uploadCadence: values.uploadCadence,
      youtubeChannelId: null,
      youtubeChannelTitle: null,
      youtubeChannelThumbnail: null,
      createdAt: now,
      updatedAt: now,
    }),
    { merge: true }
  );

  await userRef.set(
    { onboardingCompleted: true, updatedAt: now },
    { merge: true }
  );

  await db.collection(COLLECTIONS.activityLog).add({
    workspaceId,
    userId: uid,
    type: "onboarding_completed",
    message: "Completed creator onboarding",
    createdAt: now,
  });
}
