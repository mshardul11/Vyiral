import {
  FileText,
  Home,
  Lightbulb,
  Search,
  Settings,
  Shield,
  Sparkles,
  Tags,
  Type,
  Users,
} from "lucide-react";

/** Primary sidebar — everyday tools only */
export const mainNav = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Keywords", href: "/keywords", icon: Search },
  { title: "Titles", href: "/titles", icon: Type },
  { title: "Tags", href: "/tags", icon: Tags },
  { title: "Descriptions", href: "/descriptions", icon: FileText },
  { title: "Video ideas", href: "/ideas", icon: Lightbulb },
  { title: "Settings", href: "/settings", icon: Settings },
] as const;

/** Extra tools — linked from Home, not cluttering the sidebar */
export const moreNav = [
  { title: "Channel check", href: "/audit", icon: Shield },
  { title: "Competitors", href: "/competitors", icon: Users },
] as const;

export const homeToolCards = [
  {
    title: "Find keywords",
    description: "Discover what people search for in your niche.",
    href: "/keywords",
    icon: Search,
    color: "from-violet-600/20 to-violet-600/5",
  },
  {
    title: "Write titles",
    description: "Get click-worthy title ideas for your next video.",
    href: "/titles",
    icon: Type,
    color: "from-cyan-600/20 to-cyan-600/5",
  },
  {
    title: "Generate tags",
    description: "Tags that help YouTube understand your video.",
    href: "/tags",
    icon: Tags,
    color: "from-emerald-600/20 to-emerald-600/5",
  },
  {
    title: "Write descriptions",
    description: "SEO-friendly descriptions ready to paste.",
    href: "/descriptions",
    icon: FileText,
    color: "from-amber-600/20 to-amber-600/5",
  },
  {
    title: "Get video ideas",
    description: "Brainstorm your next upload in one click.",
    href: "/ideas",
    icon: Lightbulb,
    color: "from-pink-600/20 to-pink-600/5",
  },
] as const;

export const toolPageMeta: Record<
  string,
  { title: string; description: string; placeholder?: string; actionLabel?: string }
> = {
  "/keywords": {
    title: "Keywords",
    description: "Enter a topic. Press search. Pick keywords you like.",
    placeholder: "e.g. morning routine for students",
    actionLabel: "Search",
  },
  "/titles": {
    title: "Titles",
    description: "Describe your video. Get title ideas you can copy.",
    placeholder: "e.g. 5 habits that changed my productivity",
    actionLabel: "Generate titles",
  },
  "/tags": {
    title: "Tags",
    description: "Paste your title or topic. Copy the tag list.",
    actionLabel: "Generate tags",
  },
  "/descriptions": {
    title: "Descriptions",
    description: "Tell us about your video. Get a description to paste on YouTube.",
    actionLabel: "Generate description",
  },
  "/ideas": {
    title: "Video ideas",
    description: "Share your niche. Get fresh video ideas.",
    actionLabel: "Get ideas",
  },
  "/audit": {
    title: "Channel check",
    description: "See simple tips to improve your channel.",
    actionLabel: "Run check",
  },
  "/competitors": {
    title: "Competitors",
    description: "Add channels you want to keep an eye on.",
    actionLabel: "Add competitor",
  },
};

export const quickActions = [
  { label: "Keywords", href: "/keywords", icon: Search },
  { label: "Titles", href: "/titles", icon: Sparkles },
  { label: "Tags", href: "/tags", icon: Tags },
] as const;

export const commandPaletteItems = [
  ...mainNav.map((item) => ({
    id: item.href,
    label: item.title,
    href: item.href,
    group: "Menu",
  })),
  ...moreNav.map((item) => ({
    id: item.href,
    label: item.title,
    href: item.href,
    group: "More",
  })),
] as const;
