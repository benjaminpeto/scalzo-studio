import {
  BriefcaseBusiness,
  ClipboardList,
  Images,
  Inbox,
  LayoutDashboard,
  Layers3,
  PanelTop,
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
  services: BriefcaseBusiness,
  work: Images,
};
