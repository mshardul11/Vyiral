import { ModulePlaceholder } from "@/components/app/module-placeholder";

export const metadata = { title: "Titles" };

export default function TitlesPage() {
  return (
    <ModulePlaceholder
      title="AI title generator"
      description="Generate 10–30 titles with clickability scores, tone labels, and a highlighted best pick."
      comingInPhase="Phase 4: /api/ai/title-generator"
    />
  );
}
