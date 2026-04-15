import Link from "next/link";

import { toggleAdminInsightPublished } from "@/actions/admin/insights/toggle-admin-insight-published";
import type { AdminInsightsListProps } from "@/interfaces/admin/insight-component-props";
import { formatUpdatedAt } from "@/lib/admin/format";
import { Button } from "@ui/components/ui/button";

import { AdminListToolbar } from "./shared/admin-list-toolbar";

const statusMessageByCode = {
  "invalid-action":
    "The admin action payload was invalid. Refresh the page and try again.",
  "publish-updated": "The insight publish state was updated.",
  "update-error": "The change could not be saved right now. Try again.",
} as const;

export function AdminInsightsList({ data, status }: AdminInsightsListProps) {
  const statusMessage =
    status && status in statusMessageByCode
      ? statusMessageByCode[status as keyof typeof statusMessageByCode]
      : null;

  const isFiltered =
    data.selectedPublishedFilter !== "all" || !!data.selectedTag;

  const summaryText = `${data.totalCount} post${data.totalCount === 1 ? "" : "s"} · ${data.publishedCount} published · ${data.draftCount} draft${data.draftCount === 1 ? "" : "s"}${isFiltered ? ` · ${data.filteredCount} in filter` : ""}`;

  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82">
      <AdminListToolbar
        title="Insights"
        formAction="/admin/insights"
        isFiltered={isFiltered}
        clearHref="/admin/insights"
        newHref="/admin/insights/new"
        newLabel="New insight"
        summaryText={summaryText}
        statusMessage={statusMessage}
        filters={[
          {
            name: "published",
            defaultValue: data.selectedPublishedFilter,
            placeholder: "All posts",
            options: [
              { value: "published", label: "Published only" },
              { value: "draft", label: "Drafts only" },
            ],
          },
          {
            name: "tag",
            defaultValue: data.selectedTag,
            placeholder: "All topics",
            options: data.tags.map((t) => ({ value: t, label: t })),
          },
        ]}
      />

      {data.posts.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Tags
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Published
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Updated
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {data.posts.map((post) => (
                <tr
                  key={post.id}
                  className="transition-colors hover:bg-white/40"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/insights/${post.slug}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      /insights/{post.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {post.tags.length
                      ? post.tags.slice(0, 2).join(", ") +
                        (post.tags.length > 2
                          ? ` +${post.tags.length - 2}`
                          : "")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        post.published
                          ? "inline-flex rounded-full bg-[#111311] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white"
                          : "inline-flex rounded-full border border-border/70 bg-white px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                      }
                    >
                      {post.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatUpdatedAt(post.publishedAt, {
                      emptyLabel: "—",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatUpdatedAt(post.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/api/preview/insights?slug=${post.slug}`}
                          prefetch={false}
                        >
                          Preview
                        </Link>
                      </Button>
                      <form action={toggleAdminInsightPublished}>
                        <input
                          type="hidden"
                          name="currentPublished"
                          value={post.published ? "true" : "false"}
                        />
                        <input
                          type="hidden"
                          name="currentPublishedAt"
                          value={post.publishedAt ?? ""}
                        />
                        <input
                          type="hidden"
                          name="publishedFilter"
                          value={data.selectedPublishedFilter}
                        />
                        <input
                          type="hidden"
                          name="tagFilter"
                          value={data.selectedTag}
                        />
                        <input type="hidden" name="postId" value={post.id} />
                        <input type="hidden" name="slug" value={post.slug} />
                        <Button
                          type="submit"
                          variant={post.published ? "secondary" : "default"}
                          size="sm"
                        >
                          {post.published ? "Unpublish" : "Publish"}
                        </Button>
                      </form>
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
              No posts matched the current filters.
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Clear the filters or broaden the published-state selection to
              inspect the full insights stack.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/admin/insights">Clear filters</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/insights/new">New insight</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
