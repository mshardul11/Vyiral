"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
export function AuthConfigAlert() {
  const { authError, isConfigured } = useAuth();

  if (isConfigured && authError !== "firebase_not_configured") {
    if (authError === "session_sync_failed") {
      return (
        <ConfigBanner
          title="Session could not be created"
          description="Check FIREBASE_ADMIN_* credentials in .env and restart the dev server."
        />
      );
    }
    if (authError === "profile_load_failed") {
      return (
        <ConfigBanner
          title="Could not load your profile"
          description="Firebase Admin may be misconfigured. Verify service account env vars."
          action={
            <button
              type="button"
              className="text-sm underline"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          }
        />
      );
    }
    return null;
  }

  return (
    <ConfigBanner
      title="Firebase authentication not configured"
      description="Add NEXT_PUBLIC_FIREBASE_* and FIREBASE_ADMIN_* to .env.local, restart npm run dev, then enable Email/Password and Google under Firebase Console → Authentication → Sign-in method."
      action={
        <Link href="https://console.firebase.google.com" className="text-sm underline" target="_blank" rel="noreferrer">
          Firebase Console
        </Link>
      }
    />
  );
}

function ConfigBanner({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
        <div>
          <p className="font-medium text-amber-100">{title}</p>
          <p className="mt-1 text-muted-foreground">{description}</p>
          {action && <div className="mt-2">{action}</div>}
        </div>
      </div>
    </div>
  );
}
