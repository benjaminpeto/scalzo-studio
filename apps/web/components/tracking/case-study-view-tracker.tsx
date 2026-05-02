"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

import { captureEvent } from "@/lib/analytics/client";

export function CaseStudyViewTracker({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const locale = useLocale();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    captureEvent("case_study_view", { slug, title }, locale);
  }, [slug, title, locale]);

  return null;
}
