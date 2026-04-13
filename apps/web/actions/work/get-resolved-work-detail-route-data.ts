import "server-only";

import { draftMode } from "next/headers";
import { cache } from "react";

import { getCurrentUserAdminState } from "@/lib/supabase/auth";

import { getWorkDetailPageData } from "./get-work-detail-page-data";

export const getResolvedWorkDetailRouteData = cache(async (slug: string) => {
  const preview = await draftMode();
  const { isAdmin } = await getCurrentUserAdminState();
  const isPreview = preview.isEnabled && isAdmin;
  const detailPageData = await getWorkDetailPageData(slug, {
    includeDraft: isPreview,
  });

  return {
    detailPageData,
    isPreview,
  };
});
