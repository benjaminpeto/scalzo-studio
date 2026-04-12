import Link from "next/link";

import type { AdminLeadsListProps } from "@/interfaces/admin/component-props";
import { formatUpdatedAt } from "@/lib/admin/format";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";

export function AdminLeadsList({ data }: AdminLeadsListProps) {
  const isFiltered =
    data.query || data.selectedStatus !== "all" || data.selectedBudget;

  return (
    <div className="space-y-8">
      <section
        id="overview"
        className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
      >
        <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(160deg,rgba(3,130,252,0.10),rgba(255,255,255,0.96)_40%,rgba(241,239,234,0.92))] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Leads index
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Search, filter, and review incoming lead submissions.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            All leads captured via the contact form appear here. Use search and
            filters to triage by status, budget, or contact details.
          </p>
          <form
            action="/admin/leads"
            className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem_12rem_auto]"
          >
            <Input
              type="search"
              name="q"
              defaultValue={data.query}
              placeholder="Search by name, email, or company"
              className="h-12 rounded-full border border-border/70 bg-white/82 px-5"
            />

            {data.statuses.length > 0 ? (
              <select
                name="status"
                defaultValue={data.selectedStatus}
                className="input-shell h-12 rounded-full border border-border/70 bg-white/82 px-5 text-sm text-foreground"
              >
                <option value="all">All statuses</option>
                {data.statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            ) : null}

            {data.budgets.length > 0 ? (
              <select
                name="budget"
                defaultValue={data.selectedBudget}
                className="input-shell h-12 rounded-full border border-border/70 bg-white/82 px-5 text-sm text-foreground"
              >
                <option value="">All budgets</option>
                {data.budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            ) : null}

            <div className="flex gap-3 lg:justify-end">
              <Button type="submit" className="h-12 rounded-full px-6">
                Apply
              </Button>
              {isFiltered ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full px-6"
                >
                  <Link href="/admin/leads">Clear</Link>
                </Button>
              ) : null}
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full px-6"
              >
                <a
                  href={`/admin/leads/export?q=${encodeURIComponent(data.query)}&status=${encodeURIComponent(data.selectedStatus)}&budget=${encodeURIComponent(data.selectedBudget)}`}
                >
                  Export CSV
                </a>
              </Button>
            </div>
          </form>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Total leads
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              {data.totalCount}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              New
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              {data.newCount}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {isFiltered ? "Filtered" : "In view"}
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              {data.filteredCount}
            </p>
          </div>
        </div>
      </section>

      <section
        id="lead-list"
        className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82"
      >
        <div className="flex flex-col gap-3 border-b border-border/60 px-6 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Lead list
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {isFiltered
                ? `${data.filteredCount} result${data.filteredCount === 1 ? "" : "s"} in the current filter set`
                : `${data.totalCount} lead${data.totalCount === 1 ? "" : "s"} in the current admin stack`}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Leads are ordered by submission date, newest first.
          </p>
        </div>

        {data.leads.length ? (
          <div className="divide-y divide-border/60">
            {data.leads.map((lead) => (
              <article
                key={lead.id}
                className="grid gap-5 px-6 py-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] xl:items-center"
              >
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold tracking-[-0.04em] text-foreground">
                          {lead.name ?? "Unknown"}
                        </h3>
                        <span className="inline-flex rounded-full border border-border/70 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {lead.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {lead.email ?? "No email"}
                        {lead.company ? ` · ${lead.company}` : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/leads/${lead.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    {lead.budgetBand ? <p>Budget: {lead.budgetBand}</p> : null}
                    {lead.servicesInterest.length > 0 ? (
                      <p>Interests: {lead.servicesInterest.join(", ")}</p>
                    ) : null}
                    <p>Received: {formatUpdatedAt(lead.createdAt)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10">
            <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-card/60 p-6">
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                No leads matched this view.
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                {isFiltered
                  ? "Try a broader search term or clear the current filters."
                  : "Leads submitted via the contact form will appear here."}
              </p>
              {isFiltered ? (
                <Button asChild variant="outline" className="mt-5">
                  <Link href="/admin/leads">Clear filters</Link>
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
