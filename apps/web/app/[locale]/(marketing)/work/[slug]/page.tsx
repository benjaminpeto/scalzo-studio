import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";

import { getResolvedWorkDetailRouteData } from "@/actions/work/get-resolved-work-detail-route-data";
import { getWorkDetailPageData } from "@/actions/work/get-work-detail-page-data";
import WorkDetailFallback from "@/components/work/work-detail-fallback";
import WorkDetailLayout from "@/components/work/work-detail-layout";
import { getCurrentUserAdminState } from "@/lib/supabase/auth";
import {
  buildNotFoundRouteMetadata,
  buildRouteMetadata,
} from "@/lib/seo/route-metadata";

interface WorkDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const detailPageData = await getWorkDetailPageData(slug);

  if (!detailPageData) {
    return buildNotFoundRouteMetadata();
  }

  return buildRouteMetadata({
    canonical: `/work/${detailPageData.slug}`,
    description:
      detailPageData.seoDescription ??
      detailPageData.description ??
      detailPageData.outcomes,
    locale,
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
  const preview = await draftMode();
  const { isAdmin } = await getCurrentUserAdminState();
  const isPreview = preview.isEnabled && isAdmin;
  const { detailPageData } = await getResolvedWorkDetailRouteData(
    slug,
    isPreview,
  );

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
  const { locale, slug } = await params;
  setRequestLocale(locale);

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
