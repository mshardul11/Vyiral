import { ModulePlaceholder } from "@/components/app/module-placeholder";

export const metadata = { title: "Keywords" };

export default function KeywordsPage() {
  return (
    <ModulePlaceholder
      title="Keyword research"
      description="Search topics to discover volume, competition, opportunity, and intent — with clear estimated labels."
      comingInPhase="Phase 4: /api/ai/keyword-research with OpenAI + save to projects."
    />
  );
}
