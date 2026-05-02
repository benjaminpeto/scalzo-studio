import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";

import { getInsightDetailPageData } from "@/actions/insights/get-insight-detail-page-data";
import { getResolvedInsightDetailRouteData } from "@/actions/insights/get-resolved-insight-detail-route-data";
import InsightDetailFallback from "@/components/insights/insight-detail-fallback";
import InsightDetailLayout from "@/components/insights/insight-detail-layout";
import type { Locale } from "@/lib/i18n/routing";
import { getCurrentUserAdminState } from "@/lib/supabase/auth";
import {
  buildNotFoundRouteMetadata,
  buildRouteMetadata,
} from "@/lib/seo/route-metadata";
import { getDetailSectionLabel } from "@/lib/seo/marketing-route-metadata";

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
  const detailPageData = await getInsightDetailPageData(slug, {
    locale: locale as Locale,
  });

  if (!detailPageData) {
    return buildNotFoundRouteMetadata(locale);
  }

  const preview = await draftMode();
  const { isAdmin } = await getCurrentUserAdminState();
  const isPreview = preview.isEnabled && isAdmin;

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
      `${detailPageData.title} | ${getDetailSectionLabel(locale, "insights")} | Scalzo Studio`,
    updatedTime: detailPageData.updatedAt,
  });
}

async function InsightDetailContent({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const preview = await draftMode();
  const { isAdmin } = await getCurrentUserAdminState();
  const isPreview = preview.isEnabled && isAdmin;
  const { detailPageData } = await getResolvedInsightDetailRouteData(
    slug,
    isPreview,
    locale,
  );

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
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<InsightDetailFallback slug={slug} />}>
      <InsightDetailContent locale={locale as Locale} slug={slug} />
    </Suspense>
  );
}

export default function InsightDetailPage(props: InsightDetailPageProps) {
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
