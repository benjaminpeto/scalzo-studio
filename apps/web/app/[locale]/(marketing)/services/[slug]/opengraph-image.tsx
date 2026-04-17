import { getServiceDetailPageData } from "@/actions/services/get-service-detail-page-data";
import { titleCaseFromSlug } from "@/lib/content/format";
import {
  renderBrandedSocialImage,
  socialImageContentType,
  socialImageSize,
} from "@/lib/seo/social-image";

export const alt = "Scalzo Studio service";
export const contentType = socialImageContentType;
export const size = socialImageSize;

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const detailPageData = await getServiceDetailPageData(slug);

  return renderBrandedSocialImage({
    eyebrow: "Service",
    summary:
      detailPageData?.summary ??
      "Structured service support for clearer positioning, stronger page confidence, and calmer commercial decisions.",
    title: detailPageData?.title ?? titleCaseFromSlug(slug),
  });
}
