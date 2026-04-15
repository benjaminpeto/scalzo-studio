import Image from "next/image";

import { InsightMarkdown } from "@/components/insights/insight-markdown";
import type { InsightEditorMarkdownPreviewSectionProps } from "@/interfaces/admin/insight-component-props";
import { buildDescribedBy } from "@/lib/admin/field";
import { formatUpdatedAt } from "@/lib/admin/format";
import { buildCmsImageProps, cmsImageSizes } from "@/lib/media-assets/shared";
import { Label } from "@ui/components/ui/label";

import { AdminEditorField } from "../shared/admin-editor-field";

export function InsightEditorMarkdownPreviewSection({
  contentId,
  contentMdValue,
  contentTextareaRef,
  errors,
  excerptValue,
  onContentChange,
  post,
  previewTags,
  titleValue,
}: InsightEditorMarkdownPreviewSectionProps) {
  return (
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
  );
}
