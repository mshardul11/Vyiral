import { TitleGeneratorClient } from "@/components/titles/title-generator-client";

export const metadata = { title: "AI Titles" };

export default async function TitlesPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string }>;
}) {
  const { keyword } = await searchParams;
  return <TitleGeneratorClient initialKeyword={keyword} />;
}
