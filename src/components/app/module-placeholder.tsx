import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ModulePlaceholder({
  title,
  description,
  comingInPhase,
}: {
  title: string;
  description: string;
  comingInPhase?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {comingInPhase && (
            <p className="text-sm text-muted-foreground rounded-lg border border-dashed p-4">
              {comingInPhase}
            </p>
          )}
          <Button asChild variant="secondary">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
