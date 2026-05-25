import { ModulePlaceholder } from "@/components/app/module-placeholder";

export const metadata = { title: "Channel Audit" };

export default function AuditPage() {
  return (
    <ModulePlaceholder
      title="Channel audit"
      description="Rule-based scoring plus AI summaries for titles, tags, consistency, and engagement."
      comingInPhase="Phase 5: /api/ai/channel-audit + YouTube Data API"
    />
  );
}
