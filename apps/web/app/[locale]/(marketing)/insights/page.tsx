import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { InsightsPageContent } from "@/components/insights/insights-index-layout";
import { InsightsIndexFallback } from "@/components/insights/insights-index-fallback";
import { getMarketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";

interface InsightsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
}

export async function generateMetadata({
  params,
}: InsightsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getMarketingRouteMetadata(locale, "insights");
}

async function ResolvedInsightsPage({
  searchParams,
}: Pick<InsightsPageProps, "searchParams">) {
  const resolvedSearchParams = await searchParams;
  const selectedTag = resolvedSearchParams.tag?.trim()
    ? resolvedSearchParams.tag.trim()
    : null;

  return (
    <Suspense fallback={<InsightsIndexFallback selectedTag={selectedTag} />}>
      <InsightsPageContent selectedTag={selectedTag} />
    </Suspense>
  );
}

export default async function InsightsPage({
  params,
  searchParams,
}: InsightsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<InsightsIndexFallback selectedTag={null} />}>
      <ResolvedInsightsPage searchParams={searchParams} />
    </Suspense>
  );
}
