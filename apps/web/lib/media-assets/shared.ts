import type { CmsImageAsset } from "@/interfaces/media-assets";

export const defaultCmsImageDimensions = {
  height: 1200,
  width: 1600,
} as const;

export const cmsImageSizes = {
  adminPreview: "(min-width: 1280px) 30vw, 100vw",
  articleCover: "(min-width: 1024px) 45vw, 100vw",
  articleInline: "(min-width: 1024px) 70vw, 100vw",
  articleIndexCard: "(min-width: 1024px) 25vw, 100vw",
  articleIndexFeatured: "(min-width: 1024px) 55vw, 100vw",
  caseStudyCard: "(min-width: 1024px) 50vw, 100vw",
  caseStudyDetailLead: "(min-width: 1024px) 60vw, 100vw",
  caseStudyDetailSecondary: "(min-width: 1024px) 40vw, 100vw",
  serviceRelatedWork: "(min-width: 1024px) 50vw, 100vw",
  testimonialAvatar: "56px",
  testimonialAvatarAdmin: "80px",
} as const;

export function createCmsImageAsset(input: {
  alt: string;
  blurDataUrl?: string | null;
  height?: number | null;
  src: string;
  width?: number | null;
}): CmsImageAsset {
  return {
    alt: input.alt.trim(),
    blurDataUrl: input.blurDataUrl ?? undefined,
    height: input.height ?? defaultCmsImageDimensions.height,
    src: input.src,
    width: input.width ?? defaultCmsImageDimensions.width,
  };
}

export function buildCmsImageProps(asset: CmsImageAsset) {
  return asset.blurDataUrl
    ? {
        blurDataURL: asset.blurDataUrl,
        placeholder: "blur" as const,
      }
    : {
        placeholder: "empty" as const,
      };
}
