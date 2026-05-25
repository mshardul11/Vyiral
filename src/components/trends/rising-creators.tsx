"use client";

import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RISING_CREATORS = [
  { name: "TechWithTim", niche: "Tech / Dev Tutorials", subscribers: "48K", growth: "+12K this month", momentum: 94, avatar: "T" },
  { name: "MoneyMindsetPro", niche: "Personal Finance", subscribers: "31K", growth: "+8.4K this month", momentum: 88, avatar: "M" },
  { name: "ShortFormQueen", niche: "YouTube Strategy", subscribers: "22K", growth: "+6.1K this month", momentum: 83, avatar: "S" },
  { name: "AICreatorHub", niche: "AI Tools & Workflows", subscribers: "19K", growth: "+5.2K this month", momentum: 79, avatar: "A" },
  { name: "BudgetTravels", niche: "Budget Travel", subscribers: "14K", growth: "+3.8K this month", momentum: 71, avatar: "B" },
  { name: "FitnessIn5", niche: "Fitness / Health", subscribers: "12K", growth: "+3.2K this month", momentum: 68, avatar: "F" },
];

export function RisingCreators() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-violet-400" />
          <h3 className="font-semibold text-foreground">Rising Creators in Your Niche</h3>
          <Badge className="bg-violet-500/15 text-violet-400 text-[10px]">AI-detected</Badge>
        </div>
        <div className="space-y-2">
          {RISING_CREATORS.map((c, idx) => (
            <div
              key={c.name}
              className="flex items-center gap-3 rounded-lg border border-transparent p-2.5 transition-all hover:border-border/40 hover:bg-white/[0.02]"
            >
              <span className="text-xs font-semibold text-muted-foreground/60 w-5">#{idx + 1}</span>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/40 to-cyan-600/40 text-sm font-bold text-white">
                {c.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.niche}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-foreground">{c.subscribers}</p>
                <p className="text-xs text-emerald-400">{c.growth}</p>
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-1 rounded-lg bg-violet-500/10 px-2.5 py-1.5">
                  <ArrowUpRight className="h-3 w-3 text-violet-400" />
                  <span className="text-xs font-bold text-violet-300">{c.momentum}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
