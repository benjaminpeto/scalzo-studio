import { getInsightDetailPageData } from "@/actions/insights/get-insight-detail-page-data";
import { titleCaseFromSlug } from "@/lib/content/format";
import {
  renderBrandedSocialImage,
  socialImageContentType,
  socialImageSize,
} from "@/lib/seo/social-image";

export const alt = "Scalzo Studio insight";
export const contentType = socialImageContentType;
export const size = socialImageSize;

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const detailPageData = await getInsightDetailPageData(slug);

  return renderBrandedSocialImage({
    eyebrow: "Insight",
    summary:
      detailPageData?.excerpt ??
      "Editorial notes on positioning, content structure, design systems, and trust-building page decisions.",
    title: detailPageData?.title ?? titleCaseFromSlug(slug),
  });
}
