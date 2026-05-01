import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";

import { getResolvedServiceDetailRouteData } from "@/actions/services/get-resolved-service-detail-route-data";
import ServiceDetailFallback from "@/components/services/service-detail-fallback";
import ServiceDetailLayout from "@/components/services/service-detail-layout";
import {
  buildNotFoundRouteMetadata,
  buildRouteMetadata,
} from "@/lib/seo/route-metadata";

interface ServiceDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const detailPageData = await getResolvedServiceDetailRouteData(slug);

  if (!detailPageData) {
    return buildNotFoundRouteMetadata();
  }

  return buildRouteMetadata({
    canonical: `/services/${detailPageData.slug}`,
    description:
      detailPageData.seoDescription ??
      detailPageData.summary ??
      detailPageData.problem,
    locale,
    socialFallbackPath: `/services/${detailPageData.slug}/opengraph-image`,
    socialImageAlt: `${detailPageData.title} service | Scalzo Studio`,
    title:
      detailPageData.seoTitle ??
      `${detailPageData.title} | Services | Scalzo Studio`,
    updatedTime: detailPageData.updatedAt,
  });
}

async function ServiceDetailContent({ slug }: { slug: string }) {
  const detailPageData = await getResolvedServiceDetailRouteData(slug);

  if (!detailPageData) {
    notFound();
  }

  return <ServiceDetailLayout detailPageData={detailPageData} />;
}

async function ResolvedServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<ServiceDetailFallback slug={slug} />}>
      <ServiceDetailContent slug={slug} />
    </Suspense>
  );
}

export default function ServiceDetailPage(props: ServiceDetailPageProps) {
  return (
    <Suspense fallback={<ServiceDetailFallback slug="service-detail" />}>
      <ResolvedServiceDetailPage {...props} />
    </Suspense>
  );
}
