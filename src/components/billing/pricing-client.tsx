"use client";

import { useState } from "react";
import { Check, Zap, Building2, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "annual";

interface PlanFeature {
  text: string;
  available: boolean;
  highlight?: boolean;
}

interface Plan {
  id: string;
  name: string;
  icon: React.ElementType;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  cta: string;
  popular?: boolean;
  features: PlanFeature[];
  limits: {
    aiGenerations: string;
    channels: string;
    competitors: string;
    workspaceMembers: string;
    exports: string;
  };
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    icon: Zap,
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Get started with the core creator tools.",
    cta: "Current plan",
    features: [
      { text: "Keyword research", available: true },
      { text: "AI title generator", available: true },
      { text: "AI tag generator", available: true },
      { text: "AI description generator", available: true },
      { text: "5 AI generations/day", available: true },
      { text: "1 channel audit/month", available: true },
      { text: "Basic analytics", available: true },
      { text: "Content calendar", available: true },
      { text: "Competitor tracking (2 max)", available: true },
      { text: "Trend discovery", available: false },
      { text: "Video intelligence", available: false },
      { text: "Team workspace", available: false },
      { text: "Automations", available: false },
      { text: "Export data", available: false },
    ],
    limits: {
      aiGenerations: "5/day",
      channels: "1",
      competitors: "2",
      workspaceMembers: "1",
      exports: "None",
    },
  },
  {
    id: "pro",
    name: "Pro",
    icon: Sparkles,
    monthlyPrice: 29,
    annualPrice: 19,
    description: "The full creator intelligence suite for serious YouTubers.",
    cta: "Upgrade to Pro",
    popular: true,
    features: [
      { text: "Everything in Free", available: true },
      { text: "Unlimited AI generations", available: true, highlight: true },
      { text: "Advanced analytics", available: true, highlight: true },
      { text: "Video performance intelligence", available: true, highlight: true },
      { text: "Trend discovery engine", available: true },
      { text: "Unlimited channel audits", available: true },
      { text: "10 competitor tracking", available: true },
      { text: "Content calendar (full)", available: true },
      { text: "Automations (3 active)", available: true },
      { text: "AI chat assistant", available: true },
      { text: "CSV export", available: true },
      { text: "Team workspace (1 member)", available: true },
      { text: "Priority support", available: true },
      { text: "Agency features", available: false },
    ],
    limits: {
      aiGenerations: "Unlimited",
      channels: "3",
      competitors: "10",
      workspaceMembers: "2",
      exports: "CSV",
    },
  },
  {
    id: "business",
    name: "Business",
    icon: Building2,
    monthlyPrice: 79,
    annualPrice: 59,
    description: "For power creators and growing media businesses.",
    cta: "Upgrade to Business",
    features: [
      { text: "Everything in Pro", available: true },
      { text: "5 channels", available: true, highlight: true },
      { text: "Unlimited competitor tracking", available: true, highlight: true },
      { text: "Unlimited automations", available: true, highlight: true },
      { text: "Team workspace (5 members)", available: true },
      { text: "Role-based permissions", available: true },
      { text: "Advanced export (PDF, XLSX)", available: true },
      { text: "White-label reports", available: true },
      { text: "API access (beta)", available: true },
      { text: "Custom integrations", available: true },
      { text: "Dedicated Slack support", available: true },
      { text: "Agency client management", available: false },
    ],
    limits: {
      aiGenerations: "Unlimited",
      channels: "5",
      competitors: "Unlimited",
      workspaceMembers: "5",
      exports: "PDF, XLSX, CSV",
    },
  },
  {
    id: "agency",
    name: "Agency",
    icon: Users,
    monthlyPrice: 199,
    annualPrice: 149,
    description: "Scale your agency with multi-client creator management.",
    cta: "Contact sales",
    features: [
      { text: "Everything in Business", available: true },
      { text: "Unlimited channels", available: true, highlight: true },
      { text: "Unlimited team members", available: true, highlight: true },
      { text: "Client workspace management", available: true, highlight: true },
      { text: "White-label dashboard", available: true },
      { text: "Client reporting (automated)", available: true },
      { text: "Custom AI training", available: true },
      { text: "Priority API access", available: true },
      { text: "SSO / SAML", available: true },
      { text: "SLA guarantee", available: true },
      { text: "Dedicated account manager", available: true },
      { text: "Custom integrations", available: true },
    ],
    limits: {
      aiGenerations: "Unlimited",
      channels: "Unlimited",
      competitors: "Unlimited",
      workspaceMembers: "Unlimited",
      exports: "All formats",
    },
  },
];

export function PricingClient() {
  const [cycle, setCycle] = useState<BillingCycle>("annual");

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <Badge className="mb-3 bg-primary/15 text-primary">Pricing</Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Grow your channel with AI
        </h1>
        <p className="mt-2 text-muted-foreground">
          Start free, upgrade as you scale. Cancel anytime.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center">
        <div className="flex items-center gap-3 rounded-full border border-border/60 bg-card/50 p-1">
          <button
            onClick={() => setCycle("monthly")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
              cycle === "monthly"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setCycle("annual")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
              cycle === "annual"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Annual
            <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5">-35%</Badge>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const price = cycle === "annual" ? plan.annualPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border p-5 transition-all",
                plan.popular
                  ? "border-primary/50 bg-gradient-to-b from-primary/5 to-background shadow-lg shadow-primary/10"
                  : "border-border/60 bg-card/50"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white shadow-sm">Most popular</Badge>
                </div>
              )}

              <div className="mb-4 flex items-center gap-2">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", plan.popular ? "bg-primary/15" : "bg-muted/30")}>
                  <Icon className={cn("h-4 w-4", plan.popular ? "text-primary" : "text-muted-foreground")} />
                </div>
                <h3 className="font-bold text-foreground">{plan.name}</h3>
              </div>

              <div className="mb-1">
                {price === 0 ? (
                  <span className="text-3xl font-bold text-foreground">Free</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-foreground">${price}</span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </>
                )}
                {cycle === "annual" && price > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Billed ${price * 12}/year
                  </p>
                )}
              </div>

              <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>

              <Button
                variant={plan.popular ? "default" : "outline"}
                className="mb-5 w-full"
                disabled={plan.id === "free"}
              >
                {plan.cta}
              </Button>

              <div className="flex-1 space-y-2">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check
                      className={cn(
                        "mt-0.5 h-3.5 w-3.5 shrink-0",
                        f.available ? "text-emerald-400" : "text-muted-foreground/30"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs",
                        !f.available && "text-muted-foreground/40 line-through",
                        f.highlight && f.available && "font-semibold text-foreground",
                        !f.highlight && f.available && "text-muted-foreground"
                      )}
                    >
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6">
        <h3 className="mb-4 font-semibold text-foreground">Frequently asked questions</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes. Cancel with one click — no questions asked. You keep access until your billing period ends.",
            },
            {
              q: "Do you offer refunds?",
              a: "We offer a 7-day money-back guarantee on all paid plans.",
            },
            {
              q: "What counts as an AI generation?",
              a: "Each title batch, tag set, description, or content idea list counts as one generation.",
            },
            {
              q: "Can I switch plans?",
              a: "Yes, upgrade or downgrade at any time. Prorated credits are applied automatically.",
            },
          ].map((faq) => (
            <div key={faq.q} className="space-y-1">
              <p className="text-sm font-medium text-foreground">{faq.q}</p>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
