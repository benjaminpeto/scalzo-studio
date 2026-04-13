import Image from "next/image";

import { InsightMarkdown } from "@/components/insights/insight-markdown";
import type { InsightEditorContentSectionsProps } from "@/interfaces/admin/component-props";
import { buildDescribedBy } from "@/lib/admin/field";
import { formatUpdatedAt } from "@/lib/admin/format";
import { buildCmsImageProps, cmsImageSizes } from "@/lib/media-assets/shared";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";

import { AdminEditorField } from "../shared/admin-editor-field";
import { AdminEditorTextarea } from "../shared/admin-editor-textarea";

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
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <AdminEditorField
            error={errors.contentMd}
            hint="Write the article in Markdown. The preview uses the same rendering rules as the public article page."
            htmlFor={contentId}
            label="Article body"
          >
            <textarea
              id={contentId}
              ref={contentTextareaRef}
              name="contentMd"
              value={contentMdValue}
              onChange={(event) => onContentChange(event.target.value)}
              aria-invalid={Boolean(errors.contentMd)}
              aria-describedby={buildDescribedBy({
                error: errors.contentMd,
                hint: "Write the article in Markdown. The preview uses the same rendering rules as the public article page.",
                id: contentId,
              })}
              className="input-shell min-h-144 w-full rounded-[1.15rem] border-0 bg-transparent px-4 py-4 font-mono text-sm leading-7 text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden"
              placeholder="# Start writing&#10;&#10;Use markdown headings, lists, quotes, links, and images."
              spellCheck={false}
              required
            />
          </AdminEditorField>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-semibold text-foreground">
                Live preview
              </Label>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Public rendering
              </span>
            </div>
            <div className="rounded-[1.35rem] border border-border/70 bg-white/75 p-4 shadow-[0_16px_44px_rgba(27,28,26,0.04)]">
              <div className="rounded-[1.2rem] border border-border/60 bg-[rgba(250,248,241,0.72)] p-4">
                {post?.coverImage ? (
                  <div className="overflow-hidden rounded-[1.1rem] border border-border/60">
                    <Image
                      src={post.coverImage.src}
                      alt={
                        post.coverImage.alt ||
                        `Cover image for ${titleValue || post.title}`
                      }
                      width={post.coverImage.width}
                      height={post.coverImage.height}
                      sizes={cmsImageSizes.adminPreview}
                      {...buildCmsImageProps(post.coverImage)}
                      className="aspect-[1.15] w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[1.15] items-center justify-center rounded-[1.1rem] border border-dashed border-border/70 bg-surface-container-low text-sm text-muted-foreground">
                    No cover image yet
                  </div>
                )}
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {post
                        ? post.published
                          ? formatUpdatedAt(post.publishedAt)
                          : "Draft preview"
                        : "Unsaved draft"}
                    </p>
                    <h2 className="mt-3 font-display text-[2rem] leading-[0.96] tracking-[-0.04em] text-foreground">
                      {titleValue.trim() || "Untitled article"}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {excerptValue.trim() ||
                        "The excerpt preview updates live as you edit the article summary."}
                    </p>
                    {previewTags.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {previewTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border/70 bg-white px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="max-h-112 overflow-auto rounded-[1.1rem] border border-border/60 bg-white px-5 py-5">
                    <article className="space-y-8">
                      <InsightMarkdown content={contentMdValue} />
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <AdminEditorField
          error={errors.coverImage}
          hint="Upload a replacement cover image. Leave empty to keep the current cover."
          htmlFor={coverImageId}
          label="Cover image"
          optionalLabel="Optional"
        >
          <div className="space-y-4">
            {post?.coverImage ? (
              <div className="overflow-hidden rounded-[1.35rem] border border-border/70 bg-white/70">
                <Image
                  src={post.coverImage.src}
                  alt={post.coverImage.alt || `${post.title} cover image`}
                  width={post.coverImage.width}
                  height={post.coverImage.height}
                  sizes={cmsImageSizes.adminPreview}
                  {...buildCmsImageProps(post.coverImage)}
                  className="aspect-[1.35] w-full object-cover"
                />
              </div>
            ) : null}

            <AdminEditorField
              error={errors.coverImageAlt}
              hint="Describe the cover image for screen readers and SEO."
              htmlFor={`${coverImageId}-alt`}
              label="Cover image alt text"
              optionalLabel={
                post?.coverImage ? undefined : "Required with upload"
              }
            >
              <Input
                id={`${coverImageId}-alt`}
                name="coverImageAlt"
                defaultValue={post?.coverImage?.alt ?? ""}
                aria-invalid={Boolean(errors.coverImageAlt)}
                aria-describedby={buildDescribedBy({
                  error: errors.coverImageAlt,
                  hint: "Describe the cover image for screen readers and SEO.",
                  id: `${coverImageId}-alt`,
                })}
                placeholder="Describe the cover image"
              />
            </AdminEditorField>

            {post?.coverImage ? (
              <label className="flex items-start gap-3 rounded-[1.15rem] border border-border/70 bg-white/70 px-4 py-3">
                <input
                  type="checkbox"
                  name="removeCoverImage"
                  value="true"
                  className="mt-1 size-4 rounded border-border/70 accent-[#111311]"
                />
                <span className="text-sm leading-6 text-muted-foreground">
                  Remove the current cover image if no replacement file is
                  uploaded.
                </span>
              </label>
            ) : null}

            <Input
              id={coverImageId}
              name="coverImage"
              type="file"
              accept="image/avif,image/jpeg,image/png,image/webp"
              aria-invalid={Boolean(errors.coverImage)}
              aria-describedby={buildDescribedBy({
                error: errors.coverImage,
                hint: "Upload a replacement cover image. Leave empty to keep the current cover.",
                id: coverImageId,
              })}
              className="h-auto file:mr-4 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-semibold file:text-background"
            />
          </div>
        </AdminEditorField>
      </section>
    </>
  );
}
