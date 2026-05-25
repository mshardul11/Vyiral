import type { DocumentData } from "firebase-admin/firestore";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { UserDoc, UserProfileDoc } from "@/types/entities";

export function workspaceIdForUser(uid: string): string {
  return `ws_${uid}`;
}

export class UsersRepository {
  private get db() {
    return getAdminDb();
  }

  mapUser(id: string, data: DocumentData): UserDoc {
    return {
      uid: id,
      email: data.email as string,
      displayName: data.displayName as string | null,
      photoURL: data.photoURL as string | null,
      workspaceId: data.workspaceId as string,
      role: data.role as UserDoc["role"],
      onboardingCompleted: Boolean(data.onboardingCompleted),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async getById(uid: string): Promise<UserDoc | null> {
    const snap = await this.db.collection(COLLECTIONS.users).doc(uid).get();
    if (!snap.exists) return null;
    return this.mapUser(snap.id, snap.data()!);
  }

  async ensureUser(params: {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
  }): Promise<UserDoc> {
    const ref = this.db.collection(COLLECTIONS.users).doc(params.uid);
    const snap = await ref.get();
    if (snap.exists) return this.mapUser(snap.id, snap.data()!);

    const workspaceId = workspaceIdForUser(params.uid);
    const now = FieldValue.serverTimestamp();
    const user = {
      uid: params.uid,
      email: params.email,
      displayName: params.displayName,
      photoURL: params.photoURL,
      workspaceId,
      role: "owner" as const,
      onboardingCompleted: false,
      createdAt: now,
      updatedAt: now,
    };
    await ref.set(user, { merge: true });
    await this.db.collection(COLLECTIONS.subscriptions).doc(workspaceId).set(
      { workspaceId, plan: "free", status: "active" },
      { merge: true }
    );
    return this.mapUser(params.uid, user);
  }

  async getProfile(uid: string): Promise<UserProfileDoc | null> {
    const snap = await this.db
      .collection(COLLECTIONS.userProfiles)
      .doc(uid)
      .get();
    if (!snap.exists) return null;
    const data = snap.data()!;
    return {
      uid,
      workspaceId: data.workspaceId as string,
      niche: data.niche as string,
      targetAudience: data.targetAudience as string,
      goals: data.goals as UserProfileDoc["goals"],
      uploadCadence: data.uploadCadence as UserProfileDoc["uploadCadence"],
      youtubeChannelId: data.youtubeChannelId as string | null,
      youtubeChannelTitle: data.youtubeChannelTitle as string | null,
      youtubeChannelThumbnail: data.youtubeChannelThumbnail as string | null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

export const usersRepository = new UsersRepository();
