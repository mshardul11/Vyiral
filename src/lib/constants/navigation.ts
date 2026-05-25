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
  { key: "dashboard", href: "/dashboard", icon: Home, section: "main" },
  { key: "keywords", href: "/keywords", icon: Search, section: "growth" },
  { key: "titles", href: "/titles", icon: Type, section: "growth" },
  { key: "tags", href: "/tags", icon: Tags, section: "growth" },
  { key: "descriptions", href: "/descriptions", icon: FileText, section: "growth" },
  { key: "ideas", href: "/ideas", icon: Lightbulb, section: "growth" },
  { key: "audit", href: "/audit", icon: Shield, section: "insights" },
  { key: "competitors", href: "/competitors", icon: Users, section: "insights" },
  { key: "stats", href: "/stats", icon: LineChart, section: "insights" },
  { key: "projects", href: "/projects", icon: FolderKanban, section: "workspace" },
  { key: "settings", href: "/settings", icon: Settings, section: "workspace" },
] as const;

export const navSections = [
  { id: "main", key: "overview" },
  { id: "growth", key: "growth" },
  { id: "insights", key: "insights" },
  { id: "workspace", key: "workspace" },
] as const;

export const quickActions = [
  { label: "Research keywords", href: "/keywords", icon: Hash },
  { label: "Generate titles", href: "/titles", icon: Sparkles },
  { label: "Run audit", href: "/audit", icon: BarChart3 },
] as const;

export const commandPaletteItems = [
  ...mainNav.map((item) => ({
    id: item.href,
    labelKey: `nav.${item.key}` as const,
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
