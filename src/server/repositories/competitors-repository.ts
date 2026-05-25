import type { DocumentData } from "firebase-admin/firestore";
import { BaseRepository } from "@/server/repositories/base-repository";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { CompetitorDoc } from "@/types/entities";

export class CompetitorsRepository extends BaseRepository<CompetitorDoc> {
  constructor() {
    super(COLLECTIONS.competitors);
  }

  mapDoc(id: string, data: DocumentData): CompetitorDoc {
    return {
      id,
      workspaceId: data.workspaceId as string,
      channelId: data.channelId as string,
      channelTitle: data.channelTitle as string,
      thumbnailUrl: data.thumbnailUrl as string | undefined,
      subscriberCount: data.subscriberCount as number | undefined,
      uploadFrequency: data.uploadFrequency as string | undefined,
      momentumScore: data.momentumScore as number | undefined,
      keywordOverlap: data.keywordOverlap as number | undefined,
      topicOverlap: data.topicOverlap as number | undefined,
      notes: data.notes as string | undefined,
      alertEnabled: Boolean(data.alertEnabled),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async listWithAlerts(workspaceId: string): Promise<CompetitorDoc[]> {
    const snap = await this.collection
      .where("workspaceId", "==", workspaceId)
      .where("alertEnabled", "==", true)
      .limit(10)
      .get();
    return snap.docs.map((d) => this.mapDoc(d.id, d.data()));
  }
}

export const competitorsRepository = new CompetitorsRepository();
