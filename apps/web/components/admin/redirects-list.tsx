import Link from "next/link";

import type { AdminRedirectsListProps } from "@/interfaces/admin/component-props";
import { formatUpdatedAt } from "@/lib/admin/format";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";

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

  return (
    <div className="space-y-8">
      <section
        id="overview"
        className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
      >
        <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(160deg,rgba(252,205,3,0.16),rgba(255,255,255,0.96)_40%,rgba(241,239,234,0.92))] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Redirects index
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Search and maintain internal redirect records safely.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            This route manages validated redirect records only. Public runtime
            enforcement arrives in the later redirect integration task.
          </p>
          <form
            action="/admin/redirects"
            className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem_auto]"
          >
            <Input
              type="search"
              name="q"
              defaultValue={data.query}
              placeholder="Search by source or destination path"
              className="h-12 rounded-full border border-border/70 bg-white/82 px-5"
            />

            <select
              name="statusCode"
              defaultValue={data.selectedStatusCodeFilter}
              className="input-shell h-12 rounded-full border border-border/70 bg-white/82 px-5 text-sm text-foreground"
            >
              <option value="all">All status codes</option>
              <option value="301">301 only</option>
              <option value="302">302 only</option>
            </select>

            <div className="flex gap-3 lg:justify-end">
              <Button type="submit" className="h-12 rounded-full px-6">
                Apply
              </Button>
              {data.query || data.selectedStatusCodeFilter !== "all" ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full px-6"
                >
                  <Link href="/admin/redirects">Clear</Link>
                </Button>
              ) : null}
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full px-6"
              >
                <Link href="/admin/redirects/new">New redirect</Link>
              </Button>
            </div>
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
              Total redirects
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              {data.totalCount}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              301 redirects
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              {data.status301Count}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              302 redirects
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              {data.status302Count}
            </p>
          </div>
        </div>
      </section>

      <section
        id="redirect-list"
        className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82"
      >
        <div className="flex flex-col gap-3 border-b border-border/60 px-6 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Redirect list
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {data.query || data.selectedStatusCodeFilter !== "all"
                ? `${data.filteredCount} result${data.filteredCount === 1 ? "" : "s"} in the current filter set`
                : `${data.totalCount} redirect${data.totalCount === 1 ? "" : "s"} in the current admin stack`}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Use this list to maintain source and destination paths safely before
            redirect runtime handling is wired into the app.
          </p>
        </div>

        {data.redirects.length ? (
          <div className="divide-y divide-border/60">
            {data.redirects.map((redirectRecord) => (
              <article
                key={redirectRecord.id}
                className="grid gap-5 px-6 py-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] xl:items-center"
              >
                <div className="min-w-0 space-y-4">
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold tracking-[-0.04em] text-foreground">
                          <code>{redirectRecord.fromPath}</code>
                        </h3>
                        <span className="inline-flex rounded-full bg-[#111311] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white">
                          {redirectRecord.statusCode}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Redirects to <code>{redirectRecord.toPath}</code>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/redirects/${redirectRecord.id}`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <p>
                      Last updated: {formatUpdatedAt(redirectRecord.updatedAt)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
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
                {data.query || data.selectedStatusCodeFilter !== "all" ? (
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
      </section>
    </div>
  );
}
