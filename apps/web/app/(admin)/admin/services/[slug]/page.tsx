import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getAdminServiceBySlug } from "@/actions/admin/services/server";
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

export default async function AdminServiceEditorPlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();

  const { slug } = await params;
  const service = await getAdminServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(160deg,rgba(252,205,3,0.14),rgba(255,255,255,0.96)_40%,rgba(241,239,234,0.92))] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Service editor shell
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
          {service.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          This route now exists so the services list has a valid edit
          destination. Full create and edit form work lands in{" "}
          <code>ST-037</code>.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Slug
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
            {service.slug}
          </p>
        </article>
        <article className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Publish state
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
            {service.published ? "Published" : "Draft"}
          </p>
        </article>
        <article className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Last updated
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
            {formatUpdatedAt(service.updatedAt)}
          </p>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
          Next slice
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          The next ticket adds the actual editor: slug validation, summary and
          markdown fields, deliverables, SEO fields, and save flows. This page
          keeps the route structure stable in advance.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/services">Back to services</Link>
          </Button>
          {service.published ? (
            <Button asChild variant="outline">
              <Link href={`/services/${service.slug}`}>
                Preview public page
              </Link>
            </Button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
