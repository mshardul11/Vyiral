import { ModulePlaceholder } from "@/components/app/module-placeholder";

export default async function KeywordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ModulePlaceholder
      title={`Keyword: ${id}`}
      description="Detail view with generate titles, tags, and descriptions actions."
      comingInPhase="Phase 4: keyword detail + AI actions"
    />
  );
}
