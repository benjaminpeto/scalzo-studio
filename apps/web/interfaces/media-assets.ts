export type CmsManagedImageKind =
  | "case-study-cover"
  | "case-study-gallery"
  | "insight-content"
  | "insight-cover"
  | "testimonial-avatar";

export interface CmsImageAsset {
  alt: string;
  blurDataUrl?: string;
  height: number;
  src: string;
  width: number;
}
