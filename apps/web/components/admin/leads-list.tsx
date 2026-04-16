import Link from "next/link";

import type { AdminLeadsListProps } from "@/interfaces/admin/component-props";
import { formatUpdatedAt } from "@/lib/admin/format";
import { Button } from "@ui/components/ui/button";

import { AdminListToolbar } from "./shared/admin-list-toolbar";

export function AdminLeadsList({ data }: AdminLeadsListProps) {
  const isFiltered =
    !!data.query || data.selectedStatus !== "all" || !!data.selectedBudget;

  const summaryText = `${data.totalCount} lead${data.totalCount === 1 ? "" : "s"} · ${data.newCount} new${isFiltered ? ` · ${data.filteredCount} in filter` : ""}`;

  const exportHref = `/admin/leads/export?q=${encodeURIComponent(data.query)}&status=${encodeURIComponent(data.selectedStatus)}&budget=${encodeURIComponent(data.selectedBudget)}`;

  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82">
      <AdminListToolbar
        title="Leads"
        formAction="/admin/leads"
        query={data.query}
        searchPlaceholder="Search by name, email, or company"
        isFiltered={isFiltered}
        clearHref="/admin/leads"
        summaryText={summaryText}
        filters={[
          {
            name: "status",
            defaultValue: data.selectedStatus,
            placeholder: "All statuses",
            options: data.statuses.map((s) => ({
              value: s,
              label: s.charAt(0).toUpperCase() + s.slice(1),
            })),
          },
          {
            name: "budget",
            defaultValue: data.selectedBudget,
            placeholder: "All budgets",
            options: data.budgets.map((b) => ({ value: b, label: b })),
          },
        ]}
        extraActions={
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full px-4"
          >
            <a href={exportHref}>Export CSV</a>
          </Button>
        }
      />

      {data.leads.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Name &amp; Email
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Budget
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Received
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {data.leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="transition-colors hover:bg-white/40"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {lead.name ?? "Unknown"}
                    </Link>
                    {lead.email ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {lead.email}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {lead.company || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {lead.budgetBand || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full border border-border/70 bg-white px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatUpdatedAt(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/leads/${lead.id}`}>View</Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
