"use client";



import { useEffect, useRef, useState } from "react";

import { useSearchParams } from "next/navigation";

import { consumeAuthReturnPath } from "@/lib/auth/google-auth";

import { getPostLoginPath } from "@/lib/auth/post-login";

import Link from "next/link";

import { VyiralLogo } from "@/components/layout/vyiral-logo";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

import { LanguageSwitcher } from "@/components/shared/language-switcher";

import { useAuth } from "@/contexts/auth-context";

import { useT } from "@/contexts/locale-context";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Loader2 } from "lucide-react";



function sanitizeNext(next: string): string {

  if (next.startsWith("/") && !next.startsWith("//")) return next;

  return "/dashboard";

}



export default function LoginPage() {

  const t = useT();

  const { user, userDoc, loading, sessionReady } = useAuth();

  const searchParams = useSearchParams();

  const fromUrl = searchParams.get("next");

  const next = fromUrl ? sanitizeNext(fromUrl) : sanitizeNext(consumeAuthReturnPath());

  const [redirecting, setRedirecting] = useState(false);

  const didRedirect = useRef(false);



  useEffect(() => {

    if (loading || !user || !sessionReady || userDoc === null) return;

    if (didRedirect.current) return;



    didRedirect.current = true;

    setRedirecting(true);

    window.location.assign(getPostLoginPath(userDoc, next));

  }, [user, userDoc, sessionReady, loading, next]);



  const showSpinner = loading || redirecting;



  return (

    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">

      <div

        className="pointer-events-none absolute inset-0 opacity-50"

        aria-hidden

        style={{

          background:

            "radial-gradient(ellipse 60% 40% at 50% 30%, hsl(262 83% 58% / 0.2), transparent)",

        }}

      />

      <div className="absolute right-4 top-4 z-10">

        <LanguageSwitcher />

      </div>

      <div className="relative mb-8">

        <VyiralLogo />

      </div>

      <Card className="relative w-full max-w-md border-white/15">

        <CardHeader className="text-center">

          <CardTitle className="text-2xl">{t("auth.welcome")}</CardTitle>

          <CardDescription>{t("auth.subtitle")}</CardDescription>

        </CardHeader>

        <CardContent className="space-y-4">

          {showSpinner ? (

            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">

              <Loader2 className="h-4 w-4 animate-spin" />

              {redirecting ? t("common.openingWorkspace") : t("common.loading")}

            </div>

          ) : (

            <>

              <GoogleSignInButton returnPath={next} />

              <p className="text-center text-xs leading-relaxed text-muted-foreground">

                {t("auth.terms")}

              </p>

            </>

          )}

        </CardContent>

      </Card>

      <Link

        href="/"

        className="relative mt-6 text-sm text-muted-foreground transition-colors hover:text-foreground"

      >

        {t("auth.backHome")}

      </Link>

    </div>

  );

}

