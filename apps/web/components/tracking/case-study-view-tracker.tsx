"use client";

import { useEffect, useRef } from "react";

import { captureEvent } from "@/lib/analytics/client";

export function CaseStudyViewTracker({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    captureEvent("case_study_view", { slug, title });
  }, [slug, title]);

  return null;
}
