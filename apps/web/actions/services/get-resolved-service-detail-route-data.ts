"use server";

import "server-only";

import { cache } from "react";

import { getServiceDetailPageData } from "./get-service-detail-page-data";

export const getResolvedServiceDetailRouteData = cache(async (slug: string) =>
  getServiceDetailPageData(slug),
);
