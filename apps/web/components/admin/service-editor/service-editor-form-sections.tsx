import { Input } from "@ui/components/ui/input";

import type { ServiceEditorFormSectionsProps } from "@/interfaces/admin/component-props";
import { buildDescribedBy } from "@/lib/admin/field";
import { MarkdownEditor } from "../shared/markdown-editor";

import { AdminEditorField } from "../shared/admin-editor-field";
import { AdminEditorTextarea } from "../shared/admin-editor-textarea";

export function ServiceEditorFormSections({
  contentId,
  contentEsId,
  deliverablesId,
  errors,
  seoDescriptionId,
  seoDescriptionEsId,
  seoTitleId,
  seoTitleEsId,
  service,
  slugId,
  summaryId,
  summaryEsId,
  titleId,
  titleEsId,
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
        <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Spanish (ES)
        </p>

        <div className="mt-0">
          <AdminEditorField
            error={errors.titleEs}
            hint="Spanish title shown to Spanish-locale visitors."
            htmlFor={titleEsId}
            label="Title (ES)"
            optionalLabel="Optional"
          >
            <Input
              id={titleEsId}
              name="titleEs"
              defaultValue={service?.titleEs ?? ""}
              aria-invalid={Boolean(errors.titleEs)}
              aria-describedby={buildDescribedBy({
                error: errors.titleEs,
                hint: "Spanish title shown to Spanish-locale visitors.",
                id: titleEsId,
              })}
              placeholder="Estrategia de conversión"
            />
          </AdminEditorField>
        </div>

        <div className="mt-5">
          <AdminEditorField
            error={errors.summaryEs}
            hint="Spanish summary shown to Spanish-locale visitors."
            htmlFor={summaryEsId}
            label="Summary (ES)"
            optionalLabel="Optional"
          >
            <AdminEditorTextarea
              id={summaryEsId}
              name="summaryEs"
              defaultValue={service?.summaryEs ?? ""}
              aria-invalid={Boolean(errors.summaryEs)}
              aria-describedby={buildDescribedBy({
                error: errors.summaryEs,
                hint: "Spanish summary shown to Spanish-locale visitors.",
                id: summaryEsId,
              })}
              className="min-h-28"
              placeholder="Posiciona el servicio en un párrafo claro."
            />
          </AdminEditorField>
        </div>

        <div className="mt-5">
          <AdminEditorField
            error={errors.contentMdEs}
            hint="Spanish markdown body. Leave blank to fall back to the English version."
            htmlFor={contentEsId}
            label="Markdown body (ES)"
            optionalLabel="Optional"
          >
            <MarkdownEditor
              id={contentEsId}
              name="contentMdEs"
              defaultValue={service?.contentMdEs ?? ""}
              aria-invalid={Boolean(errors.contentMdEs)}
              aria-describedby={buildDescribedBy({
                error: errors.contentMdEs,
                hint: "Spanish markdown body. Leave blank to fall back to the English version.",
                id: contentEsId,
              })}
              className="min-h-88"
              placeholder={
                "## Qué resuelve este servicio\n\nDescribe el problema, el enfoque y el cambio esperado."
              }
              spellCheck={false}
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

          <AdminEditorField
            error={errors.seoTitleEs}
            hint="Spanish SEO title override. Leave blank to fall back to the English version."
            htmlFor={seoTitleEsId}
            label="SEO title (ES)"
            optionalLabel="Optional"
          >
            <Input
              id={seoTitleEsId}
              name="seoTitleEs"
              defaultValue={service?.seoTitleEs ?? ""}
              aria-invalid={Boolean(errors.seoTitleEs)}
              aria-describedby={buildDescribedBy({
                error: errors.seoTitleEs,
                hint: "Spanish SEO title override. Leave blank to fall back to the English version.",
                id: seoTitleEsId,
              })}
              placeholder="Estrategia de conversión | Scalzo Studio"
            />
          </AdminEditorField>

          <AdminEditorField
            error={errors.seoDescriptionEs}
            hint="Spanish SEO description override. Leave blank to fall back to the English version."
            htmlFor={seoDescriptionEsId}
            label="SEO description (ES)"
            optionalLabel="Optional"
          >
            <AdminEditorTextarea
              id={seoDescriptionEsId}
              name="seoDescriptionEs"
              defaultValue={service?.seoDescriptionEs ?? ""}
              aria-invalid={Boolean(errors.seoDescriptionEs)}
              aria-describedby={buildDescribedBy({
                error: errors.seoDescriptionEs,
                hint: "Spanish SEO description override. Leave blank to fall back to the English version.",
                id: seoDescriptionEsId,
              })}
              className="min-h-28"
              placeholder="Define qué es el servicio, a quién ayuda y el cambio comercial que sustenta."
            />
          </AdminEditorField>
        </div>
      </section>
    </>
  );
}
