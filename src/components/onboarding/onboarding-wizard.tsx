"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingSchema,
  type OnboardingFormValues,
  creatorGoalSchema,
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

const GOAL_LABELS: Record<z.infer<typeof creatorGoalSchema>, string> = {
  views: "More views",
  subs: "Subscriber growth",
  ctr: "Higher CTR",
  watch_time: "Watch time",
};

const CADENCE_LABELS: Record<z.infer<typeof uploadCadenceSchema>, string> = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  monthly: "Monthly",
  irregular: "Irregular",
};

const STEPS = ["Niche", "Audience", "Goals", "Cadence"] as const;

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const { refreshUserDoc } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      niche: "",
      targetAudience: "",
      goals: [],
      uploadCadence: "weekly",
    },
    mode: "onChange",
  });

  const progress = ((step + 1) / STEPS.length) * 100;
  const goals = form.watch("goals");

  function toggleGoal(goal: z.infer<typeof creatorGoalSchema>) {
    const current = form.getValues("goals");
    if (current.includes(goal)) {
      form.setValue(
        "goals",
        current.filter((g) => g !== goal),
        { shouldValidate: true }
      );
    } else {
      form.setValue("goals", [...current, goal], { shouldValidate: true });
    }
  }

  async function onSubmit(values: OnboardingFormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save onboarding");
      await refreshUserDoc();
      toast({ title: "You're all set", description: "Welcome to Vyiral." });
      window.location.assign("/dashboard");
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
    const fields: (keyof OnboardingFormValues)[][] = [
      ["niche"],
      ["targetAudience"],
      ["goals"],
      ["uploadCadence"],
    ];
    form.trigger(fields[step]).then((ok) => {
      if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
    });
  }

  return (
    <Card className="mx-auto max-w-lg border-white/10 vyiral-glow animate-fade-in">
      <CardHeader>
        <CardTitle className="vyiral-text-gradient text-2xl">
          Set up your creator workspace
        </CardTitle>
        <CardDescription>
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 0 && (
            <div className="space-y-2">
              <Label htmlFor="niche">Channel niche</Label>
              <Input
                id="niche"
                placeholder="e.g. personal finance for millennials"
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
            <div className="space-y-2">
              <Label htmlFor="audience">Target audience</Label>
              <Input
                id="audience"
                placeholder="e.g. beginners learning investing"
                {...form.register("targetAudience")}
              />
              {form.formState.errors.targetAudience && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.targetAudience.message}
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Label>Growth goals (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2">
                {creatorGoalSchema.options.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={cn(
                      "rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                      goals.includes(goal)
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border hover:bg-white/5"
                    )}
                  >
                    {GOAL_LABELS[goal]}
                  </button>
                ))}
              </div>
              {form.formState.errors.goals && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.goals.message}
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <Label>Upload cadence</Label>
              <div className="grid gap-2">
                {uploadCadenceSchema.options.map((cadence) => (
                  <label
                    key={cadence}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3",
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
              <Button type="button" variant="gradient" onClick={nextStep}>
                Continue
              </Button>
            ) : (
              <Button type="submit" variant="gradient" disabled={submitting}>
                {submitting ? "Saving..." : "Go to dashboard"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
