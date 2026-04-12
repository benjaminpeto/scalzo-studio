import type {
  AdminDashboardSection,
  AdminNavigationItem,
  AdminRouteMetadata,
} from "@/interfaces/admin/navigation";

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

const adminWorkRoute: AdminNavigationItem = {
  description: "Filter, publish, and inspect the public work stack.",
  href: "/admin/work",
  icon: "work",
  label: "Work",
  matchStrategy: "prefix",
};

const adminInsightsRoute: AdminNavigationItem = {
  description: "Filter, publish, and preview the public insights stack.",
  href: "/admin/insights",
  icon: "content",
  label: "Insights",
  matchStrategy: "prefix",
};

const adminTestimonialsRoute: AdminNavigationItem = {
  description:
    "Search, publish, feature, and edit the public testimonials stack.",
  href: "/admin/testimonials",
  icon: "testimonials",
  label: "Testimonials",
  matchStrategy: "prefix",
};

const adminRedirectsRoute: AdminNavigationItem = {
  description:
    "Search, validate, and maintain internal redirect records for future runtime use.",
  href: "/admin/redirects",
  icon: "redirects",
  label: "Redirects",
  matchStrategy: "prefix",
};

const adminLeadsRoute: AdminNavigationItem = {
  description: "Search, filter, and review incoming lead submissions.",
  href: "/admin/leads",
  icon: "operations",
  label: "Leads",
  matchStrategy: "prefix",
};

export const adminPrimaryNavigation: AdminNavigationItem[] = [
  adminDashboardRoute,
  adminServicesRoute,
  adminWorkRoute,
  adminInsightsRoute,
  adminTestimonialsRoute,
  adminRedirectsRoute,
  adminLeadsRoute,
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

export const adminRouteMetadata: AdminRouteMetadata[] = [
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
  },
  {
    breadcrumb: ["Admin", "Work"],
    heading: "Case studies management",
    navigation: adminWorkRoute,
  },
  {
    breadcrumb: ["Admin", "Insights"],
    heading: "Insights management",
    navigation: adminInsightsRoute,
  },
  {
    breadcrumb: ["Admin", "Testimonials"],
    heading: "Testimonials management",
    navigation: adminTestimonialsRoute,
  },
  {
    breadcrumb: ["Admin", "Redirects"],
    heading: "Redirects management",
    navigation: adminRedirectsRoute,
  },
  {
    breadcrumb: ["Admin", "Leads"],
    heading: "Leads management",
    navigation: adminLeadsRoute,
  },
];
