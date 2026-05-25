import { ModulePlaceholder } from "@/components/app/module-placeholder";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <ModulePlaceholder
      title="Saved projects"
      description="Keywords, titles, tags, audits, and ideas organized by workspace."
      comingInPhase="Phase 6: saved items + history UI"
    />
  );
}
