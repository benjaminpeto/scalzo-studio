import Link from "next/link";

import type { AdminInsightsListData } from "@/actions/admin/insights/server";
import { toggleAdminInsightPublished } from "@/actions/admin/insights/server";
import { Button } from "@ui/components/ui/button";

const statusMessageByCode = {
  "invalid-action":
    "The admin action payload was invalid. Refresh the page and try again.",
  "publish-updated": "The insight publish state was updated.",
  "update-error": "The change could not be saved right now. Try again.",
} as const;

function formatDate(value: string | null) {
  if (!value) {
    return "Not published";
  }

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

export function AdminInsightsList({
  data,
  status,
}: {
  data: AdminInsightsListData;
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
            Insights index
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Filter, publish, and preview the editorial article stack.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            This route controls which posts are visible on the public insights
            index and article pages. The editor route will handle markdown,
            excerpts, tags, SEO fields, and media helpers in the next ticket.
          </p>
          <form
            action="/admin/insights"
            className="mt-6 flex flex-col gap-3 lg:flex-row"
          >
            <label className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Published state
              </span>
              <select
                name="published"
                defaultValue={data.selectedPublishedFilter}
                className="input-shell h-12 rounded-full border border-border/70 bg-white/82 px-5 text-sm text-foreground"
              >
                <option value="all">All posts</option>
                <option value="published">Published only</option>
                <option value="draft">Drafts only</option>
              </select>
            </label>

            <label className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Tag
              </span>
              <select
                name="tag"
                defaultValue={data.selectedTag}
                className="input-shell h-12 rounded-full border border-border/70 bg-white/82 px-5 text-sm text-foreground"
              >
                <option value="">All topics</option>
                {data.tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-3 lg:items-end">
              <Button type="submit" className="h-12 rounded-full px-6">
                Apply filters
              </Button>
              {data.selectedPublishedFilter !== "all" || data.selectedTag ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full px-6"
                >
                  <Link href="/admin/insights">Clear</Link>
                </Button>
              ) : null}
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
              Total posts
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
        id="post-list"
        className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82"
      >
        <div className="flex flex-col gap-3 border-b border-border/60 px-6 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Post list
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {data.selectedPublishedFilter !== "all" || data.selectedTag
                ? `${data.filteredCount} result${data.filteredCount === 1 ? "" : "s"} in the current filter set`
                : `${data.totalCount} post${data.totalCount === 1 ? "" : "s"} in the current admin stack`}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Preview links open the latest saved article state inside an
            admin-only preview session, even when the post is still a draft.
          </p>
        </div>

        {data.posts.length ? (
          <div className="divide-y divide-border/60">
            {data.posts.map((post) => (
              <article
                key={post.id}
                className="grid gap-5 px-6 py-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] xl:items-center"
              >
                <div className="min-w-0 space-y-4">
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                          {post.title}
                        </h3>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${
                            post.published
                              ? "bg-[#111311] text-white"
                              : "border border-border/70 bg-white text-muted-foreground"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        /insights/{post.slug}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/insights/${post.slug}`}>Edit</Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <Link
                          href={`/api/preview/insights?slug=${post.slug}`}
                          prefetch={false}
                        >
                          Open preview
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <p>
                      Tags: {post.tags.length ? post.tags.join(" / ") : "None"}
                    </p>
                    <p>
                      Cover image: {post.coverImageUrl ? "Present" : "Missing"}
                    </p>
                    <p>Published: {formatDate(post.publishedAt)}</p>
                    <p>Last updated: {formatDate(post.updatedAt)}</p>
                  </div>

                  {post.excerpt ? (
                    <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                      {post.excerpt}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 xl:items-end">
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
              </article>
            ))}
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
              <Button asChild variant="outline" className="mt-5">
                <Link href="/admin/insights">Clear filters</Link>
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
