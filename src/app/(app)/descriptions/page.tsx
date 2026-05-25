import { ModulePlaceholder } from "@/components/app/module-placeholder";

export const metadata = { title: "Descriptions" };

export default function DescriptionsPage() {
  return (
    <ModulePlaceholder
      title="AI description generator"
      description="SEO descriptions with hook, summary, keyword block, and chapters/CTA."
      comingInPhase="Phase 4: /api/ai/description-generator"
    />
  );
}
