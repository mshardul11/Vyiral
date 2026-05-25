import { ModulePlaceholder } from "@/components/app/module-placeholder";

export const metadata = { title: "Stats Tracker" };

export default function StatsPage() {
  return (
    <ModulePlaceholder
      title="YouTube stats tracker"
      description="Public channel and video metrics with sparklines — no fake data when unavailable."
      comingInPhase="Phase 5: /api/youtube/channel-stats + snapshots"
    />
  );
}
