import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata = {
  title: "Onboarding",
};

export default function OnboardingPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center py-8">
      <OnboardingWizard />
    </div>
  );
}
