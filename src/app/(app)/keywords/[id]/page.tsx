import { KeywordDetailClient } from "@/components/keyword/keyword-detail-client";

export const metadata = { title: "Keyword detail" };

export default async function KeywordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <KeywordDetailClient id={id} />;
}
