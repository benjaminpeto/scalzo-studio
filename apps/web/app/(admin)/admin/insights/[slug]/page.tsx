import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getAdminInsightBySlug } from "@/actions/admin/insights/server";
import { Button } from "@ui/components/ui/button";

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

export default async function AdminInsightPlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();

  const { slug } = await params;
  const post = await getAdminInsightBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_22rem]">
        <div className="rounded-[1.65rem] border border-border/70 bg-[linear-gradient(160deg,rgba(252,205,3,0.15),rgba(255,255,255,0.96)_42%,rgba(241,239,234,0.9))] p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Insight editor
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            The full insight editor lands in the next ticket. This placeholder
            confirms the record, route, publish state, and preview access for
            the selected post.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/admin/insights">Back to insights</Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-full">
              <Link
                href={`/api/preview/insights?slug=${post.slug}`}
                prefetch={false}
              >
                Preview latest
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Status
            </p>
            <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
              {post.published ? "Published" : "Draft"}
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Route
            </p>
            <p className="mt-3 truncate text-sm font-semibold text-foreground">
              /insights/{post.slug}
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Last updated
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {formatDate(post.updatedAt)}
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Record summary
          </p>
          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.2rem] border border-border/70 bg-white/70 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Tags
              </dt>
              <dd className="mt-3 text-sm leading-6 text-foreground">
                {post.tags.length ? post.tags.join(" / ") : "No tags yet"}
              </dd>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-white/70 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Cover image
              </dt>
              <dd className="mt-3 text-sm leading-6 text-foreground">
                {post.coverImageUrl ? "Present" : "Missing"}
              </dd>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-white/70 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Published date
              </dt>
              <dd className="mt-3 text-sm leading-6 text-foreground">
                {formatDate(post.publishedAt)}
              </dd>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-white/70 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Post ID
              </dt>
              <dd className="mt-3 break-all text-sm leading-6 text-foreground">
                {post.id}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Excerpt
          </p>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            {post.excerpt || "No excerpt has been written for this post yet."}
          </p>
        </article>
      </section>
    </div>
  );
}
