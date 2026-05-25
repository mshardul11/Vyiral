import { ContentIdeasClient } from "@/components/ideas/content-ideas-client";

export const metadata = { title: "Content Ideas" };

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  return <ContentIdeasClient initialTopic={topic} />;
}
