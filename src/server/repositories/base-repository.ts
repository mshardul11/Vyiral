import {
  FieldValue,
  type DocumentData,
  type Firestore,
  type Query,
  type Timestamp,
} from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { toIsoString } from "@/lib/firebase/converters";
import { NotFoundError } from "@/lib/utils/errors";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/app";
import type { PaginatedResult } from "@/types/api";

export interface PaginationOptions {
  limit?: number;
  cursor?: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export abstract class BaseRepository<T extends { id: string }> {
  constructor(protected readonly collectionPath: string) {}

  protected get db(): Firestore {
    return getAdminDb();
  }

  protected get collection() {
    return this.db.collection(this.collectionPath);
  }

  protected abstract mapDoc(id: string, data: DocumentData): T;

  protected serializeForWrite(
    entity: Partial<T>
  ): Record<string, unknown> {
    const { id: _id, ...rest } = entity as T & { id?: string };
    return rest as Record<string, unknown>;
  }

  async getById(id: string): Promise<T | null> {
    const snap = await this.collection.doc(id).get();
    if (!snap.exists) return null;
    return this.mapDoc(snap.id, snap.data()!);
  }

  async getByIdOrThrow(id: string): Promise<T> {
    const doc = await this.getById(id);
    if (!doc) throw new NotFoundError(`${this.collectionPath}/${id}`);
    return doc;
  }

  async create(
    id: string,
    data: Omit<T, "id" | "createdAt" | "updatedAt"> & {
      createdAt?: Timestamp | FieldValue;
      updatedAt?: Timestamp | FieldValue;
    }
  ): Promise<T> {
    const now = FieldValue.serverTimestamp();
    const payload = {
      ...this.serializeForWrite(data as Partial<T>),
      createdAt: now,
      updatedAt: now,
    };
    await this.collection.doc(id).set(payload, { merge: false });
    const created = await this.getById(id);
    return created!;
  }

  async update(
    id: string,
    data: Partial<Omit<T, "id" | "createdAt">>
  ): Promise<T> {
    await this.collection.doc(id).set(
      {
        ...this.serializeForWrite(data as Partial<T>),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return this.getByIdOrThrow(id);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async listByWorkspace(
    workspaceId: string,
    options: PaginationOptions & {
      projectId?: string;
      extraFilters?: Array<{
        field: string;
        op: "<" | "<=" | "==" | "!=" | ">=" | ">" | "array-contains" | "in" | "array-contains-any";
        value: unknown;
      }>;
    } = {}
  ): Promise<PaginatedResult<T>> {
    const limit = Math.min(options.limit ?? DEFAULT_PAGE_SIZE, 100);
    let query: Query = this.collection
      .where("workspaceId", "==", workspaceId)
      .orderBy(options.orderBy ?? "createdAt", options.orderDirection ?? "desc")
      .limit(limit + 1);

    if (options.projectId) {
      query = query.where("projectId", "==", options.projectId);
    }

    for (const filter of options.extraFilters ?? []) {
      query = query.where(filter.field, filter.op, filter.value);
    }

    if (options.cursor) {
      const cursorDoc = await this.collection.doc(options.cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snap = await query.get();
    const docs = snap.docs;
    const hasMore = docs.length > limit;
    const page = hasMore ? docs.slice(0, limit) : docs;

    return {
      items: page.map((d) => this.mapDoc(d.id, d.data())),
      nextCursor: hasMore ? page[page.length - 1]?.id : undefined,
      hasMore,
    };
  }

  async batchCreate(
    items: Array<{ id: string; data: Omit<T, "id" | "createdAt" | "updatedAt"> }>
  ): Promise<void> {
    const batch = this.db.batch();
    const now = FieldValue.serverTimestamp();
    for (const item of items) {
      const ref = this.collection.doc(item.id);
      batch.set(ref, {
        ...this.serializeForWrite(item.data as Partial<T>),
        createdAt: now,
        updatedAt: now,
      });
    }
    await batch.commit();
  }

  protected withTimestamps<D extends DocumentData>(
    id: string,
    data: D
  ): T & { createdAt: string; updatedAt?: string } {
    const mapped = this.mapDoc(id, data);
    return {
      ...mapped,
      createdAt: toIsoString(data.createdAt),
      updatedAt: data.updatedAt ? toIsoString(data.updatedAt) : undefined,
    } as T & { createdAt: string; updatedAt?: string };
  }
}
