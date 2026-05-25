import { z } from "zod";

export const creatorGoalSchema = z.enum(["views", "subs", "ctr", "watch_time"]);

export const uploadCadenceSchema = z.enum([
  "daily",
  "weekly",
  "biweekly",
  "monthly",
  "irregular",
]);

export const onboardingSchema = z.object({
  niche: z.string().min(2, "Tell us your niche").max(120),
  targetAudience: z.string().min(2, "Describe your audience").max(200),
  goals: z
    .array(creatorGoalSchema)
    .min(1, "Select at least one goal")
    .max(4),
  uploadCadence: uploadCadenceSchema,
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
