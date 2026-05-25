"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getFirebaseAuthErrorMessage } from "@/lib/auth/firebase-auth-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export function EmailAuthForm() {
  const {
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    isConfigured,
  } = useAuth();
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const [resetPending, setResetPending] = useState(false);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await signInWithEmail(signInEmail.trim(), signInPassword);
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: getFirebaseAuthErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await signUpWithEmail(
        signUpEmail.trim(),
        signUpPassword,
        signUpName.trim() || undefined
      );
      toast({
        title: "Account created",
        description: "Welcome to Vyiral.",
      });
    } catch (error) {
      toast({
        title: "Could not create account",
        description: getFirebaseAuthErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  }

  async function handleResetPassword() {
    const email = signInEmail.trim() || signUpEmail.trim();
    if (!email) {
      toast({
        title: "Enter your email",
        description: "Type your email above, then use forgot password.",
        variant: "destructive",
      });
      return;
    }
    setResetPending(true);
    try {
      await sendPasswordReset(email);
      toast({
        title: "Check your inbox",
        description: "We sent a password reset link if an account exists for that email.",
      });
    } catch (error) {
      toast({
        title: "Could not send reset email",
        description: getFirebaseAuthErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setResetPending(false);
    }
  }

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign in</TabsTrigger>
        <TabsTrigger value="signup">Create account</TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <form onSubmit={handleSignIn} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input
              id="signin-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              required
              disabled={!isConfigured || pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-password">Password</Label>
            <Input
              id="signin-password"
              type="password"
              autoComplete="current-password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              required
              disabled={!isConfigured || pending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!isConfigured || pending}>
            {pending ? "Signing in…" : "Sign in with email"}
          </Button>
          <button
            type="button"
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
            onClick={handleResetPassword}
            disabled={!isConfigured || resetPending}
          >
            {resetPending ? "Sending…" : "Forgot password?"}
          </button>
        </form>
      </TabsContent>

      <TabsContent value="signup">
        <form onSubmit={handleSignUp} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="signup-name">Name (optional)</Label>
            <Input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              disabled={!isConfigured || pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
              disabled={!isConfigured || pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
              minLength={6}
              disabled={!isConfigured || pending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!isConfigured || pending}>
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
