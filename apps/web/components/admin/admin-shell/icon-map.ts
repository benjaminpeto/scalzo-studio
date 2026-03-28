import {
  BriefcaseBusiness,
  ClipboardList,
  Images,
  Inbox,
  LayoutDashboard,
  Layers3,
  MessageSquareQuote,
  PanelTop,
  Route,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import type { AdminNavigationItem } from "@/interfaces/admin/navigation";

export const adminShellIconMap: Record<
  AdminNavigationItem["icon"],
  LucideIcon
> = {
  audit: ShieldCheck,
  content: Layers3,
  dashboard: LayoutDashboard,
  list: ClipboardList,
  operations: Inbox,
  overview: PanelTop,
  redirects: Route,
  services: BriefcaseBusiness,
  testimonials: MessageSquareQuote,
  work: Images,
};
