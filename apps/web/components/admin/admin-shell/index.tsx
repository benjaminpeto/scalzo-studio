"use client";

import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import {
  adminDashboardSections,
  adminPrimaryNavigation,
} from "@/constants/admin/navigation";
import { useAdminShellState } from "@/hooks/admin/use-admin-shell-state";
import type { AdminShellProps } from "@/interfaces/admin/component-props";
import { getAdminRouteMetadata } from "@/lib/admin/navigation";
import { cn } from "@/lib/utils";

import { AdminProfileMenu } from "./profile-menu";
import { SidebarPrimaryLink } from "./sidebar-primary-link";
import { SidebarSectionLink } from "./sidebar-section-link";

export function AdminShell({ children, userEmail }: AdminShellProps) {
  const pathname = usePathname();
  const {
    isProfileMenuOpen,
    isSidebarCollapsed,
    profileInitials,
    profileMenuRef,
    toggleProfileMenu,
    toggleSidebar,
  } = useAdminShellState({
    pathname,
    userEmail,
  });
  const currentRoute = getAdminRouteMetadata(pathname);
  const breadcrumbItems = currentRoute?.breadcrumb ?? ["Admin"];
  const heading = currentRoute?.heading ?? "Operational dashboard";
  const isDashboard = pathname === "/admin";
  const sectionNavigationLabel =
    currentRoute?.sectionNavigationLabel ?? "Dashboard sections";
  const sectionNavigationItems = isDashboard
    ? adminDashboardSections
    : (currentRoute?.sectionNavigationItems ?? []);

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
              onClick={toggleSidebar}
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

              {sectionNavigationItems.length > 0 ? (
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
                      isSidebarCollapsed &&
                        "lg:flex lg:flex-col lg:items-center",
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
              ) : null}
            </div>

            <div
              ref={profileMenuRef}
              className={cn(
                "relative",
                isSidebarCollapsed && "lg:flex lg:justify-center",
              )}
            >
              <AdminProfileMenu
                isCollapsed={isSidebarCollapsed}
                isOpen={isProfileMenuOpen}
                profileInitials={profileInitials}
                toggle={toggleProfileMenu}
                userEmail={userEmail}
              />
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

              {sectionNavigationItems.length > 0 ? (
                <nav
                  aria-label={sectionNavigationLabel}
                  className="flex flex-wrap gap-2"
                >
                  {sectionNavigationItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="rounded-full border border-border/70 bg-surface-container-low px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              ) : null}
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
