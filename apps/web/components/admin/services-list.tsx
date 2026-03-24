import Link from "next/link";

import type { AdminServicesListData } from "@/actions/admin/services/server";
import {
  moveAdminServiceOrder,
  toggleAdminServicePublished,
} from "@/actions/admin/services/server";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";

const statusMessageByCode = {
  "invalid-action":
    "The admin action payload was invalid. Refresh the page and try again.",
  "order-edge": "That service is already at the edge of the current order.",
  "order-updated": "The services order was updated.",
  "publish-updated": "The service publish state was updated.",
  "service-missing": "That service could not be found anymore.",
  "update-error": "The change could not be saved right now. Try again.",
} as const;

function formatUpdatedAt(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export function AdminServicesList({
  data,
  status,
}: {
  data: AdminServicesListData;
  status?: string;
}) {
  const statusMessage =
    status && status in statusMessageByCode
      ? statusMessageByCode[status as keyof typeof statusMessageByCode]
      : null;

  return (
    <div className="space-y-8">
      <section
        id="overview"
        className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
      >
        <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(160deg,rgba(252,205,3,0.16),rgba(255,255,255,0.96)_40%,rgba(241,239,234,0.92))] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Services index
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Search, publish, and order the public service stack.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            This route controls the order used by the public services index and
            related sections across the marketing site. Use the editor link when
            you need content changes in the next ticket.
          </p>
          <form
            action="/admin/services"
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <Input
              type="search"
              name="q"
              defaultValue={data.query}
              placeholder="Search by title, slug, summary, or deliverable"
              className="h-12 rounded-full border border-border/70 bg-white/82 px-5"
            />
            <Button type="submit" className="h-12 rounded-full px-6">
              Search
            </Button>
            {data.query ? (
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full px-6"
              >
                <Link href="/admin/services">Clear</Link>
              </Button>
            ) : null}
          </form>
          {statusMessage ? (
            <div className="mt-5 rounded-[1.25rem] border border-border/70 bg-white/78 p-4 text-sm leading-6 text-foreground">
              {statusMessage}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Total services
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              {data.totalCount}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Published
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              {data.publishedCount}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Drafts
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              {data.draftCount}
            </p>
          </div>
        </div>
      </section>

      <section
        id="service-list"
        className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82"
      >
        <div className="flex flex-col gap-3 border-b border-border/60 px-6 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Service list
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {data.query
                ? `${data.filteredCount} result${data.filteredCount === 1 ? "" : "s"} for "${data.query}"`
                : `${data.totalCount} service${data.totalCount === 1 ? "" : "s"} in the current admin stack`}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Ordering controls affect the public sequence. Publish toggles decide
            whether the service is visible on the marketing routes.
          </p>
        </div>

        {data.services.length ? (
          <div className="divide-y divide-border/60">
            {data.services.map((service, index) => {
              const isFirst = index === 0;
              const isLast = index === data.services.length - 1;

              return (
                <article
                  key={service.id}
                  className="grid gap-5 px-6 py-5 xl:grid-cols-[5rem_minmax(0,1.2fr)_minmax(0,0.8fr)] xl:items-center"
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      Order
                    </p>
                    <p className="font-display text-[2rem] leading-none tracking-[-0.04em] text-foreground">
                      {String(service.orderIndex + 1).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="min-w-0 space-y-4">
                    <div className="flex flex-wrap items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                            {service.title}
                          </h3>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${
                              service.published
                                ? "bg-[#111311] text-white"
                                : "border border-border/70 bg-white text-muted-foreground"
                            }`}
                          >
                            {service.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          /services/{service.slug}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/services/${service.slug}`}>
                            Edit
                          </Link>
                        </Button>
                        {service.published ? (
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/services/${service.slug}`}>
                              Preview
                            </Link>
                          </Button>
                        ) : (
                          <span className="inline-flex h-9 items-center rounded-sm px-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            Public route hidden
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm leading-7 text-muted-foreground">
                      {service.summary ||
                        "No summary yet. Use the editor route to add the public summary in the next ticket."}
                    </p>

                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                      <p>Deliverables: {service.deliverablesCount}</p>
                      <p>Last updated: {formatUpdatedAt(service.updatedAt)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 xl:items-end">
                    <div className="flex flex-wrap gap-2">
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
                          disabled={isFirst}
                        >
                          Move up
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
                          disabled={isLast}
                        >
                          Move down
                        </Button>
                      </form>
                    </div>

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
                      <input type="hidden" name="slug" value={service.slug} />
                      <Button
                        type="submit"
                        variant={service.published ? "secondary" : "default"}
                        size="sm"
                      >
                        {service.published ? "Unpublish" : "Publish"}
                      </Button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-10">
            <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-card/60 p-6">
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                No services matched this search.
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Try a broader term, search by slug, or clear the current filter
                to see the full service stack.
              </p>
              {data.query ? (
                <Button asChild variant="outline" className="mt-5">
                  <Link href="/admin/services">Clear search</Link>
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
