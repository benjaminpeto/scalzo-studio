import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getAdminCaseStudyBySlug } from "@/actions/admin/work/server";
import { Button } from "@ui/components/ui/button";

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

export default async function AdminWorkPlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();

  const { slug } = await params;
  const caseStudy = await getAdminCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(160deg,rgba(252,205,3,0.14),rgba(255,255,255,0.96)_40%,rgba(241,239,234,0.92))] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Case-study editor shell
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
          {caseStudy.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          This placeholder confirms the routing, record lookup, and preview path
          before the full case-study editor lands in <code>ST-039</code>.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Slug
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
            {caseStudy.slug}
          </p>
        </article>
        <article className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Publish state
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
            {caseStudy.published ? "Published" : "Draft"}
          </p>
        </article>
        <article className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Last updated
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
            {formatUpdatedAt(caseStudy.updatedAt)}
          </p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Client
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
            {caseStudy.clientName || "Not set yet"}
          </p>
        </article>
        <article className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Industry
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
            {caseStudy.industry || "Not set yet"}
          </p>
        </article>
        <article className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Published at
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
            {caseStudy.publishedAt
              ? formatUpdatedAt(caseStudy.publishedAt)
              : "Not published"}
          </p>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
          Asset readiness
        </h2>
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <p>Cover image: {caseStudy.coverImageUrl ? "Present" : "Missing"}</p>
          <p>Gallery items: {caseStudy.galleryCount}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/work">Back to work</Link>
          </Button>
          {caseStudy.published ? (
            <Button asChild variant="outline">
              <Link href={`/work/${caseStudy.slug}`}>Preview public page</Link>
            </Button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
