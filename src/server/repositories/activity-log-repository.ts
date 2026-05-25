import type { DocumentData } from "firebase-admin/firestore";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { ActivityLogDoc } from "@/types/entities";

export class ActivityLogRepository {
  private get collection() {
    return getAdminDb().collection(COLLECTIONS.activityLog);
  }

  mapDoc(id: string, data: DocumentData): ActivityLogDoc {
    return {
      id,
      workspaceId: data.workspaceId as string,
      userId: data.userId as string,
      type: data.type as string,
      message: data.message as string,
      metadata: data.metadata as Record<string, unknown> | undefined,
      createdAt: data.createdAt,
    };
  }

  async log(params: {
    workspaceId: string;
    userId: string;
    type: string;
    message: string;
    metadata?: Record<string, unknown>;
  }): Promise<ActivityLogDoc> {
    const ref = await this.collection.add({
      workspaceId: params.workspaceId,
      userId: params.userId,
      type: params.type,
      message: params.message,
      metadata: params.metadata,
      createdAt: FieldValue.serverTimestamp(),
    });
    const snap = await ref.get();
    return this.mapDoc(snap.id, snap.data()!);
  }

  async listRecent(workspaceId: string, limit = 10): Promise<ActivityLogDoc[]> {
    const snap = await this.collection
      .where("workspaceId", "==", workspaceId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();
    return snap.docs.map((d) => this.mapDoc(d.id, d.data()));
  }
}

export const activityLogRepository = new ActivityLogRepository();
