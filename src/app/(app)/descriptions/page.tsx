import { DescriptionGeneratorClient } from "@/components/descriptions/description-generator-client";

export const metadata = { title: "Descriptions" };

export default async function DescriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  return <DescriptionGeneratorClient initialTopic={topic} />;
}
