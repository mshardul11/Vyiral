"use client";

import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Youtube, Bell, Key, CreditCard, Palette } from "lucide-react";

export function SettingsForm() {
  const { user, userDoc } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, channel, notifications, and workspace preferences.
        </p>
      </div>

      <Card className="rounded-2xl border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Display name</Label>
              <Input defaultValue={user?.displayName ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user?.email ?? ""} readOnly />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Workspace ID</Label>
            <Input defaultValue={userDoc?.workspaceId ?? ""} readOnly className="font-mono text-xs" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Youtube className="h-5 w-5 text-primary" />
            Channel connection
          </CardTitle>
          <CardDescription>
            Connect via OAuth to unlock live stats, audits, and competitor tracking.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Not connected</p>
            <p className="text-sm text-muted-foreground">
              Placeholder — OAuth flow ships in Phase 3
            </p>
          </div>
          <Button variant="gradient" disabled>
            Connect YouTube
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Email digests and competitor alerts — configure in a future release.</p>
          <div className="flex gap-2">
            <Badge>Keyword alerts</Badge>
            <Badge variant="muted">Coming soon</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5" />
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          {(["dark", "light", "system"] as const).map((t) => (
            <Button
              key={t}
              variant={theme === t ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme(t)}
              className="capitalize"
            >
              {t}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60 bg-card/50 opacity-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Key className="h-5 w-5" />
            API access
          </CardTitle>
          <CardDescription>Extension and API keys — placeholder</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" disabled>
            Generate API key
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60 bg-card/50 opacity-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
          <CardDescription>Free plan · Stripe billing in a future phase</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">Free</Badge>
          <Separator className="my-4" />
          <Button variant="outline" disabled>
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
