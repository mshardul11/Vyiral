"use client";

import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Palette, Youtube } from "lucide-react";

export function SettingsForm() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-lg space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Your account and how Vyiral looks.</p>
      </div>

      <Card className="rounded-xl border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Your account</CardTitle>
          <CardDescription>Your sign-in email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input defaultValue={user?.displayName ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={user?.email ?? ""} readOnly />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
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

      <Card className="rounded-xl border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Youtube className="h-5 w-5 text-primary" />
            YouTube channel
          </CardTitle>
          <CardDescription>
            Optional — connect later to see real channel numbers on your home screen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" disabled>
            Connect YouTube (coming soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
