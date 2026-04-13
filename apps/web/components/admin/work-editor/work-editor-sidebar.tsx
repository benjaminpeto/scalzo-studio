import Link from "next/link";

import type { WorkEditorSidebarProps } from "@/interfaces/admin/component-props";
import { formatUpdatedAt } from "@/lib/admin/format";
import { Button } from "@ui/components/ui/button";

import { AdminPublishField } from "../shared/admin-publish-field";
import { AdminSubmitButton } from "../shared/admin-submit-button";

export function WorkEditorSidebar({
  caseStudy,
  currentPath,
  metricRows,
  mode,
}: WorkEditorSidebarProps) {
  return (
    <aside className="space-y-4">
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Publishing
        </p>
        <div className="mt-4">
          <AdminPublishField
            copy="Saving from the editor keeps `published` and `published_at` aligned with the public work routes."
            defaultChecked={caseStudy?.published ?? false}
          />
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Operational notes
        </p>
        <dl className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          <div>
            <dt className="font-semibold text-foreground">Admin route</dt>
            <dd className="break-all">{currentPath}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Public route</dt>
            <dd className="break-all">
              {mode === "create"
                ? "Assigned after slug validation and save"
                : `/work/${caseStudy?.slug ?? ""}`}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Published at</dt>
            <dd>
              {caseStudy?.publishedAt
                ? formatUpdatedAt(caseStudy.publishedAt)
                : mode === "create"
                  ? "Will be set when published"
                  : "Not published"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Asset status
        </p>
        <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          <p>Cover image: {caseStudy?.coverImage ? "Present" : "Missing"}</p>
          <p>Gallery items: {caseStudy?.galleryImages.length ?? 0}</p>
          <p>Metrics rows: {caseStudy?.metrics.length ?? metricRows.length}</p>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Save
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Saving revalidates the public work index, the case-study detail route,
          and the admin work listing.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <AdminSubmitButton createLabel="Create case study" mode={mode} />
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/work">Cancel</Link>
          </Button>
        </div>
      </section>
    </aside>
  );
}
