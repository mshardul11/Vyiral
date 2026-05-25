"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingSchema,
  type OnboardingFormValues,
  uploadCadenceSchema,
} from "@/lib/validations/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import type { z } from "zod";

const CADENCE_LABELS: Record<z.infer<typeof uploadCadenceSchema>, string> = {
  daily: "Every day",
  weekly: "Once a week",
  biweekly: "Every 2 weeks",
  monthly: "Once a month",
  irregular: "Whenever I can",
};

const STEPS = ["Your channel", "How often you post"] as const;

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const { refreshUserDoc } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      niche: "",
      uploadCadence: "weekly",
    },
    mode: "onChange",
  });

  const progress = ((step + 1) / STEPS.length) * 100;

  async function onSubmit(values: OnboardingFormValues) {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        targetAudience: values.targetAudience?.trim() || "YouTube viewers",
        goals: values.goals?.length ? values.goals : (["views"] as const),
      };
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save onboarding");
      const doc = await refreshUserDoc();
      toast({ title: "You're ready!", description: "Pick a tool on your home screen." });
      router.replace(doc?.onboardingCompleted ? "/dashboard" : "/onboarding");
    } catch {
      toast({
        title: "Could not save",
        description: "Try again or check your connection.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function nextStep() {
    form.trigger(step === 0 ? ["niche"] : ["uploadCadence"]).then((ok) => {
      if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
    });
  }

  return (
    <Card className="mx-auto max-w-lg border-white/10 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Quick setup</CardTitle>
        <CardDescription>
          Two questions — then you can start using the tools.
        </CardDescription>
        <Progress value={progress} className="mt-3" />
        <p className="text-xs text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 0 && (
            <div className="space-y-2">
              <Label htmlFor="niche">What is your channel about?</Label>
              <Input
                id="niche"
                placeholder="e.g. cooking for busy parents"
                {...form.register("niche")}
              />
              {form.formState.errors.niche && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.niche.message}
                </p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <Label>How often do you upload?</Label>
              <div className="grid gap-2">
                {uploadCadenceSchema.options.map((cadence) => (
                  <label
                    key={cadence}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm",
                      form.watch("uploadCadence") === cadence
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    )}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value={cadence}
                      {...form.register("uploadCadence")}
                    />
                    {CADENCE_LABELS[cadence]}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Continue
              </Button>
            ) : (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : "Start using Vyiral"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
