import type { InsightEditorSidebarProps } from "@/interfaces/admin/component-props";
import { buildDescribedBy } from "@/lib/admin/field";
import { Input } from "@ui/components/ui/input";

import { AdminPublishField } from "../shared/admin-publish-field";
import { AdminSubmitButton } from "../shared/admin-submit-button";
import { AdminEditorField } from "../shared/admin-editor-field";
import { AdminEditorTextarea } from "../shared/admin-editor-textarea";

export function InsightEditorSidebar({
  currentPath,
  errors,
  mode,
  onSeoDescriptionChange,
  onSeoTitleChange,
  postId,
  publicPath,
  published,
  seoDescriptionId,
  seoDescriptionValue,
  seoTitleId,
  seoTitleValue,
}: InsightEditorSidebarProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <AdminPublishField
          copy="Published posts appear on the public insights index and article routes after save and revalidation."
          defaultChecked={published ?? false}
        />
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <div className="space-y-5">
          <AdminEditorField
            error={errors.seoTitle}
            hint="Optional title override for search and social previews."
            htmlFor={seoTitleId}
            label="SEO title"
            optionalLabel="Optional"
          >
            <Input
              id={seoTitleId}
              name="seoTitle"
              value={seoTitleValue}
              onChange={(event) => onSeoTitleChange(event.target.value)}
              aria-invalid={Boolean(errors.seoTitle)}
              aria-describedby={buildDescribedBy({
                error: errors.seoTitle,
                hint: "Optional title override for search and social previews.",
                id: seoTitleId,
              })}
              placeholder="Article-specific search title"
            />
          </AdminEditorField>

          <AdminEditorField
            error={errors.seoDescription}
            hint="Optional description override for search and social previews."
            htmlFor={seoDescriptionId}
            label="SEO description"
            optionalLabel="Optional"
          >
            <AdminEditorTextarea
              id={seoDescriptionId}
              name="seoDescription"
              value={seoDescriptionValue}
              onChange={(event) => onSeoDescriptionChange(event.target.value)}
              aria-invalid={Boolean(errors.seoDescription)}
              aria-describedby={buildDescribedBy({
                error: errors.seoDescription,
                hint: "Optional description override for search and social previews.",
                id: seoDescriptionId,
              })}
              className="min-h-32"
              placeholder="Description used for search and social cards."
            />
          </AdminEditorField>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Editor route
        </p>
        <dl className="mt-4 space-y-4">
          <div className="border-b border-border/60 pb-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Admin path
            </dt>
            <dd className="mt-2 break-all text-sm leading-6 text-foreground">
              {currentPath}
            </dd>
          </div>
          <div className="border-b border-border/60 pb-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Public path
            </dt>
            <dd className="mt-2 break-all text-sm leading-6 text-foreground">
              {publicPath}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Post ID
            </dt>
            <dd className="mt-2 break-all text-sm leading-6 text-foreground">
              {postId ?? "Assigned after create"}
            </dd>
          </div>
        </dl>
      </section>

      <div className="flex justify-end">
        <AdminSubmitButton createLabel="Create insight" mode={mode} />
      </div>
    </div>
  );
}
