"use server";

import "server-only";

import { cache } from "react";

import type { Locale } from "@/lib/i18n/routing";

import { getServiceDetailPageData } from "./get-service-detail-page-data";

export const getResolvedServiceDetailRouteData = cache(
  async (slug: string, locale: Locale = "en") =>
    getServiceDetailPageData(slug, locale),
);
