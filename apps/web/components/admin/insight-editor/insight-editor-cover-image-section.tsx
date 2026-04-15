import Image from "next/image";

import type { InsightEditorCoverImageSectionProps } from "@/interfaces/admin/insight-component-props";
import { buildDescribedBy } from "@/lib/admin/field";
import { buildCmsImageProps, cmsImageSizes } from "@/lib/media-assets/shared";
import { Input } from "@ui/components/ui/input";

import { AdminEditorField } from "../shared/admin-editor-field";

export function InsightEditorCoverImageSection({
  coverImageId,
  errors,
  post,
}: InsightEditorCoverImageSectionProps) {
  const coverImageAltId = `${coverImageId}-alt`;

  return (
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
            htmlFor={coverImageAltId}
            label="Cover image alt text"
            optionalLabel={
              post?.coverImage ? undefined : "Required with upload"
            }
          >
            <Input
              id={coverImageAltId}
              name="coverImageAlt"
              defaultValue={post?.coverImage?.alt ?? ""}
              aria-invalid={Boolean(errors.coverImageAlt)}
              aria-describedby={buildDescribedBy({
                error: errors.coverImageAlt,
                hint: "Describe the cover image for screen readers and SEO.",
                id: coverImageAltId,
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
  );
}
