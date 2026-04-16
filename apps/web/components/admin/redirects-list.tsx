import Link from "next/link";

import type { AdminRedirectsListProps } from "@/interfaces/admin/component-props";
import { formatUpdatedAt } from "@/lib/admin/format";
import { Button } from "@ui/components/ui/button";

import { AdminListToolbar } from "./shared/admin-list-toolbar";

const statusMessageByCode = {
  deleted: "The redirect was deleted.",
  "invalid-action":
    "The admin action payload was invalid. Refresh the page and try again.",
  "redirect-missing": "That redirect could not be found anymore.",
  "update-error": "The change could not be saved right now. Try again.",
} as const;

export function AdminRedirectsList({ data, status }: AdminRedirectsListProps) {
  const statusMessage =
    status && status in statusMessageByCode
      ? statusMessageByCode[status as keyof typeof statusMessageByCode]
      : null;

  const isFiltered = !!data.query || data.selectedStatusCodeFilter !== "all";

  const summaryText = `${data.totalCount} redirect${data.totalCount === 1 ? "" : "s"} · ${data.status301Count} permanent · ${data.status302Count} temporary${isFiltered ? ` · ${data.filteredCount} in filter` : ""}`;

  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82">
      <AdminListToolbar
        title="Redirects"
        formAction="/admin/redirects"
        query={data.query}
        searchPlaceholder="Search by source or destination path"
        isFiltered={isFiltered}
        clearHref="/admin/redirects"
        newHref="/admin/redirects/new"
        newLabel="New redirect"
        summaryText={summaryText}
        statusMessage={statusMessage}
        filters={[
          {
            name: "statusCode",
            defaultValue: data.selectedStatusCodeFilter,
            placeholder: "All status codes",
            options: [
              { value: "301", label: "301 only" },
              { value: "302", label: "302 only" },
            ],
          },
        ]}
      />

      {data.redirects.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  From
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Code
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  To
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Updated
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
              {data.redirects.map((redirectRecord) => (
                <tr
                  key={redirectRecord.id}
                  className="transition-colors hover:bg-white/40"
                >
                  <td className="px-4 py-3">
                    <code className="text-sm text-foreground">
                      {redirectRecord.fromPath}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-[#111311] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white">
                      {redirectRecord.statusCode}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm text-muted-foreground">
                      {redirectRecord.toPath}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatUpdatedAt(redirectRecord.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/redirects/${redirectRecord.id}`}>
                          Edit
                        </Link>
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
              No redirects matched this view.
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Try clearing the filters or create a new redirect rule to start
              managing URL changes safely.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {isFiltered ? (
                <Button asChild variant="outline">
                  <Link href="/admin/redirects">Clear filters</Link>
                </Button>
              ) : null}
              <Button asChild variant="outline">
                <Link href="/admin/redirects/new">
                  Create the first redirect
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
