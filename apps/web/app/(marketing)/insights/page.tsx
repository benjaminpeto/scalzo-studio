import { Suspense } from "react";

import { InsightsPageContent } from "@/components/insights/insights-index-layout";
import { InsightsIndexFallback } from "@/components/insights/insights-index-fallback";
import { marketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";

interface InsightsPageProps {
  searchParams: Promise<{
    tag?: string;
  }>;
}

export const metadata = marketingRouteMetadata.insights;

async function ResolvedInsightsPage({ searchParams }: InsightsPageProps) {
  const params = await searchParams;
  const selectedTag = params.tag?.trim() ? params.tag.trim() : null;

  return (
    <Suspense fallback={<InsightsIndexFallback selectedTag={selectedTag} />}>
      <InsightsPageContent selectedTag={selectedTag} />
    </Suspense>
  );
}

export default function InsightsPage(props: InsightsPageProps) {
  return (
    <Suspense fallback={<InsightsIndexFallback selectedTag={null} />}>
      <ResolvedInsightsPage {...props} />
    </Suspense>
  );
}
