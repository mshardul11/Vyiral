import type { DocumentData } from "firebase-admin/firestore";
import { BaseRepository } from "@/server/repositories/base-repository";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { AuditDoc, AuditCategoryScore, DataQuality } from "@/types/entities";

export class AuditsRepository extends BaseRepository<AuditDoc> {
  constructor() {
    super(COLLECTIONS.audits);
  }

  mapDoc(id: string, data: DocumentData): AuditDoc {
    return {
      id,
      workspaceId: data.workspaceId as string,
      projectId: data.projectId as string | undefined,
      channelId: data.channelId as string,
      overallScore: Number(data.overallScore ?? 0),
      categories: (data.categories as AuditCategoryScore[]) ?? [],
      recommendations: (data.recommendations as string[]) ?? [],
      dataQuality: (data.dataQuality as DataQuality) ?? "estimated",
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async getLatest(workspaceId: string): Promise<AuditDoc | null> {
    const snap = await this.collection
      .where("workspaceId", "==", workspaceId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0]!;
    return this.mapDoc(doc.id, doc.data());
  }
}

export const auditsRepository = new AuditsRepository();
