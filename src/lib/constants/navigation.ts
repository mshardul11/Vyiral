import {
  BarChart3,
  FileText,
  Hash,
  Home,
  Lightbulb,
  LineChart,
  Search,
  Settings,
  Shield,
  Sparkles,
  Tags,
  Type,
  Users,
  FolderKanban,
} from "lucide-react";

export const mainNav = [
  { title: "Dashboard", href: "/dashboard", icon: Home, section: "main" },
  { title: "Keywords", href: "/keywords", icon: Search, section: "growth" },
  { title: "AI Titles", href: "/titles", icon: Type, section: "growth" },
  { title: "Tags", href: "/tags", icon: Tags, section: "growth" },
  { title: "Descriptions", href: "/descriptions", icon: FileText, section: "growth" },
  { title: "Content Ideas", href: "/ideas", icon: Lightbulb, section: "growth" },
  { title: "Channel Audit", href: "/audit", icon: Shield, section: "insights" },
  { title: "Competitors", href: "/competitors", icon: Users, section: "insights" },
  { title: "Stats Tracker", href: "/stats", icon: LineChart, section: "insights" },
  { title: "Projects", href: "/projects", icon: FolderKanban, section: "workspace" },
  { title: "Settings", href: "/settings", icon: Settings, section: "workspace" },
] as const;

export const navSections = [
  { id: "main", label: "Overview" },
  { id: "growth", label: "Growth tools" },
  { id: "insights", label: "Insights" },
  { id: "workspace", label: "Workspace" },
] as const;

export const quickActions = [
  { label: "Research keywords", href: "/keywords", icon: Hash },
  { label: "Generate titles", href: "/titles", icon: Sparkles },
  { label: "Run audit", href: "/audit", icon: BarChart3 },
] as const;

export const commandPaletteItems = [
  ...mainNav.map((item) => ({
    id: item.href,
    label: item.title,
    href: item.href,
    group: "Navigation",
  })),
  ...quickActions.map((item) => ({
    id: `action-${item.href}`,
    label: item.label,
    href: item.href,
    group: "Quick actions",
  })),
] as const;
