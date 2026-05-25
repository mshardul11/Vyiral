import { Suspense } from "react";
import { getDashboardData } from "@/server/actions/dashboard";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { AlertCircle } from "lucide-react";

async function DashboardContent() {
  const result = await getDashboardData();

  if (!result.success || !result.data) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Unable to load dashboard"
        description={result.error ?? "Please try again or sign in again."}
        action={{ label: "Go to login", href: "/login" }}
      />
    );
  }

  return <DashboardView data={result.data} />;
}

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
