import type { DocumentData } from "firebase-admin/firestore";
import { BaseRepository } from "@/server/repositories/base-repository";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { SavedItemDoc } from "@/types/entities";

export class SavedItemsRepository extends BaseRepository<SavedItemDoc> {
  constructor() {
    super(COLLECTIONS.savedItems);
  }

  mapDoc(id: string, data: DocumentData): SavedItemDoc {
    return {
      id,
      workspaceId: data.workspaceId as string,
      userId: data.userId as string,
      resourceType: data.resourceType as SavedItemDoc["resourceType"],
      resourceId: data.resourceId as string,
      label: data.label as string,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

export const savedItemsRepository = new SavedItemsRepository();
