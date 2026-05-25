import type { DocumentData } from "firebase-admin/firestore";
import { BaseRepository } from "@/server/repositories/base-repository";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { KeywordDoc, SearchIntent } from "@/types/entities";

export class KeywordsRepository extends BaseRepository<KeywordDoc> {
  constructor() {
    super(COLLECTIONS.keywords);
  }

  mapDoc(id: string, data: DocumentData): KeywordDoc {
    return {
      id,
      workspaceId: data.workspaceId as string,
      projectId: data.projectId as string | undefined,
      keyword: data.keyword as string,
      topic: data.topic as string,
      searchIntent: data.searchIntent as SearchIntent,
      searchVolumeEstimate: Number(data.searchVolumeEstimate ?? 0),
      competitionScore: Number(data.competitionScore ?? 0),
      opportunityScore: Number(data.opportunityScore ?? 0),
      trendScore: Number(data.trendScore ?? 0),
      seoDifficulty: data.seoDifficulty != null ? Number(data.seoDifficulty) : undefined,
      trendDirection: data.trendDirection as KeywordDoc["trendDirection"],
      intentType: data.intentType as KeywordDoc["intentType"],
      contentFormat: data.contentFormat as string | undefined,
      cluster: data.cluster as string | undefined,
      relatedKeywords: (data.relatedKeywords as string[]) ?? [],
      questionKeywords: (data.questionKeywords as string[]) ?? [],
      saved: Boolean(data.saved),
      favorite: Boolean(data.favorite),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async listSaved(workspaceId: string, limit = 10): Promise<KeywordDoc[]> {
    const snap = await this.collection
      .where("workspaceId", "==", workspaceId)
      .where("saved", "==", true)
      .orderBy("opportunityScore", "desc")
      .limit(limit)
      .get();
    return snap.docs.map((d) => this.mapDoc(d.id, d.data()));
  }

  async topOpportunities(workspaceId: string, limit = 5): Promise<KeywordDoc[]> {
    const snap = await this.collection
      .where("workspaceId", "==", workspaceId)
      .orderBy("opportunityScore", "desc")
      .limit(limit)
      .get();
    return snap.docs.map((d) => this.mapDoc(d.id, d.data()));
  }
}

export const keywordsRepository = new KeywordsRepository();
