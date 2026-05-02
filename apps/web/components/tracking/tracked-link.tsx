"use client";

import type { ComponentProps } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

import { captureEvent } from "@/lib/analytics/client";

interface TrackedLinkProps extends ComponentProps<typeof Link> {
  ctaId: string;
  placement: string;
}

export function TrackedLink({
  ctaId,
  onClick,
  placement,
  ...props
}: TrackedLinkProps) {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <Link
      {...props}
      onClick={(e) => {
        captureEvent(
          "cta_click",
          {
            cta_id: ctaId,
            page_path: pathname,
            placement,
          },
          locale,
        );
        onClick?.(e);
      }}
    />
  );
}
