import type { InsightEditorMetadataSectionProps } from "@/interfaces/admin/insight-component-props";
import { buildDescribedBy } from "@/lib/admin/field";
import { Input } from "@ui/components/ui/input";

import { AdminEditorField } from "../shared/admin-editor-field";
import { AdminEditorTextarea } from "../shared/admin-editor-textarea";

export function InsightEditorMetadataSection({
  errors,
  excerptId,
  excerptEsId,
  excerptValue,
  onExcerptChange,
  onSlugChange,
  onTagsChange,
  onTitleChange,
  post,
  slugId,
  slugValue,
  tagsId,
  tagsValue,
  titleId,
  titleEsId,
  titleValue,
}: InsightEditorMetadataSectionProps) {
  return (
    <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <AdminEditorField
          error={errors.title}
          hint="Internal and public title for this article."
          htmlFor={titleId}
          label="Title"
        >
          <Input
            id={titleId}
            name="title"
            value={titleValue}
            onChange={(event) => onTitleChange(event.target.value)}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={buildDescribedBy({
              error: errors.title,
              hint: "Internal and public title for this article.",
              id: titleId,
            })}
            placeholder="Why premium service brands need proof before explanation"
            required
          />
        </AdminEditorField>

        <AdminEditorField
          error={errors.slug}
          hint="Lowercase route segment. Leave blank to derive it from the title."
          htmlFor={slugId}
          label="Slug"
        >
          <Input
            id={slugId}
            name="slug"
            value={slugValue}
            onChange={(event) => onSlugChange(event.target.value)}
            aria-invalid={Boolean(errors.slug)}
            aria-describedby={buildDescribedBy({
              error: errors.slug,
              hint: "Lowercase route segment. Leave blank to derive it from the title.",
              id: slugId,
            })}
            placeholder="why-premium-service-brands-need-proof-before-explanation"
            spellCheck={false}
          />
        </AdminEditorField>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <AdminEditorField
          error={errors.excerpt}
          hint="Optional summary shown in the public article hero and article cards."
          htmlFor={excerptId}
          label="Excerpt"
          optionalLabel="Optional"
        >
          <AdminEditorTextarea
            id={excerptId}
            name="excerpt"
            value={excerptValue}
            onChange={(event) => onExcerptChange(event.target.value)}
            aria-invalid={Boolean(errors.excerpt)}
            aria-describedby={buildDescribedBy({
              error: errors.excerpt,
              hint: "Optional summary shown in the public article hero and article cards.",
              id: excerptId,
            })}
            className="min-h-28"
            placeholder="A short editorial summary for cards, the article hero, and SEO fallbacks."
          />
        </AdminEditorField>

        <AdminEditorField
          error={errors.tags}
          hint="Enter one tag per line. Blank lines are ignored."
          htmlFor={tagsId}
          label="Tags"
          optionalLabel="Optional"
        >
          <AdminEditorTextarea
            id={tagsId}
            name="tags"
            value={tagsValue}
            onChange={(event) => onTagsChange(event.target.value)}
            aria-invalid={Boolean(errors.tags)}
            aria-describedby={buildDescribedBy({
              error: errors.tags,
              hint: "Enter one tag per line. Blank lines are ignored.",
              id: tagsId,
            })}
            className="min-h-28"
            placeholder={"Positioning\nTrust\nHomepage strategy"}
          />
        </AdminEditorField>
      </div>

      <div className="mt-5 border-t border-border/50 pt-5">
        <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Spanish (ES)
        </p>

        <div className="grid gap-5 lg:grid-cols-2">
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
              defaultValue={post?.titleEs ?? ""}
              aria-invalid={Boolean(errors.titleEs)}
              aria-describedby={buildDescribedBy({
                error: errors.titleEs,
                hint: "Spanish title shown to Spanish-locale visitors.",
                id: titleEsId,
              })}
              placeholder="Por qué las marcas de servicio premium necesitan prueba antes que explicación"
            />
          </AdminEditorField>

          <AdminEditorField
            error={errors.excerptEs}
            hint="Spanish excerpt shown to Spanish-locale visitors."
            htmlFor={excerptEsId}
            label="Excerpt (ES)"
            optionalLabel="Optional"
          >
            <AdminEditorTextarea
              id={excerptEsId}
              name="excerptEs"
              defaultValue={post?.excerptEs ?? ""}
              aria-invalid={Boolean(errors.excerptEs)}
              aria-describedby={buildDescribedBy({
                error: errors.excerptEs,
                hint: "Spanish excerpt shown to Spanish-locale visitors.",
                id: excerptEsId,
              })}
              className="min-h-28"
              placeholder="Un resumen editorial breve para tarjetas, el hero del artículo y respaldos SEO."
            />
          </AdminEditorField>
        </div>
      </div>
    </section>
  );
}
