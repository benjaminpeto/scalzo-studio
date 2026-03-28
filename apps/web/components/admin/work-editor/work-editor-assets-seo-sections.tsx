import Image from "next/image";

import { Input } from "@ui/components/ui/input";

import type { WorkEditorAssetsSeoSectionsProps } from "@/interfaces/admin/component-props";
import { buildDescribedBy } from "@/lib/admin/field";

import { AdminEditorField } from "../shared/admin-editor-field";
import { AdminEditorTextarea } from "../shared/admin-editor-textarea";

export function WorkEditorAssetsSeoSections({
  caseStudy,
  coverImageId,
  errors,
  galleryImagesId,
  keepAllGalleryImages,
  seoDescriptionId,
  seoTitleId,
}: WorkEditorAssetsSeoSectionsProps) {
  return (
    <>
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <div className="grid gap-6">
          <AdminEditorField
            error={errors.coverImage}
            hint="Upload a replacement cover image. Leave empty to keep the current cover."
            htmlFor={coverImageId}
            label="Cover image"
            optionalLabel="Optional"
          >
            <div className="space-y-4">
              {caseStudy?.coverImageUrl ? (
                <div className="overflow-hidden rounded-[1.35rem] border border-border/70 bg-white/70">
                  <Image
                    src={caseStudy.coverImageUrl}
                    alt={`${caseStudy.title} cover image`}
                    width={1200}
                    height={900}
                    className="aspect-[1.35] w-full object-cover"
                  />
                </div>
              ) : null}

              {caseStudy?.coverImageUrl ? (
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

              <input
                id={coverImageId}
                type="file"
                name="coverImage"
                accept="image/avif,image/jpeg,image/png,image/webp"
                className="block w-full rounded-[1.15rem] border border-border/70 bg-white/80 px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-primary-foreground"
              />
            </div>
          </AdminEditorField>

          <AdminEditorField
            error={errors.galleryImages}
            hint="Keep or remove existing gallery images and append new uploads."
            htmlFor={galleryImagesId}
            label="Gallery"
            optionalLabel="Optional"
          >
            <div className="space-y-4">
              {caseStudy?.galleryUrls.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {caseStudy.galleryUrls.map((url, index) => (
                    <label
                      key={`${url}-${index}`}
                      className="overflow-hidden rounded-[1.35rem] border border-border/70 bg-white/70"
                    >
                      <Image
                        src={url}
                        alt={`${caseStudy.title} gallery image ${index + 1}`}
                        width={1200}
                        height={900}
                        className="aspect-[1.2] w-full object-cover"
                      />
                      <div className="flex items-start gap-3 border-t border-border/70 px-4 py-3">
                        <input
                          type="checkbox"
                          name="existingGalleryUrl"
                          value={url}
                          defaultChecked
                          className="mt-1 size-4 rounded border-border/70 accent-[#111311]"
                        />
                        <div className="text-sm leading-6 text-muted-foreground">
                          Keep this gallery image
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.2rem] border border-dashed border-border/70 bg-white/70 px-4 py-4 text-sm leading-6 text-muted-foreground">
                  No gallery images are attached yet.
                </div>
              )}

              {!keepAllGalleryImages ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  Uncheck any existing image you want removed from the gallery
                  on save.
                </p>
              ) : null}

              <input
                id={galleryImagesId}
                type="file"
                name="galleryImages"
                multiple
                accept="image/avif,image/jpeg,image/png,image/webp"
                className="block w-full rounded-[1.15rem] border border-border/70 bg-white/80 px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-primary-foreground"
              />
            </div>
          </AdminEditorField>
        </div>
      </section>

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
        </div>
      </section>
    </>
  );
}
