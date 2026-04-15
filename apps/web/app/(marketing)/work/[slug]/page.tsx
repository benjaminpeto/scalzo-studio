import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getResolvedWorkDetailRouteData } from "@/actions/work/get-resolved-work-detail-route-data";
import WorkDetailFallback from "@/components/work/work-detail-fallback";
import WorkDetailLayout from "@/components/work/work-detail-layout";
import {
  buildNotFoundRouteMetadata,
  buildRouteMetadata,
} from "@/lib/seo/route-metadata";

interface WorkDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { detailPageData, isPreview } =
    await getResolvedWorkDetailRouteData(slug);

  if (!detailPageData) {
    return buildNotFoundRouteMetadata();
  }

  return buildRouteMetadata({
    canonical: `/work/${detailPageData.slug}`,
    description:
      detailPageData.seoDescription ??
      detailPageData.description ??
      detailPageData.outcomes,
    noIndex: isPreview,
    publishedTime: detailPageData.publishedAt,
    socialFallbackPath: `/work/${detailPageData.slug}/opengraph-image`,
    socialImage: detailPageData.image?.src ?? null,
    socialImageAlt: detailPageData.image?.alt,
    title:
      detailPageData.seoTitle ??
      `${detailPageData.title} | Work | Scalzo Studio`,
    updatedTime: detailPageData.updatedAt,
  });
}

async function WorkDetailContent({ slug }: { slug: string }) {
  const { detailPageData, isPreview } =
    await getResolvedWorkDetailRouteData(slug);

  if (!detailPageData) {
    notFound();
  }

  return (
    <WorkDetailLayout
      detailPageData={detailPageData}
      isPreview={isPreview}
      previewExitHref={
        isPreview
          ? `/api/preview/disable?next=${encodeURIComponent(
              detailPageData.published
                ? `/work/${detailPageData.slug}`
                : "/admin/work",
            )}`
          : null
      }
    />
  );
}

async function ResolvedWorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<WorkDetailFallback slug={slug} />}>
      <WorkDetailContent slug={slug} />
    </Suspense>
  );
}

export default function WorkDetailPage(props: WorkDetailPageProps) {
  return (
    <Suspense fallback={<WorkDetailFallback slug="featured-1" />}>
      <ResolvedWorkDetailPage {...props} />
    </Suspense>
  );
}
