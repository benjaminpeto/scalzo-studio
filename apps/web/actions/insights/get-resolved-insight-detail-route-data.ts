"use server";

import "server-only";

import { cache } from "react";

import { getInsightDetailPageData } from "./get-insight-detail-page-data";

export const getResolvedInsightDetailRouteData = cache(
  async (slug: string, isPreview = false) => {
    const detailPageData = await getInsightDetailPageData(slug, {
      includeDraft: isPreview,
    });

    return { detailPageData };
  },
);
