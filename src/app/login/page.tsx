"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { VyiralLogo } from "@/components/layout/vyiral-logo";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const { user, userDoc, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  useEffect(() => {
    if (loading || !user) return;
    if (userDoc?.onboardingCompleted) {
      router.replace(next.startsWith("/") ? next : "/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [user, userDoc, loading, router, next]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-8">
        <VyiralLogo />
      </div>
      <Card className="w-full max-w-md border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to access your creator workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleSignInButton />
          <p className="text-center text-xs text-muted-foreground">
            By continuing you agree to our terms. We only request scopes needed
            for YouTube features you enable.
          </p>
        </CardContent>
      </Card>
      <Link
        href="/"
        className="mt-6 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to home
      </Link>
    </div>
  );
}
