import "server-only";

import { cache } from "react";

import { getWorkDetailPageData } from "./get-work-detail-page-data";

export const getResolvedWorkDetailRouteData = cache(
  async (slug: string, isPreview = false) => {
    const detailPageData = await getWorkDetailPageData(slug, {
      includeDraft: isPreview,
    });

    return { detailPageData };
  },
);
