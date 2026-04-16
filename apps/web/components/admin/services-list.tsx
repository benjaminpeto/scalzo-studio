import Link from "next/link";

import { moveAdminServiceOrder } from "@/actions/admin/services/move-admin-service-order";
import { toggleAdminServicePublished } from "@/actions/admin/services/toggle-admin-service-published";
import type { AdminServicesListProps } from "@/interfaces/admin/component-props";
import { formatUpdatedAt } from "@/lib/admin/format";
import { Button } from "@ui/components/ui/button";

import { AdminListToolbar } from "./shared/admin-list-toolbar";

const statusMessageByCode = {
  "invalid-action":
    "The admin action payload was invalid. Refresh the page and try again.",
  "order-edge": "That service is already at the edge of the current order.",
  "order-updated": "The services order was updated.",
  "publish-updated": "The service publish state was updated.",
  "service-missing": "That service could not be found anymore.",
  "update-error": "The change could not be saved right now. Try again.",
} as const;

export function AdminServicesList({ data, status }: AdminServicesListProps) {
  const statusMessage =
    status && status in statusMessageByCode
      ? statusMessageByCode[status as keyof typeof statusMessageByCode]
      : null;

  const summaryText = `${data.totalCount} service${data.totalCount === 1 ? "" : "s"} · ${data.publishedCount} published · ${data.draftCount} draft${data.draftCount === 1 ? "" : "s"}${data.query ? ` · ${data.filteredCount} matching "${data.query}"` : ""}`;

  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82">
      <AdminListToolbar
        title="Services"
        formAction="/admin/services"
        query={data.query}
        searchPlaceholder="Search by title, slug, summary, or deliverable"
        isFiltered={!!data.query}
        clearHref="/admin/services"
        newHref="/admin/services/new"
        newLabel="New service"
        summaryText={summaryText}
        statusMessage={statusMessage}
      />

      {data.services.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60">
              <tr>
                <th
                  scope="col"
                  className="w-12 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Title
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
                  Deliverables
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
              {data.services.map((service, index) => {
                const isFirst = index === 0;
                const isLast = index === data.services.length - 1;

                return (
                  <tr
                    key={service.id}
                    className="transition-colors hover:bg-white/40"
                  >
                    <td className="px-4 py-3 text-sm font-medium tabular-nums text-muted-foreground">
                      {String(service.orderIndex + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/services/${service.slug}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {service.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        /services/{service.slug}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          service.published
                            ? "inline-flex rounded-full bg-[#111311] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white"
                            : "inline-flex rounded-full border border-border/70 bg-white px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                        }
                      >
                        {service.published ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {service.deliverablesCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatUpdatedAt(service.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <form action={moveAdminServiceOrder}>
                          <input type="hidden" name="direction" value="up" />
                          <input
                            type="hidden"
                            name="searchQuery"
                            value={data.query}
                          />
                          <input
                            type="hidden"
                            name="serviceId"
                            value={service.id}
                          />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            aria-label={`Move ${service.title} up`}
                            disabled={isFirst}
                          >
                            ↑
                          </Button>
                        </form>
                        <form action={moveAdminServiceOrder}>
                          <input type="hidden" name="direction" value="down" />
                          <input
                            type="hidden"
                            name="searchQuery"
                            value={data.query}
                          />
                          <input
                            type="hidden"
                            name="serviceId"
                            value={service.id}
                          />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            aria-label={`Move ${service.title} down`}
                            disabled={isLast}
                          >
                            ↓
                          </Button>
                        </form>
                        <form action={toggleAdminServicePublished}>
                          <input
                            type="hidden"
                            name="currentPublished"
                            value={service.published ? "true" : "false"}
                          />
                          <input
                            type="hidden"
                            name="searchQuery"
                            value={data.query}
                          />
                          <input
                            type="hidden"
                            name="serviceId"
                            value={service.id}
                          />
                          <input
                            type="hidden"
                            name="slug"
                            value={service.slug}
                          />
                          <Button
                            type="submit"
                            variant={
                              service.published ? "secondary" : "default"
                            }
                            size="sm"
                          >
                            {service.published ? "Unpublish" : "Publish"}
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-10">
          <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-card/60 p-6">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
              No services matched this search.
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Try a broader term, search by slug, or clear the current filter to
              see the full service stack.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {data.query ? (
                <Button asChild variant="outline">
                  <Link href="/admin/services">Clear search</Link>
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link href="/admin/services/new">
                    Create the first new service
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
