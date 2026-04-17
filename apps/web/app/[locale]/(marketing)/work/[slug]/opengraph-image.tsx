import { getWorkDetailPageData } from "@/actions/work/get-work-detail-page-data";
import { titleCaseFromSlug } from "@/lib/content/format";
import {
  renderBrandedSocialImage,
  socialImageContentType,
  socialImageSize,
} from "@/lib/seo/social-image";

export const alt = "Scalzo Studio case study";
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
  const detailPageData = await getWorkDetailPageData(slug);

  return renderBrandedSocialImage({
    eyebrow: "Case Study",
    summary:
      detailPageData?.description ??
      "Published project work showing how stronger positioning and design direction improve the first impression.",
    title: detailPageData?.title ?? titleCaseFromSlug(slug),
  });
}
