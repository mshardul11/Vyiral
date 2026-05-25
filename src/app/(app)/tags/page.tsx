import { TagGeneratorClient } from "@/components/tags/tag-generator-client";

export const metadata = { title: "Tags" };

export default async function TagsPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  return <TagGeneratorClient initialTopic={topic} />;
}
