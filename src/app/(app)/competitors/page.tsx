import { ModulePlaceholder } from "@/components/app/module-placeholder";

export const metadata = { title: "Competitors" };

export default function CompetitorsPage() {
  return (
    <ModulePlaceholder
      title="Competitor analysis"
      description="Compare channels across 30/60/90-day windows with trend charts."
      comingInPhase="Phase 5: /api/youtube/competitors"
    />
  );
}
