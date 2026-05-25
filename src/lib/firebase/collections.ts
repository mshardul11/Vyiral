/** Firestore collection paths — single source of truth for client and server */
export const COLLECTIONS = {
  users: "users",
  userProfiles: "userProfiles",
  projects: "projects",
  keywords: "keywords",
  generatedTitles: "generatedTitles",
  generatedTags: "generatedTags",
  generatedDescriptions: "generatedDescriptions",
  contentIdeas: "contentIdeas",
  audits: "audits",
  competitors: "competitors",
  channelStatsSnapshots: "channelStatsSnapshots",
  savedItems: "savedItems",
  activityLog: "activityLog",
  subscriptions: "subscriptions",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
