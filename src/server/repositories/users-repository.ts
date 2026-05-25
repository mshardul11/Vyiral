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
    const workspaceId =
      typeof data.workspaceId === "string" && data.workspaceId.trim()
        ? data.workspaceId
        : workspaceIdForUser(id);

    return {
      uid: id,
      email: (data.email as string) ?? "",
      displayName: (data.displayName as string | null) ?? null,
      photoURL: (data.photoURL as string | null) ?? null,
      workspaceId,
      role: (data.role as UserDoc["role"]) ?? "owner",
      onboardingCompleted: Boolean(data.onboardingCompleted),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt ?? data.createdAt,
    };
  }

  async getById(uid: string): Promise<UserDoc | null> {
    const ref = this.db.collection(COLLECTIONS.users).doc(uid);
    const snap = await ref.get();
    if (!snap.exists) return null;

    const data = snap.data()!;
    const mapped = this.mapUser(snap.id, data);

    if (!data.workspaceId && mapped.workspaceId) {
      try {
        await ref.update({
          workspaceId: mapped.workspaceId,
          updatedAt: FieldValue.serverTimestamp(),
        });
      } catch (e) {
        console.warn("[users] workspaceId backfill failed", e);
      }
    }

    return mapped;
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
    await ref.set(
      {
        uid: params.uid,
        email: params.email,
        displayName: params.displayName,
        photoURL: params.photoURL,
        workspaceId,
        role: "owner" as const,
        onboardingCompleted: false,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    try {
      await this.db.collection(COLLECTIONS.subscriptions).doc(workspaceId).set(
        { workspaceId, plan: "free", status: "active" },
        { merge: true }
      );
    } catch (e) {
      console.warn("[users] subscription bootstrap failed (non-fatal)", e);
    }

    const fresh = await ref.get();
    if (fresh.exists) return this.mapUser(fresh.id, fresh.data()!);

    const fallbackNow = new Date().toISOString();
    return {
      uid: params.uid,
      email: params.email,
      displayName: params.displayName,
      photoURL: params.photoURL,
      workspaceId,
      role: "owner",
      onboardingCompleted: false,
      createdAt: fallbackNow,
      updatedAt: fallbackNow,
    };
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
