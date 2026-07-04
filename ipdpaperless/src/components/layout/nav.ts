import {
  LayoutDashboard,
  LayoutGrid,
  Radar,
  ListChecks,
  MessagesSquare,
  ClipboardList,
  FileText,
  BarChart3,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Optional badge count shown on the right of the item. */
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ward", label: "Ward Census", icon: LayoutGrid },
  { href: "/round", label: "Round Mode", icon: Radar },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/consults", label: "Consults", icon: MessagesSquare },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/alerts", label: "Alerts", icon: Bell, badge: 12 },
  { href: "/admin", label: "Admin", icon: Settings },
];
