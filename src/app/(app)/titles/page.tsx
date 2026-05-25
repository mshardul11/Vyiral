import { Suspense } from "react";
import { TitleGeneratorClient } from "@/components/titles/title-generator-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Titles" };

export default function TitlesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <TitleGeneratorClient />
    </Suspense>
  );
}
