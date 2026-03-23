export interface AdminNavigationItem {
  description: string;
  href: string;
  label: string;
}

export interface AdminDashboardSection extends AdminNavigationItem {
  id: "content" | "operations" | "audit";
}

export const adminPrimaryNavigation: AdminNavigationItem[] = [
  {
    description: "Overview, session health, and next implementation slices.",
    href: "/admin",
    label: "Dashboard",
  },
];

export const adminDashboardSections: AdminDashboardSection[] = [
  {
    description: "Publishing workflow, collections, and storage-backed assets.",
    href: "/admin#content",
    id: "content",
    label: "Content stack",
  },
  {
    description: "Lead triage, contact handoff, and follow-up automation.",
    href: "/admin#operations",
    id: "operations",
    label: "Lead inbox",
  },
  {
    description: "Auth events, admin checks, and session inspection.",
    href: "/admin#audit",
    id: "audit",
    label: "Audit trail",
  },
];

export const ADMIN_DASHBOARD_BREADCRUMB = "Admin / Dashboard";
export const ADMIN_DASHBOARD_HEADING = "Operational dashboard";
