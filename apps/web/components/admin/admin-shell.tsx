"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  Layers3,
  LogOut,
  PanelTop,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { LogoutButton } from "@/components/logout-button";
import { cn } from "@/lib/utils";
import {
  adminDashboardSections,
  adminPrimaryNavigation,
  getAdminRouteMetadata,
  isAdminNavigationItemActive,
  type AdminNavigationItem,
} from "@/lib/admin/navigation";

const SIDEBAR_STORAGE_KEY = "scalzo-admin-sidebar-collapsed";

const iconByKey: Record<AdminNavigationItem["icon"], LucideIcon> = {
  audit: ShieldCheck,
  content: Layers3,
  dashboard: LayoutDashboard,
  list: ClipboardList,
  operations: Inbox,
  overview: PanelTop,
  services: BriefcaseBusiness,
};

function SidebarPrimaryLink({
  collapsed,
  item,
  pathname,
}: {
  collapsed: boolean;
  item: AdminNavigationItem;
  pathname: string;
}) {
  const isActive = isAdminNavigationItemActive(pathname, item);
  const Icon = iconByKey[item.icon];

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

function SidebarSectionLink({
  collapsed,
  item,
}: {
  collapsed: boolean;
  item: AdminNavigationItem;
}) {
  const Icon = iconByKey[item.icon];

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
      <Icon className="size-[1rem] shrink-0 text-muted-foreground" />
      <span className={cn("truncate font-medium", collapsed && "lg:hidden")}>
        {item.label}
      </span>
    </Link>
  );
}

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string | null;
}) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const currentRoute = getAdminRouteMetadata(pathname);
  const breadcrumbItems = currentRoute?.breadcrumb ?? ["Admin"];
  const heading = currentRoute?.heading ?? "Operational dashboard";
  const sectionNavigationLabel =
    currentRoute?.sectionNavigationLabel ?? "Dashboard sections";
  const sectionNavigationItems =
    currentRoute?.sectionNavigationItems ?? adminDashboardSections;

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
      setIsSidebarCollapsed(storedValue === "true");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        isSidebarCollapsed ? "true" : "false",
      );
    } catch {}
  }, [isSidebarCollapsed]);

  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [pathname, isSidebarCollapsed]);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isProfileMenuOpen]);

  const profileInitials = useMemo(() => {
    const normalizedEmail = userEmail?.trim() ?? "";

    if (!normalizedEmail) {
      return "SS";
    }

    const localPart = normalizedEmail.split("@")[0] ?? normalizedEmail;
    const collapsedLocalPart = localPart.replace(/[^a-zA-Z0-9]/g, "");

    return collapsedLocalPart.slice(0, 2).toUpperCase() || "SS";
  }, [userEmail]);

  return (
    <main className="h-svh overflow-hidden bg-[linear-gradient(180deg,rgba(241,239,234,0.96),rgba(255,255,255,0.92))]">
      <div
        className={`grid h-full w-full grid-rows-[auto_minmax(0,1fr)] overflow-hidden lg:grid-rows-1 ${
          isSidebarCollapsed
            ? "lg:grid-cols-[5.4rem_minmax(0,1fr)]"
            : "lg:grid-cols-[16.8rem_minmax(0,1fr)]"
        }`}
      >
        <aside className="flex flex-col border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,244,240,0.98))] lg:h-svh lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-4">
            <div className={cn("min-w-0", isSidebarCollapsed && "lg:hidden")}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Scalzo Studio
              </p>
              <p className="mt-2 font-display text-[1.55rem] leading-none tracking-[-0.05em] text-foreground">
                Admin
              </p>
            </div>
            <div
              className={cn(
                "hidden lg:flex lg:size-10 lg:items-center lg:justify-center",
                !isSidebarCollapsed && "lg:hidden",
              )}
            >
              <span className="font-display text-lg tracking-[-0.06em] text-foreground">
                S
              </span>
            </div>
            <button
              type="button"
              aria-label={
                isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              onClick={() => setIsSidebarCollapsed((current) => !current)}
              className="hidden lg:inline-flex lg:size-10 lg:items-center lg:justify-center lg:rounded-[1rem] lg:border lg:border-border/60 lg:bg-surface-container-lowest/76 lg:text-foreground lg:transition-colors lg:hover:border-primary/30 lg:hover:bg-card"
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="size-[1.05rem]" />
              ) : (
                <ChevronLeft className="size-[1.05rem]" />
              )}
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-between gap-4 px-3 py-3">
            <div className="space-y-4">
              <div
                className={cn(
                  "space-y-2",
                  isSidebarCollapsed && "lg:space-y-3",
                )}
              >
                <p
                  className={cn(
                    "px-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground",
                    isSidebarCollapsed && "lg:hidden",
                  )}
                >
                  Routes
                </p>
                <nav
                  aria-label="Admin routes"
                  className={cn(
                    "space-y-2",
                    isSidebarCollapsed && "lg:flex lg:flex-col lg:items-center",
                  )}
                >
                  {adminPrimaryNavigation.map((item) => (
                    <SidebarPrimaryLink
                      key={item.href}
                      collapsed={isSidebarCollapsed}
                      item={item}
                      pathname={pathname}
                    />
                  ))}
                </nav>
              </div>

              <div className="space-y-2">
                <p
                  className={cn(
                    "px-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground",
                    isSidebarCollapsed && "lg:hidden",
                  )}
                >
                  {sectionNavigationLabel}
                </p>
                <nav
                  aria-label={sectionNavigationLabel}
                  className={cn(
                    "space-y-2",
                    isSidebarCollapsed && "lg:flex lg:flex-col lg:items-center",
                  )}
                >
                  {sectionNavigationItems.map((item) => (
                    <SidebarSectionLink
                      key={item.href}
                      collapsed={isSidebarCollapsed}
                      item={item}
                    />
                  ))}
                </nav>
              </div>
            </div>

            <div
              ref={profileMenuRef}
              className={cn(
                "relative",
                isSidebarCollapsed && "lg:flex lg:justify-center",
              )}
            >
              <button
                type="button"
                aria-expanded={isProfileMenuOpen}
                aria-label="Open profile menu"
                onClick={() => setIsProfileMenuOpen((current) => !current)}
                className={cn(
                  "flex items-center border border-border/60 bg-[radial-gradient(circle_at_top,rgba(252,205,3,0.14),transparent_72%),linear-gradient(180deg,rgba(241,239,234,0.92),rgba(255,255,255,0.88))] text-left transition-colors hover:border-primary/30 hover:bg-card",
                  isSidebarCollapsed
                    ? "w-full justify-center rounded-[1.15rem] px-0 py-3 lg:size-12"
                    : "w-full gap-3 rounded-[1.2rem] px-3 py-3",
                )}
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#161813,#735c00)] font-semibold tracking-[0.08em] text-white">
                  {profileInitials}
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1",
                    isSidebarCollapsed && "lg:hidden",
                  )}
                >
                  <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Session
                  </span>
                  <span className="mt-1 block truncate text-sm font-medium text-foreground">
                    {userEmail ?? "Admin user"}
                  </span>
                </span>
                <ChevronRight
                  className={cn(
                    "size-[0.9rem] shrink-0 text-muted-foreground transition-transform",
                    isProfileMenuOpen && "rotate-90",
                    isSidebarCollapsed && "lg:hidden",
                  )}
                />
              </button>

              {isProfileMenuOpen ? (
                <div
                  className={cn(
                    "absolute z-20 w-56 rounded-[1.15rem] border border-border/70 bg-white/96 p-2 shadow-[0_18px_40px_rgba(27,28,26,0.12)] backdrop-blur",
                    isSidebarCollapsed
                      ? "bottom-0 left-[calc(100%+0.75rem)] lg:w-52"
                      : "bottom-[calc(100%+0.75rem)] left-0 right-0",
                  )}
                >
                  <div className="px-3 py-2">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Signed in
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-foreground">
                      {userEmail ?? "Admin user"}
                    </p>
                  </div>
                  <div className="mt-1 space-y-1">
                    <Link
                      href="/"
                      className="flex items-center gap-2 rounded-[0.9rem] px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-container-low"
                    >
                      <ArrowUpRight className="size-[0.95rem]" />
                      <span>View site</span>
                    </Link>
                    <LogoutButton
                      ariaLabel="Logout"
                      className="w-full justify-start rounded-[0.9rem] border-0 bg-transparent px-3 py-2 text-sm font-medium shadow-none hover:bg-surface-container-low"
                      icon={<LogOut className="size-[0.95rem]" />}
                      label="Logout"
                      message="You have been signed out of the admin session."
                      size="default"
                      variant="ghost"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </aside>

        <div className="flex min-h-0 flex-col overflow-hidden">
          <header className="shrink-0 border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(249,248,244,0.92))] px-4 py-4 shadow-[0_14px_30px_rgba(27,28,26,0.04)] md:px-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-3">
                  <nav aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                      {breadcrumbItems.map((item, index) => (
                        <li
                          key={`${item}-${index}`}
                          className="flex items-center gap-2"
                        >
                          {index > 0 ? (
                            <span
                              aria-hidden="true"
                              className="text-muted-foreground/60"
                            >
                              /
                            </span>
                          ) : null}
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </nav>
                  <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground md:text-3xl">
                    {heading}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-full border border-border/70 bg-surface-container-low px-3 py-2 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Internal access only
                  </div>
                  <LogoutButton
                    className="lg:hidden"
                    icon={<LogOut className="size-[0.95rem]" />}
                    message="You have been signed out of the admin session."
                    size="sm"
                    variant="outline"
                  />
                </div>
              </div>

              <nav
                aria-label={sectionNavigationLabel}
                className="flex flex-wrap gap-2"
              >
                {sectionNavigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-border/70 bg-surface-container-low px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <section className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(245,244,240,0.48),rgba(255,255,255,0.82))] p-3 md:p-4">
            <div className="rounded-[1.75rem] border border-border/70 bg-card/88 p-4 shadow-[0_20px_64px_rgba(27,28,26,0.08)] backdrop-blur md:p-5">
              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
