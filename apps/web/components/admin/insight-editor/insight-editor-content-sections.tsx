import type { InsightEditorContentSectionsProps } from "@/interfaces/admin/insight-component-props";
import { buildDescribedBy } from "@/lib/admin/field";

import { AdminEditorField } from "../shared/admin-editor-field";
import { MarkdownEditor } from "../shared/markdown-editor";
import { InsightEditorCoverImageSection } from "./insight-editor-cover-image-section";
import { InsightEditorMarkdownPreviewSection } from "./insight-editor-markdown-preview-section";
import { InsightEditorMetadataSection } from "./insight-editor-metadata-section";

export function InsightEditorContentSections({
  contentId,
  contentEsId,
  contentMdValue,
  contentTextareaRef,
  coverImageId,
  errors,
  excerptId,
  excerptEsId,
  excerptValue,
  onContentChange,
  onExcerptChange,
  onSlugChange,
  onTagsChange,
  onTitleChange,
  post,
  previewTags,
  slugId,
  slugValue,
  tagsId,
  tagsValue,
  titleId,
  titleEsId,
  titleValue,
}: InsightEditorContentSectionsProps) {
  return (
    <>
      <InsightEditorMetadataSection
        errors={errors}
        excerptId={excerptId}
        excerptEsId={excerptEsId}
        excerptValue={excerptValue}
        onExcerptChange={onExcerptChange}
        onSlugChange={onSlugChange}
        onTagsChange={onTagsChange}
        onTitleChange={onTitleChange}
        post={post}
        slugId={slugId}
        slugValue={slugValue}
        tagsId={tagsId}
        tagsValue={tagsValue}
        titleId={titleId}
        titleEsId={titleEsId}
        titleValue={titleValue}
      />

      <InsightEditorMarkdownPreviewSection
        contentId={contentId}
        contentMdValue={contentMdValue}
        contentTextareaRef={contentTextareaRef}
        errors={errors}
        excerptValue={excerptValue}
        onContentChange={onContentChange}
        post={post}
        previewTags={previewTags}
        titleValue={titleValue}
      />

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Spanish (ES)
        </p>

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
            defaultValue={post?.contentMdEs ?? ""}
            aria-invalid={Boolean(errors.contentMdEs)}
            aria-describedby={buildDescribedBy({
              error: errors.contentMdEs,
              hint: "Spanish markdown body. Leave blank to fall back to the English version.",
              id: contentEsId,
            })}
            className="min-h-88"
            placeholder={
              "## Por qué las marcas de servicio premium necesitan prueba antes que explicación\n\nDescribe el argumento aquí."
            }
            spellCheck={false}
          />
        </AdminEditorField>
      </section>

      <InsightEditorCoverImageSection
        coverImageId={coverImageId}
        errors={errors}
        post={post}
      />
    </>
  );
}
