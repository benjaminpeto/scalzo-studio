import "server-only";

import { draftMode } from "next/headers";
import { cache } from "react";

import { getCurrentUserAdminState } from "@/lib/supabase/auth";

import { getInsightDetailPageData } from "./get-insight-detail-page-data";

export const getResolvedInsightDetailRouteData = cache(async (slug: string) => {
  const preview = await draftMode();
  const { isAdmin } = await getCurrentUserAdminState();
  const isPreview = preview.isEnabled && isAdmin;
  const detailPageData = await getInsightDetailPageData(slug, {
    includeDraft: isPreview,
  });

  return {
    detailPageData,
    isPreview,
  };
});
