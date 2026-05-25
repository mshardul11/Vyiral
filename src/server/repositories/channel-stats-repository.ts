import type { DocumentData } from "firebase-admin/firestore";
import { BaseRepository } from "@/server/repositories/base-repository";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { ChannelStatsSnapshotDoc, DataQuality } from "@/types/entities";

export class ChannelStatsRepository extends BaseRepository<ChannelStatsSnapshotDoc> {
  constructor() {
    super(COLLECTIONS.channelStatsSnapshots);
  }

  mapDoc(id: string, data: DocumentData): ChannelStatsSnapshotDoc {
    return {
      id,
      workspaceId: data.workspaceId as string,
      channelId: data.channelId as string,
      subscriberCount: Number(data.subscriberCount ?? 0),
      viewCount: Number(data.viewCount ?? 0),
      videoCount: Number(data.videoCount ?? 0),
      engagementRate: data.engagementRate as number | undefined,
      snapshotAt: data.snapshotAt ?? data.createdAt,
      dataQuality: (data.dataQuality as DataQuality) ?? "estimated",
      createdAt: data.createdAt,
    };
  }

  async getLatest(workspaceId: string, channelId?: string): Promise<ChannelStatsSnapshotDoc | null> {
    let query = this.collection
      .where("workspaceId", "==", workspaceId)
      .orderBy("snapshotAt", "desc")
      .limit(1);
    if (channelId) {
      query = this.collection
        .where("workspaceId", "==", workspaceId)
        .where("channelId", "==", channelId)
        .orderBy("snapshotAt", "desc")
        .limit(1);
    }
    const snap = await query.get();
    if (snap.empty) return null;
    const doc = snap.docs[0]!;
    return this.mapDoc(doc.id, doc.data());
  }
}

export const channelStatsRepository = new ChannelStatsRepository();
