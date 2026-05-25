import Link from "next/link";
import { getKeywordById } from "@/server/actions/keywords";
import { KeywordDetailClient } from "@/components/keyword/keyword-detail-client";
import { Button } from "@/components/ui/button";

export default async function KeywordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getKeywordById(id);

  if (!result.success || !result.data) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">{result.error ?? "Keyword not found"}</p>
        <Button className="mt-4" variant="secondary" asChild>
          <Link href="/keywords">Back to research</Link>
        </Button>
      </div>
    );
  }

  const { detail, ...keyword } = result.data;
  return <KeywordDetailClient keyword={keyword} detail={detail} />;
}
