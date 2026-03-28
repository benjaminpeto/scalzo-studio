import { Children } from "react";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import { adminDashboardSections } from "@/constants/admin/navigation";

const focusAreaBodyById = {
  audit:
    "Auth events, admin checks, and session diagnostics stay visible while the shell evolves.",
  content:
    "Services, case studies, and insights editing should land here first once CRUD work starts.",
  operations:
    "Lead review, qualification, and response handoff will share the same admin shell.",
} as const;

export default async function AdminPage() {
  const { user } = await requireCurrentAdminAccess("/admin");
  const dashboardCards = Children.toArray(
    adminDashboardSections.map((area, index) => (
      <article
        key={area.id}
        id={area.id}
        className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          0{index + 1}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
          {area.label}
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {focusAreaBodyById[area.id]}
        </p>
      </article>
    )),
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(160deg,rgba(252,205,3,0.22),rgba(255,255,255,0.94)_40%,rgba(241,239,234,0.9))] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Dashboard briefing
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Admin session active for {user.email ?? "your account"}.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            This shell is now the canonical admin entry point. Future content,
            lead, and event workflows should attach to <code>/admin</code> and
            delegate their orchestration to{" "}
            <code>apps/web/actions/&lt;domain&gt;/*</code>.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/80 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Current status
          </p>
          <dl className="mt-4 space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
              <dt className="text-sm text-muted-foreground">Canonical route</dt>
              <dd className="text-sm font-semibold text-foreground">
                <code>/admin</code>
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
              <dt className="text-sm text-muted-foreground">Access model</dt>
              <dd className="text-sm font-semibold text-foreground">
                Auth + <code>public.admins</code>
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-sm text-muted-foreground">Legacy alias</dt>
              <dd className="text-sm font-semibold text-foreground">
                <code>/protected</code> redirects
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">{dashboardCards}</section>

      <section
        id="session"
        className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6"
      >
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Session claims
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
            Current request context
          </h2>
        </div>
        <pre className="mt-5 max-h-96 overflow-auto rounded-[1.5rem] border border-border/70 bg-[#1f201d] p-5 text-xs leading-6 text-[#f5f4f0]">
          {JSON.stringify(user.claims, null, 2)}
        </pre>
      </section>
    </div>
  );
}
