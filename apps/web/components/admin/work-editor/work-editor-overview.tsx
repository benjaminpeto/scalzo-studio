import Link from "next/link";

import type { WorkEditorOverviewProps } from "@/interfaces/admin/component-props";
import { formatUpdatedAt } from "@/lib/admin/format";
import { Button } from "@ui/components/ui/button";

export function WorkEditorOverview({
  caseStudy,
  mode,
  previewPath,
}: WorkEditorOverviewProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_22rem]">
      <div className="rounded-[1.65rem] border border-border/70 bg-[linear-gradient(160deg,rgba(252,205,3,0.15),rgba(255,255,255,0.96)_42%,rgba(241,239,234,0.9))] p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {mode === "create" ? "New case study" : "Case-study editor"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground md:text-4xl">
          {mode === "create"
            ? "Create a new case-study route."
            : (caseStudy?.title ?? "Edit case-study content.")}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Manage the work page narrative, outcome metrics, and supporting assets
          that feed the public case-study experience.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/work">Back to work</Link>
          </Button>
          {previewPath ? (
            <Button asChild variant="ghost" className="rounded-full">
              <Link href={previewPath} prefetch={false}>
                Preview latest
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Status
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
            {caseStudy
              ? caseStudy.published
                ? "Published"
                : "Draft"
              : "Draft by default"}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Route
          </p>
          <p className="mt-3 truncate text-sm font-semibold text-foreground">
            {mode === "create"
              ? "/work/{slug}"
              : `/work/${caseStudy?.slug ?? ""}`}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Last updated
          </p>
          <p className="mt-3 text-sm font-semibold text-foreground">
            {caseStudy
              ? formatUpdatedAt(caseStudy.updatedAt)
              : "Will be set on save"}
          </p>
        </article>
      </div>
    </section>
  );
}
