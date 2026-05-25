import type { DocumentData } from "firebase-admin/firestore";
import { BaseRepository } from "@/server/repositories/base-repository";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { ProjectDoc } from "@/types/entities";

export class ProjectsRepository extends BaseRepository<ProjectDoc> {
  constructor() {
    super(COLLECTIONS.projects);
  }

  mapDoc(id: string, data: DocumentData): ProjectDoc {
    return {
      id,
      workspaceId: data.workspaceId as string,
      ownerId: data.ownerId as string,
      name: data.name as string,
      description: data.description as string | undefined,
      color: data.color as string | undefined,
      isDefault: data.isDefault as boolean | undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async getDefaultProject(workspaceId: string, ownerId: string): Promise<ProjectDoc | null> {
    const snap = await this.collection
      .where("workspaceId", "==", workspaceId)
      .where("isDefault", "==", true)
      .limit(1)
      .get();
    if (!snap.empty) {
      const doc = snap.docs[0]!;
      return this.mapDoc(doc.id, doc.data());
    }
    const all = await this.listByWorkspace(workspaceId, { limit: 1 });
    return all.items[0] ?? null;
  }
}

export const projectsRepository = new ProjectsRepository();
