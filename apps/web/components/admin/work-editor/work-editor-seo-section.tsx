import { Input } from "@ui/components/ui/input";

import type { WorkEditorSeoSectionProps } from "@/interfaces/admin/work-component-props";
import { buildDescribedBy } from "@/lib/admin/field";

import { AdminEditorField } from "../shared/admin-editor-field";
import { AdminEditorTextarea } from "../shared/admin-editor-textarea";

export function WorkEditorSeoSection({
  caseStudy,
  errors,
  seoDescriptionId,
  seoDescriptionEsId,
  seoTitleId,
  seoTitleEsId,
}: WorkEditorSeoSectionProps) {
  return (
    <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
      <div className="grid gap-5">
        <AdminEditorField
          error={errors.seoTitle}
          hint="Optional title override for search and social metadata."
          htmlFor={seoTitleId}
          label="SEO title"
          optionalLabel="Optional"
        >
          <Input
            id={seoTitleId}
            name="seoTitle"
            defaultValue={caseStudy?.seoTitle ?? ""}
            aria-invalid={Boolean(errors.seoTitle)}
            aria-describedby={buildDescribedBy({
              error: errors.seoTitle,
              hint: "Optional title override for search and social metadata.",
              id: seoTitleId,
            })}
            placeholder="Coastal Hospitality Relaunch | Work | Scalzo Studio"
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
            defaultValue={caseStudy?.seoDescription ?? ""}
            aria-invalid={Boolean(errors.seoDescription)}
            aria-describedby={buildDescribedBy({
              error: errors.seoDescription,
              hint: "Optional description override for search and social previews.",
              id: seoDescriptionId,
            })}
            className="min-h-28"
            placeholder="Summarize the page shift and the commercial outcome in one concise paragraph."
          />
        </AdminEditorField>

        <AdminEditorField
          error={errors.seoTitleEs}
          hint="Spanish SEO title. Leave blank to fall back to the English version."
          htmlFor={seoTitleEsId}
          label="SEO title (ES)"
          optionalLabel="Optional"
        >
          <Input
            id={seoTitleEsId}
            name="seoTitleEs"
            defaultValue={caseStudy?.seoTitleEs ?? ""}
            aria-invalid={Boolean(errors.seoTitleEs)}
            aria-describedby={buildDescribedBy({
              error: errors.seoTitleEs,
              hint: "Spanish SEO title. Leave blank to fall back to the English version.",
              id: seoTitleEsId,
            })}
            placeholder="Relanzamiento Hospitalidad Costera | Trabajo | Scalzo Studio"
          />
        </AdminEditorField>

        <AdminEditorField
          error={errors.seoDescriptionEs}
          hint="Spanish SEO description. Leave blank to fall back to the English version."
          htmlFor={seoDescriptionEsId}
          label="SEO description (ES)"
          optionalLabel="Optional"
        >
          <AdminEditorTextarea
            id={seoDescriptionEsId}
            name="seoDescriptionEs"
            defaultValue={caseStudy?.seoDescriptionEs ?? ""}
            aria-invalid={Boolean(errors.seoDescriptionEs)}
            aria-describedby={buildDescribedBy({
              error: errors.seoDescriptionEs,
              hint: "Spanish SEO description. Leave blank to fall back to the English version.",
              id: seoDescriptionEsId,
            })}
            className="min-h-28"
            placeholder="Resume el cambio de página y el resultado comercial en un párrafo conciso."
          />
        </AdminEditorField>
      </div>
    </section>
  );
}
