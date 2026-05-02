"use server";

import "server-only";

import { cache } from "react";

import type { Locale } from "@/lib/i18n/routing";

import { getInsightDetailPageData } from "./get-insight-detail-page-data";

export const getResolvedInsightDetailRouteData = cache(
  async (slug: string, isPreview = false, locale: Locale = "en") => {
    const detailPageData = await getInsightDetailPageData(slug, {
      includeDraft: isPreview,
      locale,
    });

    return { detailPageData };
  },
);
