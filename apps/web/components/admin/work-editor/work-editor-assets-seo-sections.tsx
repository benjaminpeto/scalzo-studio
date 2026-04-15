import type { WorkEditorAssetsSeoSectionsProps } from "@/interfaces/admin/work-component-props";

import { WorkEditorCoverImageSection } from "./work-editor-cover-image-section";
import { WorkEditorGallerySection } from "./work-editor-gallery-section";
import { WorkEditorSeoSection } from "./work-editor-seo-section";

export function WorkEditorAssetsSeoSections({
  addGalleryUploadRow,
  caseStudy,
  coverImageId,
  coverImageAltId,
  errors,
  galleryUploadRows,
  removeGalleryUploadRow,
  seoDescriptionId,
  seoTitleId,
  updateGalleryUploadRow,
}: WorkEditorAssetsSeoSectionsProps) {
  return (
    <>
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <div className="grid gap-6">
          <WorkEditorCoverImageSection
            caseStudy={caseStudy}
            coverImageAltId={coverImageAltId}
            coverImageId={coverImageId}
            errors={errors}
          />

          <WorkEditorGallerySection
            addGalleryUploadRow={addGalleryUploadRow}
            caseStudy={caseStudy}
            errors={errors}
            galleryUploadRows={galleryUploadRows}
            removeGalleryUploadRow={removeGalleryUploadRow}
            updateGalleryUploadRow={updateGalleryUploadRow}
          />
        </div>
      </section>

      <WorkEditorSeoSection
        caseStudy={caseStudy}
        errors={errors}
        seoDescriptionId={seoDescriptionId}
        seoTitleId={seoTitleId}
      />
    </>
  );
}
