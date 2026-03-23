export interface AdminNavigationItem {
  description: string;
  href: string;
  label: string;
  matchStrategy?: "exact" | "prefix";
}

export interface AdminDashboardSection extends AdminNavigationItem {
  id: "content" | "operations" | "audit";
}

export interface AdminRouteMetadata {
  breadcrumb: string[];
  heading: string;
  navigation: AdminNavigationItem;
  sectionNavigationLabel: string;
}

const adminDashboardRoute: AdminNavigationItem = {
  description: "Overview, session health, and next implementation slices.",
  href: "/admin",
  label: "Dashboard",
  matchStrategy: "exact",
};

export const adminPrimaryNavigation: AdminNavigationItem[] = [
  adminDashboardRoute,
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

const adminRouteMetadata: AdminRouteMetadata[] = [
  {
    breadcrumb: ["Admin", "Dashboard"],
    heading: "Operational dashboard",
    navigation: adminDashboardRoute,
    sectionNavigationLabel: "Dashboard sections",
  },
];

export function getAdminRouteMetadata(pathname: string) {
  return (
    adminRouteMetadata.find((route) =>
      isAdminNavigationItemActive(pathname, route.navigation),
    ) ?? null
  );
}

export function isAdminNavigationItemActive(
  pathname: string,
  item: AdminNavigationItem,
) {
  if (item.matchStrategy === "prefix") {
    return pathname.startsWith(item.href);
  }

  return pathname === item.href;
}
