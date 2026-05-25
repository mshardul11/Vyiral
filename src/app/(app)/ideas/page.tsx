import { ModulePlaceholder } from "@/components/app/module-placeholder";

export const metadata = { title: "Content Ideas" };

export default function IdeasPage() {
  return (
    <ModulePlaceholder
      title="Content ideas"
      description="Video ideas with angles, hooks, thumbnail concepts, and save-to-calendar."
      comingInPhase="Phase 4: /api/ai/content-ideas"
    />
  );
}
