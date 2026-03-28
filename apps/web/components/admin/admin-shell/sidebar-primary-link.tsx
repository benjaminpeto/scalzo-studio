import Link from "next/link";

import type { SidebarPrimaryLinkProps } from "@/interfaces/admin/component-props";
import { isAdminNavigationItemActive } from "@/lib/admin/navigation";
import { cn } from "@/lib/utils";

import { adminShellIconMap } from "./icon-map";

export function SidebarPrimaryLink({
  collapsed,
  item,
  pathname,
}: SidebarPrimaryLinkProps) {
  const isActive = isAdminNavigationItemActive(pathname, item);
  const Icon = adminShellIconMap[item.icon];

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      aria-label={item.label}
      title={collapsed ? item.label : undefined}
      className={`group flex items-center rounded-[1.1rem] border text-sm transition-[width,transform,background-color,color,border-color] duration-300 ${
        isActive
          ? "border-primary/30 bg-primary text-primary-foreground shadow-[0_20px_45px_rgba(115,92,0,0.18)]"
          : "border-border/60 bg-surface-container-lowest/72 text-foreground hover:border-primary/30 hover:bg-card hover:-translate-y-px"
      } ${
        collapsed ? "justify-center px-0 py-0 lg:size-12" : "gap-3 px-3.5 py-3"
      }`}
    >
      <Icon className="size-[1.05rem] shrink-0" />
      <div className={cn("min-w-0", collapsed && "lg:hidden")}>
        <div className="truncate font-semibold">{item.label}</div>
      </div>
    </Link>
  );
}
