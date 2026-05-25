"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { consumeAuthReturnPath } from "@/lib/auth/google-auth";
import Link from "next/link";
import { VyiralLogo } from "@/components/layout/vyiral-logo";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { EmailAuthForm } from "@/components/auth/email-auth-form";
import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthConfigAlert } from "@/components/auth/auth-config-alert";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function sanitizeNext(next: string): string {
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  return "/dashboard";
}

export default function LoginPage() {
  const { user, userDoc, loading, signOut, establishSession, authError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [returnPathFromStorage] = useState(() =>
    sanitizeNext(consumeAuthReturnPath())
  );
  const fromUrl = searchParams.get("next");
  const next = fromUrl ? sanitizeNext(fromUrl) : returnPathFromStorage;
  const [redirecting, setRedirecting] = useState(false);

  const navigateAfterAuth = useCallback(async () => {
    setRedirecting(true);
    const result = await establishSession();
    if (result.ok) {
      router.replace(result.destination === "/dashboard" ? next : result.destination);
      return;
    }
    setRedirecting(false);
  }, [establishSession, router, next]);

  useEffect(() => {
    if (loading || !user) return;
    if (authError === "session_sync_failed" || authError === "profile_load_failed") {
      return;
    }

    if (userDoc?.onboardingCompleted) {
      setRedirecting(true);
      router.replace(next);
      return;
    }
    if (userDoc) {
      setRedirecting(true);
      router.replace("/onboarding");
      return;
    }

    void navigateAfterAuth();
  }, [
    user,
    userDoc,
    loading,
    authError,
    router,
    next,
    navigateAfterAuth,
  ]);

  const showSignedInHint =
    user &&
    !loading &&
    !redirecting &&
    (authError === "session_sync_failed" || authError === "profile_load_failed" || !userDoc);

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
          <AuthConfigAlert />
          {redirecting && (
            <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Taking you to your workspace…
            </div>
          )}
          {showSignedInHint && (
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-center text-sm">
              <p className="text-muted-foreground">
                {authError
                  ? "Sign-in needs one more step before you can enter the app."
                  : "Finishing sign-in…"}
              </p>
              <div className="mt-2 flex justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={redirecting}
                  onClick={() => navigateAfterAuth()}
                >
                  Go to app
                </Button>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  Sign out
                </Button>
              </div>
            </div>
          )}
          {!redirecting && (
            <>
              <EmailAuthForm />
              <AuthDivider />
              <GoogleSignInButton returnPath={next} />
            </>
          )}
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
