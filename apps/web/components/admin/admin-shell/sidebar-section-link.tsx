import Link from "next/link";

import type { SidebarSectionLinkProps } from "@/interfaces/admin/component-props";
import { cn } from "@/lib/utils";

import { adminShellIconMap } from "./icon-map";

export function SidebarSectionLink({
  collapsed,
  item,
}: SidebarSectionLinkProps) {
  const Icon = adminShellIconMap[item.icon];

  return (
    <Link
      href={item.href}
      aria-label={item.label}
      title={collapsed ? item.label : undefined}
      className={`group flex items-center rounded-[1rem] border border-border/60 bg-surface-container-lowest/68 text-sm text-foreground transition-[transform,background-color,border-color] duration-300 hover:border-primary/25 hover:bg-card hover:-translate-y-px ${
        collapsed
          ? "justify-center px-0 py-0 lg:size-11"
          : "gap-3 px-3.5 py-2.5"
      }`}
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className={cn("truncate font-medium", collapsed && "lg:hidden")}>
        {item.label}
      </span>
    </Link>
  );
}
