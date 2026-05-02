"use server";

import "server-only";

import { cache } from "react";

import type { Locale } from "@/lib/i18n/routing";

import { getWorkDetailPageData } from "./get-work-detail-page-data";

export const getResolvedWorkDetailRouteData = cache(
  async (slug: string, isPreview = false, locale: Locale = "en") => {
    const detailPageData = await getWorkDetailPageData(slug, {
      includeDraft: isPreview,
      locale,
    });

    return { detailPageData };
  },
);
