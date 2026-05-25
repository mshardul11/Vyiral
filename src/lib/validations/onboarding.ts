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
  niche: z.string().min(2, "Tell us what your channel is about").max(120),
  targetAudience: z.string().max(200).optional(),
  goals: z.array(creatorGoalSchema).max(4).optional(),
  uploadCadence: uploadCadenceSchema,
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
