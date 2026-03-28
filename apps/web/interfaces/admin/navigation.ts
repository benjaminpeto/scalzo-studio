export interface AdminNavigationItem {
  description: string;
  href: string;
  icon:
    | "dashboard"
    | "services"
    | "work"
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
