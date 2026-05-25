import { Suspense } from "react";
import { KeywordResearchClient } from "@/components/keyword/keyword-research-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Keywords" };

export default function KeywordsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <KeywordResearchClient />
    </Suspense>
  );
}
