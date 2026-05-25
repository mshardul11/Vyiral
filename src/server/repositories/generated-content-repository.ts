import type { DocumentData } from "firebase-admin/firestore";
import { BaseRepository } from "@/server/repositories/base-repository";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type {
  GeneratedTitleDoc,
  GeneratedTagDoc,
  GeneratedDescriptionDoc,
  ContentIdeaDoc,
} from "@/types/entities";

class GeneratedTitlesRepo extends BaseRepository<GeneratedTitleDoc> {
  constructor() {
    super(COLLECTIONS.generatedTitles);
  }
  mapDoc(id: string, data: DocumentData): GeneratedTitleDoc {
    return {
      id,
      workspaceId: data.workspaceId as string,
      projectId: data.projectId as string | undefined,
      topic: data.topic as string,
      titles: (data.titles as string[]) ?? [],
      variants: data.variants as GeneratedTitleDoc["variants"],
      selectedIndex: data.selectedIndex as number | undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

class GeneratedTagsRepo extends BaseRepository<GeneratedTagDoc> {
  constructor() {
    super(COLLECTIONS.generatedTags);
  }
  mapDoc(id: string, data: DocumentData): GeneratedTagDoc {
    return {
      id,
      workspaceId: data.workspaceId as string,
      projectId: data.projectId as string | undefined,
      videoTopic: data.videoTopic as string,
      tags: (data.tags as string[]) ?? [],
      tagItems: data.tagItems as GeneratedTagDoc["tagItems"],
      sourceType: data.sourceType as string | undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

class GeneratedDescriptionsRepo extends BaseRepository<GeneratedDescriptionDoc> {
  constructor() {
    super(COLLECTIONS.generatedDescriptions);
  }
  mapDoc(id: string, data: DocumentData): GeneratedDescriptionDoc {
    return {
      id,
      workspaceId: data.workspaceId as string,
      projectId: data.projectId as string | undefined,
      topic: data.topic as string,
      description: data.description as string,
      hooks: (data.hooks as string[]) ?? [],
      variants: data.variants as GeneratedDescriptionDoc["variants"],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

class ContentIdeasRepo extends BaseRepository<ContentIdeaDoc> {
  constructor() {
    super(COLLECTIONS.contentIdeas);
  }
  mapDoc(id: string, data: DocumentData): ContentIdeaDoc {
    return {
      id,
      workspaceId: data.workspaceId as string,
      projectId: data.projectId as string | undefined,
      title: data.title as string,
      angle: data.angle as string,
      hook: data.hook as string,
      format: data.format as string,
      estimatedDifficulty: data.estimatedDifficulty as ContentIdeaDoc["estimatedDifficulty"],
      ideaType: data.ideaType as ContentIdeaDoc["ideaType"],
      thumbnailConcept: data.thumbnailConcept as string | undefined,
      audienceType: data.audienceType as string | undefined,
      viralProbability: data.viralProbability as number | undefined,
      estimatedCompetition: data.estimatedCompetition as number | undefined,
      recommendedPublishTime: data.recommendedPublishTime as string | undefined,
      status: data.status as ContentIdeaDoc["status"],
      favorite: data.favorite as boolean | undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

export const generatedTitlesRepository = new GeneratedTitlesRepo();
export const generatedTagsRepository = new GeneratedTagsRepo();
export const generatedDescriptionsRepository = new GeneratedDescriptionsRepo();
export const contentIdeasRepository = new ContentIdeasRepo();
