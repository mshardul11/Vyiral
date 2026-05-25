import { Suspense } from "react";
import { TagGeneratorClient } from "@/components/tags/tag-generator-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Tags" };

export default function TagsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <TagGeneratorClient />
    </Suspense>
  );
}
