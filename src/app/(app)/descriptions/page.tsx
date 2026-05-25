import { Suspense } from "react";
import { DescriptionGeneratorClient } from "@/components/descriptions/description-generator-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Descriptions" };

export default function DescriptionsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <DescriptionGeneratorClient />
    </Suspense>
  );
}
