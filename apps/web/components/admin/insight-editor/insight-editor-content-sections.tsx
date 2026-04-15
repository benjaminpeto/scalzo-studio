import type { InsightEditorContentSectionsProps } from "@/interfaces/admin/insight-component-props";

import { InsightEditorCoverImageSection } from "./insight-editor-cover-image-section";
import { InsightEditorMarkdownPreviewSection } from "./insight-editor-markdown-preview-section";
import { InsightEditorMetadataSection } from "./insight-editor-metadata-section";

export function InsightEditorContentSections({
  contentId,
  contentMdValue,
  contentTextareaRef,
  coverImageId,
  errors,
  excerptId,
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
  titleValue,
}: InsightEditorContentSectionsProps) {
  return (
    <>
      <InsightEditorMetadataSection
        errors={errors}
        excerptId={excerptId}
        excerptValue={excerptValue}
        onExcerptChange={onExcerptChange}
        onSlugChange={onSlugChange}
        onTagsChange={onTagsChange}
        onTitleChange={onTitleChange}
        slugId={slugId}
        slugValue={slugValue}
        tagsId={tagsId}
        tagsValue={tagsValue}
        titleId={titleId}
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

      <InsightEditorCoverImageSection
        coverImageId={coverImageId}
        errors={errors}
        post={post}
      />
    </>
  );
}
