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

const adminWorkSectionNavigation: AdminNavigationItem[] = [
  {
    description: "Filter state, counts, and route-level admin context.",
    href: "/admin/work#overview",
    icon: "overview",
    label: "Overview",
  },
  {
    description: "Current case-study list with publish controls.",
    href: "/admin/work#case-study-list",
    icon: "list",
    label: "List view",
  },
];

const adminInsightsSectionNavigation: AdminNavigationItem[] = [
  {
    description: "Filter state, counts, and route-level admin context.",
    href: "/admin/insights#overview",
    icon: "overview",
    label: "Overview",
  },
  {
    description: "Current posts list with publish controls.",
    href: "/admin/insights#post-list",
    icon: "list",
    label: "List view",
  },
];

const adminTestimonialsSectionNavigation: AdminNavigationItem[] = [
  {
    description: "Filter state, counts, and route-level admin context.",
    href: "/admin/testimonials#overview",
    icon: "overview",
    label: "Overview",
  },
  {
    description: "Current testimonial list with publish and feature controls.",
    href: "/admin/testimonials#testimonial-list",
    icon: "list",
    label: "List view",
  },
];

const adminRedirectsSectionNavigation: AdminNavigationItem[] = [
  {
    description: "Filter state, counts, and route-level admin context.",
    href: "/admin/redirects#overview",
    icon: "overview",
    label: "Overview",
  },
  {
    description: "Current redirect list with validation-backed edit links.",
    href: "/admin/redirects#redirect-list",
    icon: "list",
    label: "List view",
  },
];

export const adminPrimaryNavigation: AdminNavigationItem[] = [
  adminDashboardRoute,
  adminServicesRoute,
  adminWorkRoute,
  adminInsightsRoute,
  adminTestimonialsRoute,
  adminRedirectsRoute,
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
    sectionNavigationItems: adminServicesSectionNavigation,
    sectionNavigationLabel: "Service list sections",
  },
  {
    breadcrumb: ["Admin", "Work"],
    heading: "Case studies management",
    navigation: adminWorkRoute,
    sectionNavigationItems: adminWorkSectionNavigation,
    sectionNavigationLabel: "Work list sections",
  },
  {
    breadcrumb: ["Admin", "Insights"],
    heading: "Insights management",
    navigation: adminInsightsRoute,
    sectionNavigationItems: adminInsightsSectionNavigation,
    sectionNavigationLabel: "Insights list sections",
  },
  {
    breadcrumb: ["Admin", "Testimonials"],
    heading: "Testimonials management",
    navigation: adminTestimonialsRoute,
    sectionNavigationItems: adminTestimonialsSectionNavigation,
    sectionNavigationLabel: "Testimonials list sections",
  },
  {
    breadcrumb: ["Admin", "Redirects"],
    heading: "Redirects management",
    navigation: adminRedirectsRoute,
    sectionNavigationItems: adminRedirectsSectionNavigation,
    sectionNavigationLabel: "Redirects list sections",
  },
];
