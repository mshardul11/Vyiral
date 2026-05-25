"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { user, userDoc, signOut } = useAuth();

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Account, channel connection, and billing-ready workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Signed in with Google</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Workspace ID</Label>
            <Input value={userDoc?.workspaceId ?? ""} readOnly className="font-mono text-xs" />
          </div>
          <p className="text-xs text-muted-foreground">
            Role: {userDoc?.role ?? "owner"} — team workspaces coming soon.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>YouTube channel</CardTitle>
          <CardDescription>
            OAuth connect — required for private analytics and automated audits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled variant="secondary">
            Connect channel (Phase 5)
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Uses /api/youtube/channel-connect — not yet implemented in this phase.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Stripe-ready via subscriptions collection</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Current plan: Free</p>
        </CardContent>
      </Card>

      <Separator />
      <Button variant="outline" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}
