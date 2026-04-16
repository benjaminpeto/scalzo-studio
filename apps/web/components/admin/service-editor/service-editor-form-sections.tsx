import { Input } from "@ui/components/ui/input";

import type { ServiceEditorFormSectionsProps } from "@/interfaces/admin/component-props";
import { buildDescribedBy } from "@/lib/admin/field";
import { MarkdownEditor } from "../shared/markdown-editor";

import { AdminEditorField } from "../shared/admin-editor-field";
import { AdminEditorTextarea } from "../shared/admin-editor-textarea";

export function ServiceEditorFormSections({
  contentId,
  deliverablesId,
  errors,
  seoDescriptionId,
  seoTitleId,
  service,
  slugId,
  summaryId,
  titleId,
}: ServiceEditorFormSectionsProps) {
  return (
    <>
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <AdminEditorField
            error={errors.title}
            hint="Internal and public title for this service."
            htmlFor={titleId}
            label="Title"
          >
            <Input
              id={titleId}
              name="title"
              defaultValue={service?.title ?? ""}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={buildDescribedBy({
                error: errors.title,
                hint: "Internal and public title for this service.",
                id: titleId,
              })}
              placeholder="Conversion strategy"
              required
            />
          </AdminEditorField>

          <AdminEditorField
            error={errors.slug}
            hint="Lowercase route segment. Leave blank on create to derive it from the title."
            htmlFor={slugId}
            label="Slug"
          >
            <Input
              id={slugId}
              name="slug"
              defaultValue={service?.slug ?? ""}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={buildDescribedBy({
                error: errors.slug,
                hint: "Lowercase route segment. Leave blank on create to derive it from the title.",
                id: slugId,
              })}
              placeholder="conversion-strategy"
              spellCheck={false}
            />
          </AdminEditorField>
        </div>

        <div className="mt-5">
          <AdminEditorField
            error={errors.summary}
            hint="Short public summary used on index and supporting sections."
            htmlFor={summaryId}
            label="Summary"
            optionalLabel="Optional"
          >
            <AdminEditorTextarea
              id={summaryId}
              name="summary"
              defaultValue={service?.summary ?? ""}
              aria-invalid={Boolean(errors.summary)}
              aria-describedby={buildDescribedBy({
                error: errors.summary,
                hint: "Short public summary used on index and supporting sections.",
                id: summaryId,
              })}
              className="min-h-28"
              placeholder="Position the service in one clear paragraph."
            />
          </AdminEditorField>
        </div>

        <div className="mt-5">
          <AdminEditorField
            error={errors.contentMd}
            hint="Plain markdown only. The public route renders markdown safely without rich HTML input."
            htmlFor={contentId}
            label="Markdown body"
            optionalLabel="Optional"
          >
            <MarkdownEditor
              id={contentId}
              name="contentMd"
              defaultValue={service?.contentMd ?? ""}
              aria-invalid={Boolean(errors.contentMd)}
              aria-describedby={buildDescribedBy({
                error: errors.contentMd,
                hint: "Plain markdown only. The public route renders markdown safely without rich HTML input.",
                id: contentId,
              })}
              className="min-h-88"
              placeholder={
                "## What this service solves\n\nDescribe the problem, approach, and expected shift."
              }
              spellCheck={false}
            />
          </AdminEditorField>
        </div>

        <div className="mt-5">
          <AdminEditorField
            error={errors.deliverables}
            hint="Enter one deliverable per line. Blank lines are ignored."
            htmlFor={deliverablesId}
            label="Deliverables"
            optionalLabel="Optional"
          >
            <AdminEditorTextarea
              id={deliverablesId}
              name="deliverables"
              defaultValue={service?.deliverables.join("\n") ?? ""}
              aria-invalid={Boolean(errors.deliverables)}
              aria-describedby={buildDescribedBy({
                error: errors.deliverables,
                hint: "Enter one deliverable per line. Blank lines are ignored.",
                id: deliverablesId,
              })}
              className="min-h-40"
              placeholder={
                "Audit and diagnosis\nOffer architecture\nLaunch messaging"
              }
            />
          </AdminEditorField>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <div className="grid gap-5">
          <AdminEditorField
            error={errors.seoTitle}
            hint="Optional title override for metadata. Keep it concise and useful."
            htmlFor={seoTitleId}
            label="SEO title"
            optionalLabel="Optional"
          >
            <Input
              id={seoTitleId}
              name="seoTitle"
              defaultValue={service?.seoTitle ?? ""}
              aria-invalid={Boolean(errors.seoTitle)}
              aria-describedby={buildDescribedBy({
                error: errors.seoTitle,
                hint: "Optional title override for metadata. Keep it concise and useful.",
                id: seoTitleId,
              })}
              placeholder="Conversion Strategy | Scalzo Studio"
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
              defaultValue={service?.seoDescription ?? ""}
              aria-invalid={Boolean(errors.seoDescription)}
              aria-describedby={buildDescribedBy({
                error: errors.seoDescription,
                hint: "Optional description override for search and social previews.",
                id: seoDescriptionId,
              })}
              className="min-h-28"
              placeholder="Define what the service is, who it helps, and the commercial shift it supports."
            />
          </AdminEditorField>
        </div>
      </section>
    </>
  );
}
