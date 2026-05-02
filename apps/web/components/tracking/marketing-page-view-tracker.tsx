"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

import { capturePageView } from "@/lib/analytics/client";

export function MarketingPageViewTracker() {
  const pathname = usePathname() || "/";
  const locale = useLocale();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastTrackedPathRef.current === pathname) {
      return;
    }

    lastTrackedPathRef.current = pathname;
    capturePageView(pathname, locale);
  }, [pathname, locale]);

  return null;
}
