"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Minimize2, Maximize2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "How can I improve my CTR?",
  "Analyze my channel performance",
  "Give me 5 video ideas for my niche",
  "What's the best time to post?",
  "How do I improve audience retention?",
];

const AI_RESPONSES: Record<string, string> = {
  default: `I'm Vyiral AI, your creator growth strategist. I can help you with:

• **Channel analytics** — interpret your performance data
• **SEO strategy** — keywords, titles, descriptions
• **Content ideas** — fresh angles for your niche
• **Audience growth** — actionable tactics to grow faster
• **Trend analysis** — what's working in your space right now

What would you like to work on today?`,
  ctr: `To improve your CTR, here are the highest-impact actions:

**Thumbnail Optimization**
• Use a human face showing strong emotion (curiosity, shock, excitement)
• Add bold, high-contrast text (3-4 words max)
• Create a clear "knowledge gap" — make viewers need to know more

**Title Optimization**
• Lead with the benefit or outcome
• Use numbers when possible (specific > vague)
• Create curiosity without being clickbait

**Testing Strategy**
• A/B test thumbnails every 2 weeks
• Change one variable at a time

Your current CTR of 5.8% is above the YouTube average (3-5%), but top creators in your niche hit 8-12%. The biggest lever is typically the thumbnail.`,
  analytics: `Here's what your channel data shows this month:

**Wins 🎯**
• Views are up +5.2% — strong growth trajectory
• Your CTR at 5.8% is above platform average
• Watch time growing faster than views (good sign)

**Areas to improve ⚡**
• First 30-second drop rate is 28% — hook needs strengthening
• 3 videos underperforming — we should analyze what's different
• End screen click-through is below 3% — add stronger CTAs

**Recommended action:** Run your top 3 underperforming videos through the Video Intelligence tool to get specific AI recommendations for each.`,
  ideas: `Here are 5 high-opportunity video ideas for your niche:

1. **"I Tried Every YouTube SEO Tool for 30 Days — Here's What Works"**
   → High search volume, personal story format, clear outcome

2. **"The Thumbnail That Got 500K Views (Breakdown)"**
   → Strong curiosity angle, specific, visual

3. **"YouTube Algorithm in 2025: What Actually Changed"**
   → Trending topic, search demand is high

4. **"0 to 1K Subscribers: The Exact Strategy I'd Use Today"**
   → Evergreen, high intent, beginner audience

5. **"Why Your Videos Get Views But No Subscribers (Fix This)"**
   → Problem-solution format, addresses a real pain point

Want me to generate titles and hooks for any of these?`,
  time: `Based on channel analytics patterns for your niche, here's the optimal posting schedule:

**Best posting times:**
• **Thursday 6–9pm** (your audience's highest engagement window)
• **Saturday 10am–1pm** (second best)
• **Sunday 8–10pm** (strong for Shorts)

**Why it matters:**
The first 24 hours of a video are critical — YouTube measures engagement velocity. Posting when your audience is most active boosts early signals that trigger distribution.

**Quick win:** If you've been posting on weekends in the morning, try shifting your next 3 uploads to Thursday evenings and compare performance.`,
  retention: `Improving audience retention requires fixing specific drop points:

**The 3 critical zones:**

1. **0–30 seconds** (hook) — Your biggest opportunity
   • Open with a bold statement or question
   • Show the "reward" within first 15 seconds
   • Cut all "subscribe/like" asks from the intro

2. **Mid-video** (engagement)
   • Add a pattern interrupt every 60-90 seconds
   • Use jump cuts, B-roll, text overlays
   • Preview upcoming value ("in 2 minutes I'll show you...")

3. **End screen**
   • Add chapters so viewers can navigate
   • Tease next video 30 seconds before the end

The biggest retention killer is a slow intro. Your drop at 0:24 shows viewers aren't getting value fast enough. Lead with the "wow moment."`,
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("ctr") || lower.includes("click")) return AI_RESPONSES.ctr!;
  if (lower.includes("analytic") || lower.includes("performance") || lower.includes("channel")) return AI_RESPONSES.analytics!;
  if (lower.includes("idea") || lower.includes("video idea") || lower.includes("topic")) return AI_RESPONSES.ideas!;
  if (lower.includes("time") || lower.includes("post") || lower.includes("schedule")) return AI_RESPONSES.time!;
  if (lower.includes("retention") || lower.includes("watch") || lower.includes("drop")) return AI_RESPONSES.retention!;
  return AI_RESPONSES.default!;
}

export function AiChatAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: AI_RESPONSES.default!,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimized]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(text),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function formatContent(content: string) {
    return content
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-semibold text-foreground mt-2 first:mt-0">
              {line.slice(2, -2)}
            </p>
          );
        }
        if (line.startsWith("• ")) {
          return (
            <p key={i} className="text-sm text-muted-foreground pl-3 before:content-['•'] before:mr-2 before:text-muted-foreground/60">
              {line.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}
            </p>
          );
        }
        if (/^\d+\./.test(line)) {
          const match = line.match(/^(\d+\.\s+)\*\*(.*?)\*\*(.*)$/);
          if (match) {
            return (
              <p key={i} className="text-sm mt-1.5">
                <span className="text-muted-foreground">{match[1]}</span>
                <span className="font-semibold text-foreground">{match[2]}</span>
                <span className="text-muted-foreground">{match[3]}</span>
              </p>
            );
          }
        }
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return (
          <p key={i} className="text-sm text-muted-foreground">
            {line.replace(/\*\*(.*?)\*\*/g, "$1")}
          </p>
        );
      });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 shadow-lg transition-all hover:scale-105 hover:shadow-violet-500/25"
        aria-label="Open AI assistant"
      >
        <Bot className="h-5 w-5 text-white" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl border border-border/60 bg-background shadow-2xl shadow-black/40 transition-all duration-200",
        minimized ? "h-12 w-72" : "h-[520px] w-80 md:w-96"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 rounded-t-2xl border-b border-border/60 bg-gradient-to-r from-violet-600/10 to-cyan-600/5 px-4 py-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-600">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Vyiral AI</p>
          {!minimized && <p className="text-[10px] text-muted-foreground">Creator growth strategist</p>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setMinimized((m) => !m)}
        >
          {minimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setOpen(false)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-3">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                >
                  {msg.role === "assistant" && (
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-600">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2.5",
                      msg.role === "user"
                        ? "rounded-tr-sm bg-primary text-white"
                        : "rounded-tl-sm border border-border/60 bg-card/80"
                    )}
                  >
                    {msg.role === "user" ? (
                      <p className="text-sm text-white">{msg.content}</p>
                    ) : (
                      <div className="space-y-0.5">{formatContent(msg.content)}</div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-600">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border/60 bg-card/80 px-3 py-2.5">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.slice(0, 3).map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="rounded-full border border-border/60 bg-card/50 px-2.5 py-1 text-[11px] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex items-end gap-2 border-t border-border/60 p-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your channel..."
              className="min-h-[36px] max-h-24 resize-none text-sm"
              rows={1}
            />
            <Button
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
