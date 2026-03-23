"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import {
  adminDashboardSections,
  adminPrimaryNavigation,
  getAdminRouteMetadata,
  isAdminNavigationItemActive,
  type AdminNavigationItem,
} from "@/lib/admin/navigation";

function NavigationLink({
  item,
  pathname,
}: {
  item: AdminNavigationItem;
  pathname: string;
}) {
  const isActive = isAdminNavigationItemActive(pathname, item);

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={`block rounded-2xl border px-4 py-3 text-sm transition-colors ${
        isActive
          ? "border-primary/30 bg-primary text-primary-foreground shadow-[0_20px_45px_rgba(115,92,0,0.18)]"
          : "border-border/60 bg-surface-container-lowest/70 text-foreground hover:border-primary/30 hover:bg-card"
      }`}
    >
      <div className="font-semibold">{item.label}</div>
      <div
        className={`mt-1 text-xs leading-5 ${
          isActive ? "text-primary-foreground/80" : "text-muted-foreground"
        }`}
      >
        {item.description}
      </div>
    </Link>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentRoute = getAdminRouteMetadata(pathname);
  const breadcrumbItems = currentRoute?.breadcrumb ?? ["Admin"];
  const heading = currentRoute?.heading ?? "Operational dashboard";
  const sectionNavigationLabel =
    currentRoute?.sectionNavigationLabel ?? "Dashboard sections";

  return (
    <main className="min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="flex flex-col justify-between rounded-4xl border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(245,244,240,0.96))] p-5 shadow-[0_24px_80px_rgba(27,28,26,0.08)] backdrop-blur">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Scalzo Studio
              </p>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  Admin atelier
                </h1>
                <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                  A calm operational shell for content, leads, and admin-only
                  decisions.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Routes
              </p>
              <nav aria-label="Admin routes" className="space-y-2">
                {adminPrimaryNavigation.map((item) => (
                  <NavigationLink
                    key={item.href}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </nav>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Dashboard sections
              </p>
              <nav aria-label="Dashboard section links" className="space-y-2">
                {adminDashboardSections.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-2xl border border-border/60 bg-surface-container-lowest/70 px-4 py-3 text-sm text-foreground hover:border-primary/30 hover:bg-card"
                  >
                    <div className="font-medium">{item.label}</div>
                    <div className="mt-1 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border/60 bg-[radial-gradient(circle_at_top,rgba(252,205,3,0.18),transparent_70%),linear-gradient(180deg,rgba(241,239,234,0.92),rgba(255,255,255,0.88))] p-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Session
              </p>
              <p className="text-sm leading-6 text-foreground">
                The admin shell stays behind proxy and server-side checks.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <LogoutButton
                className="hidden lg:inline-flex"
                message="You have been signed out of the admin session."
              />
              <Link
                href="/"
                className="inline-flex h-10 items-center rounded-sm bg-transparent px-4 text-sm font-semibold tracking-[0.02em] text-foreground underline decoration-editorial-underline underline-offset-4"
              >
                View site
              </Link>
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          <header className="rounded-4xl border border-border/70 bg-card/85 px-6 py-5 shadow-[0_20px_60px_rgba(27,28,26,0.06)] backdrop-blur">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
                    {heading}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-full border border-border/70 bg-surface-container-low px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Internal access only
                  </div>
                  <LogoutButton
                    className="lg:hidden"
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
                {adminDashboardSections.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-border/70 bg-surface-container-low px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <section className="rounded-4xl border border-border/70 bg-card/88 p-6 shadow-[0_24px_80px_rgba(27,28,26,0.08)] backdrop-blur md:p-8">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
