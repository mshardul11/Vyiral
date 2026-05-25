import { ModulePlaceholder } from "@/components/app/module-placeholder";

export const metadata = { title: "Tags" };

export default function TagsPage() {
  return (
    <ModulePlaceholder
      title="AI tag generator"
      description="Relevant tags with usefulness scores from topic, title, or video URL."
      comingInPhase="Phase 4: /api/ai/tag-generator"
    />
  );
}
