/**
 * Centralized Firestore access — delegates to server repositories.
 * Use only from server actions / API routes.
 */
export {
  projectsRepository,
  keywordsRepository,
  activityLogRepository,
  usersRepository,
  auditsRepository,
  competitorsRepository,
  channelStatsRepository,
  generatedTitlesRepository,
  generatedTagsRepository,
  generatedDescriptionsRepository,
  contentIdeasRepository,
  savedItemsRepository,
} from "@/server/repositories";
