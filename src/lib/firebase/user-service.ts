import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { UserDoc, UserProfileDoc } from "@/types/firestore";
import type { OnboardingFormValues } from "@/lib/validations/onboarding";

export function workspaceIdForUser(uid: string): string {
  return `ws_${uid}`;
}

export async function ensureUserDocument(
  db: Firestore,
  params: {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
  }
): Promise<UserDoc> {
  const ref = doc(db, COLLECTIONS.users, params.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data() as UserDoc;
  }

  const workspaceId = workspaceIdForUser(params.uid);
  const user: Omit<UserDoc, "createdAt" | "updatedAt"> & {
    createdAt: ReturnType<typeof serverTimestamp>;
    updatedAt: ReturnType<typeof serverTimestamp>;
  } = {
    uid: params.uid,
    email: params.email,
    displayName: params.displayName,
    photoURL: params.photoURL,
    workspaceId,
    role: "owner",
    onboardingCompleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, user, { merge: true });

  const subRef = doc(db, COLLECTIONS.subscriptions, workspaceId);
  await setDoc(
    subRef,
    {
      workspaceId,
      plan: "free",
      status: "active",
    },
    { merge: true }
  );

  return { ...user, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

export async function getUserDocument(
  db: Firestore,
  uid: string
): Promise<UserDoc | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.users, uid));
  if (!snap.exists()) return null;
  return snap.data() as UserDoc;
}

export async function getUserProfile(
  db: Firestore,
  uid: string
): Promise<UserProfileDoc | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.userProfiles, uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfileDoc;
}

export async function completeOnboarding(
  db: Firestore,
  uid: string,
  values: OnboardingFormValues
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.users, uid);
  const profileRef = doc(db, COLLECTIONS.userProfiles, uid);
  const userSnap = await getDoc(userRef);
  const workspaceId = userSnap.exists()
    ? (userSnap.data() as UserDoc).workspaceId
    : workspaceIdForUser(uid);

  const profile: Omit<UserProfileDoc, "createdAt" | "updatedAt"> & {
    createdAt: ReturnType<typeof serverTimestamp>;
    updatedAt: ReturnType<typeof serverTimestamp>;
  } = {
    uid,
    workspaceId,
    niche: values.niche,
    targetAudience: values.targetAudience,
    goals: values.goals,
    uploadCadence: values.uploadCadence,
    youtubeChannelId: null,
    youtubeChannelTitle: null,
    youtubeChannelThumbnail: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(profileRef, profile, { merge: true });
  await setDoc(
    userRef,
    { onboardingCompleted: true, updatedAt: serverTimestamp() },
    { merge: true }
  );

  await setDoc(doc(db, COLLECTIONS.activityLog, `${uid}_${Date.now()}`), {
    id: `${uid}_${Date.now()}`,
    workspaceId,
    userId: uid,
    type: "onboarding_completed",
    message: "Completed creator onboarding",
    createdAt: serverTimestamp(),
  });
}
