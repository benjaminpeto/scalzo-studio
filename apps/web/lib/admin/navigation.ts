import { adminRouteMetadata } from "@/constants/admin/navigation";
import type { AdminNavigationItem } from "@/interfaces/admin/navigation";

export {
  adminDashboardSections,
  adminPrimaryNavigation,
} from "@/constants/admin/navigation";

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
