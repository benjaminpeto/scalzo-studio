import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";

import { getResolvedInsightDetailRouteData } from "@/actions/insights/get-resolved-insight-detail-route-data";
import InsightDetailFallback from "@/components/insights/insight-detail-fallback";
import InsightDetailLayout from "@/components/insights/insight-detail-layout";
import {
  buildNotFoundRouteMetadata,
  buildRouteMetadata,
} from "@/lib/seo/route-metadata";

interface InsightDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: InsightDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const { detailPageData, isPreview } =
    await getResolvedInsightDetailRouteData(slug);

  if (!detailPageData) {
    return buildNotFoundRouteMetadata();
  }

  return buildRouteMetadata({
    canonical: `/insights/${detailPageData.slug}`,
    description:
      detailPageData.seoDescription ??
      detailPageData.excerpt ??
      detailPageData.content,
    locale,
    noIndex: isPreview,
    openGraphType: "article",
    publishedTime: detailPageData.publishedAt,
    socialFallbackPath: `/insights/${detailPageData.slug}/opengraph-image`,
    socialImage: detailPageData.image?.src ?? null,
    socialImageAlt: detailPageData.image?.alt,
    title:
      detailPageData.seoTitle ??
      `${detailPageData.title} | Insights | Scalzo Studio`,
    updatedTime: detailPageData.updatedAt,
  });
}

async function InsightDetailContent({ slug }: { slug: string }) {
  const { detailPageData, isPreview } =
    await getResolvedInsightDetailRouteData(slug);

  if (!detailPageData) {
    notFound();
  }

  return (
    <InsightDetailLayout
      detailPageData={detailPageData}
      isPreview={isPreview}
      previewExitHref={
        isPreview
          ? `/api/preview/disable?next=${encodeURIComponent(
              detailPageData.published
                ? `/insights/${detailPageData.slug}`
                : "/admin/insights",
            )}`
          : null
      }
    />
  );
}

async function ResolvedInsightDetailPage({ params }: InsightDetailPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<InsightDetailFallback slug={slug} />}>
      <InsightDetailContent slug={slug} />
    </Suspense>
  );
}

export default async function InsightDetailPage(props: InsightDetailPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <Suspense
      fallback={
        <InsightDetailFallback slug="why-premium-service-brands-need-proof-before-explanation" />
      }
    >
      <ResolvedInsightDetailPage {...props} />
    </Suspense>
  );
}
