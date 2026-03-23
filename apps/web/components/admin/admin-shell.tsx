import Link from "next/link";

import { LogoutButton } from "@/components/logout-button";

const dashboardSections = [
  {
    description: "Publishing workflow, collections, and storage-backed assets.",
    href: "/admin#content",
    label: "Content stack",
  },
  {
    description: "Lead triage, contact handoff, and follow-up automation.",
    href: "/admin#operations",
    label: "Lead inbox",
  },
  {
    description: "Audit trail, events, and auth/session inspection.",
    href: "/admin#audit",
    label: "Audit trail",
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="flex flex-col justify-between rounded-[2rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(245,244,240,0.96))] p-5 shadow-[0_24px_80px_rgba(27,28,26,0.08)] backdrop-blur">
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
              <nav className="space-y-2">
                <Link
                  href="/admin"
                  className="block rounded-2xl border border-transparent bg-primary px-4 py-3 text-primary-foreground shadow-[0_20px_45px_rgba(115,92,0,0.18)] transition-transform hover:-translate-y-0.5"
                >
                  <div className="text-sm font-semibold">Dashboard</div>
                  <div className="mt-1 text-xs leading-5 text-primary-foreground/80">
                    Overview, session health, and next implementation slices.
                  </div>
                </Link>
              </nav>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Dashboard sections
              </p>
              <nav className="space-y-2">
                {dashboardSections.map((item) => (
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
                The admin shell stays behind middleware and server-side checks.
              </p>
            </div>
            <div className="mt-4">
              <LogoutButton />
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          <header className="rounded-[2rem] border border-border/70 bg-card/85 px-6 py-5 shadow-[0_20px_60px_rgba(27,28,26,0.06)] backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Admin / Dashboard
                </p>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
                  Operational dashboard
                </h2>
              </div>
              <div className="rounded-full border border-border/70 bg-surface-container-low px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Internal access only
              </div>
            </div>
          </header>

          <section className="rounded-[2rem] border border-border/70 bg-card/88 p-6 shadow-[0_24px_80px_rgba(27,28,26,0.08)] backdrop-blur md:p-8">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
