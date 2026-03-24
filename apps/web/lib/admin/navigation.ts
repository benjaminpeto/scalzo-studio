export interface AdminNavigationItem {
  description: string;
  href: string;
  icon:
    | "dashboard"
    | "services"
    | "content"
    | "operations"
    | "audit"
    | "overview"
    | "list";
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
  sectionNavigationItems?: AdminNavigationItem[];
  sectionNavigationLabel: string;
}

const adminDashboardRoute: AdminNavigationItem = {
  description: "Overview, session health, and next implementation slices.",
  href: "/admin",
  icon: "dashboard",
  label: "Dashboard",
  matchStrategy: "exact",
};

const adminServicesRoute: AdminNavigationItem = {
  description:
    "Search, publish state, and ordering controls for public services.",
  href: "/admin/services",
  icon: "services",
  label: "Services",
  matchStrategy: "prefix",
};

const adminServicesSectionNavigation: AdminNavigationItem[] = [
  {
    description: "Search, counts, and route-level admin context.",
    href: "/admin/services#overview",
    icon: "overview",
    label: "Overview",
  },
  {
    description: "Current services list with ordering and publish controls.",
    href: "/admin/services#service-list",
    icon: "list",
    label: "List view",
  },
];

export const adminPrimaryNavigation: AdminNavigationItem[] = [
  adminDashboardRoute,
  adminServicesRoute,
];

export const adminDashboardSections: AdminDashboardSection[] = [
  {
    description: "Publishing workflow, collections, and storage-backed assets.",
    href: "/admin#content",
    id: "content",
    icon: "content",
    label: "Content stack",
  },
  {
    description: "Lead triage, contact handoff, and follow-up automation.",
    href: "/admin#operations",
    id: "operations",
    icon: "operations",
    label: "Lead inbox",
  },
  {
    description: "Auth events, admin checks, and session inspection.",
    href: "/admin#audit",
    id: "audit",
    icon: "audit",
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
  {
    breadcrumb: ["Admin", "Services"],
    heading: "Services management",
    navigation: adminServicesRoute,
    sectionNavigationItems: adminServicesSectionNavigation,
    sectionNavigationLabel: "Service list sections",
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
