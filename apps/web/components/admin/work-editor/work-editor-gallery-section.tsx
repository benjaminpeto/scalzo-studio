import Image from "next/image";

import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";

import type { WorkEditorGallerySectionProps } from "@/interfaces/admin/work-component-props";
import { buildCmsImageProps, cmsImageSizes } from "@/lib/media-assets/shared";

import { AdminEditorField } from "../shared/admin-editor-field";

export function WorkEditorGallerySection({
  addGalleryUploadRow,
  caseStudy,
  errors,
  galleryUploadRows,
  removeGalleryUploadRow,
  updateGalleryUploadRow,
}: WorkEditorGallerySectionProps) {
  return (
    <AdminEditorField
      error={errors.galleryImages || errors.galleryImageAlts}
      hint="Keep or remove existing gallery images, edit their alt text, and add new uploads."
      label="Gallery"
      optionalLabel="Optional"
    >
      <div className="space-y-4">
        {caseStudy?.galleryImages.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {caseStudy.galleryImages.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="overflow-hidden rounded-[1.35rem] border border-border/70 bg-white/70"
              >
                <input
                  type="hidden"
                  name="existingGalleryUrl"
                  value={image.src}
                />
                <Image
                  src={image.src}
                  alt={
                    image.alt || `${caseStudy.title} gallery image ${index + 1}`
                  }
                  width={image.width}
                  height={image.height}
                  sizes={cmsImageSizes.adminPreview}
                  {...buildCmsImageProps(image)}
                  className="aspect-[1.2] w-full object-cover"
                />
                <div className="space-y-3 border-t border-border/70 px-4 py-3">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="keptGalleryUrl"
                      value={image.src}
                      defaultChecked
                      className="mt-1 size-4 rounded border-border/70 accent-[#111311]"
                    />
                    <div className="text-sm leading-6 text-muted-foreground">
                      Keep this gallery image
                    </div>
                  </label>
                  <Input
                    name="existingGalleryAlt"
                    defaultValue={image.alt}
                    placeholder="Describe this gallery image"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.2rem] border border-dashed border-border/70 bg-white/70 px-4 py-4 text-sm leading-6 text-muted-foreground">
            No gallery images are attached yet.
          </div>
        )}

        <div className="space-y-4 rounded-[1.2rem] border border-border/70 bg-white/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                New gallery uploads
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Each upload needs its own alt text.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={addGalleryUploadRow}
            >
              Add gallery image
            </Button>
          </div>

          <div className="space-y-4">
            {galleryUploadRows.map((row, index) => (
              <div
                key={row.id}
                className="grid gap-4 rounded-[1.1rem] border border-border/70 bg-surface-container-low px-4 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
              >
                <input
                  type="file"
                  name="galleryImage"
                  accept="image/avif,image/jpeg,image/png,image/webp"
                  className="block w-full rounded-[1.15rem] border border-border/70 bg-white/80 px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-primary-foreground"
                />
                <Input
                  name="galleryImageAlt"
                  value={row.alt}
                  onChange={(event) =>
                    updateGalleryUploadRow(row.id, event.target.value)
                  }
                  placeholder={`Describe gallery image ${index + 1}`}
                />
                <div className="flex lg:items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => removeGalleryUploadRow(row.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminEditorField>
  );
}
