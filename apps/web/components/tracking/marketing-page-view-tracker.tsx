"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { capturePageView } from "@/lib/analytics/client";

export function MarketingPageViewTracker() {
  const pathname = usePathname() || "/";
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastTrackedPathRef.current === pathname) {
      return;
    }

    lastTrackedPathRef.current = pathname;
    capturePageView(pathname);
  }, [pathname]);

  return null;
}
