import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

/**
 * Nightly channel stats snapshots — mirrors /api/sync/scheduler
 * TODO: Wire YouTube Data API + write channelStatsSnapshots
 */
export const syncChannelStats = onSchedule("every 24 hours", async () => {
  const db = getFirestore();
  console.log("[Vyiral] syncChannelStats tick", db.app.name);
  // Phase 5: enumerate connected channels and snapshot public stats
});
