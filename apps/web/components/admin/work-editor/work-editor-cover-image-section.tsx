import Image from "next/image";

import type { WorkEditorCoverImageSectionProps } from "@/interfaces/admin/work-component-props";
import { buildDescribedBy } from "@/lib/admin/field";
import { buildCmsImageProps, cmsImageSizes } from "@/lib/media-assets/shared";
import { Input } from "@ui/components/ui/input";

import { AdminEditorField } from "../shared/admin-editor-field";

export function WorkEditorCoverImageSection({
  caseStudy,
  coverImageAltId,
  coverImageId,
  errors,
}: WorkEditorCoverImageSectionProps) {
  return (
    <AdminEditorField
      error={errors.coverImage}
      hint="Upload a replacement cover image. Leave empty to keep the current cover."
      htmlFor={coverImageId}
      label="Cover image"
      optionalLabel="Optional"
    >
      <div className="space-y-4">
        {caseStudy?.coverImage ? (
          <div className="overflow-hidden rounded-[1.35rem] border border-border/70 bg-white/70">
            <Image
              src={caseStudy.coverImage.src}
              alt={caseStudy.coverImage.alt || `${caseStudy.title} cover image`}
              width={caseStudy.coverImage.width}
              height={caseStudy.coverImage.height}
              sizes={cmsImageSizes.adminPreview}
              {...buildCmsImageProps(caseStudy.coverImage)}
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
            caseStudy?.coverImage ? undefined : "Required with upload"
          }
        >
          <Input
            id={coverImageAltId}
            name="coverImageAlt"
            defaultValue={caseStudy?.coverImage?.alt ?? ""}
            aria-invalid={Boolean(errors.coverImageAlt)}
            aria-describedby={buildDescribedBy({
              error: errors.coverImageAlt,
              hint: "Describe the cover image for screen readers and SEO.",
              id: coverImageAltId,
            })}
            placeholder="Describe the cover image"
          />
        </AdminEditorField>

        {caseStudy?.coverImage ? (
          <label className="flex items-start gap-3 rounded-[1.15rem] border border-border/70 bg-white/70 px-4 py-3">
            <input
              type="checkbox"
              name="removeCoverImage"
              value="true"
              className="mt-1 size-4 rounded border-border/70 accent-[#111311]"
            />
            <span className="text-sm leading-6 text-muted-foreground">
              Remove the current cover image if no replacement file is uploaded.
            </span>
          </label>
        ) : null}

        <input
          id={coverImageId}
          type="file"
          name="coverImage"
          accept="image/avif,image/jpeg,image/png,image/webp"
          className="block w-full rounded-[1.15rem] border border-border/70 bg-white/80 px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-primary-foreground"
        />
      </div>
    </AdminEditorField>
  );
}
