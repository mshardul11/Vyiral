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
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Keywords", href: "/keywords", icon: Search },
  { title: "Titles", href: "/titles", icon: Type },
  { title: "Tags", href: "/tags", icon: Tags },
  { title: "Descriptions", href: "/descriptions", icon: FileText },
  { title: "Content Ideas", href: "/ideas", icon: Lightbulb },
  { title: "Channel Audit", href: "/audit", icon: Shield },
  { title: "Competitors", href: "/competitors", icon: Users },
  { title: "Stats Tracker", href: "/stats", icon: LineChart },
  { title: "Projects", href: "/projects", icon: FolderKanban },
  { title: "Settings", href: "/settings", icon: Settings },
] as const;

export const quickActions = [
  { label: "Research keywords", href: "/keywords", icon: Hash },
  { label: "Generate titles", href: "/titles", icon: Sparkles },
  { label: "Run audit", href: "/audit", icon: BarChart3 },
] as const;
