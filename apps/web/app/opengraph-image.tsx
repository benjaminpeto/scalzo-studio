import {
  renderBrandedSocialImage,
  socialImageContentType,
  socialImageSize,
} from "@/lib/seo/social-image";

export const alt = "Scalzo Studio";
export const contentType = socialImageContentType;
export const size = socialImageSize;

export default function OpenGraphImage() {
  return renderBrandedSocialImage({
    eyebrow: "Scalzo Studio",
    summary:
      "Editorial product, brand, and content design for growing businesses in the Canary Islands and beyond.",
    title: "Clarity that feels established in the first impression.",
  });
}
