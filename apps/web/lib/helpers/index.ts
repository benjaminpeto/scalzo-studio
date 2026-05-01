import { AdminOverviewWatchdogAlert } from "@/interfaces/admin/overview-dashboard";
import { publicEnv } from "../env/public";
import { Children, isValidElement, type ReactNode } from "react";
import { InsightIndexEntry } from "@/interfaces/insights/content";

export function formatMetricValue(value: number, format: "count" | "percent") {
  if (format === "percent") {
    return `${value.toFixed(1)}%`;
  }

  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDeltaLabel({
  format,
  percentageDelta,
  valueDelta,
}: {
  format: "count" | "percent";
  percentageDelta: number | null;
  valueDelta: number;
}) {
  const direction = valueDelta > 0 ? "+" : "";

  if (percentageDelta === null) {
    return `${direction}${formatMetricValue(valueDelta, format)} vs previous period`;
  }

  return `${direction}${percentageDelta.toFixed(1)}% vs previous period`;
}

export function formatLastCheckedAt(value: string | null) {
  if (!value) {
    return "No recent audit event recorded.";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(value));
}

export function getStatusClassName(
  status: AdminOverviewWatchdogAlert["status"],
) {
  switch (status) {
    case "critical":
      return "border-destructive/20 bg-destructive/8 text-destructive";
    case "healthy":
      return "border-emerald-200/80 bg-emerald-50 text-emerald-700";
    case "inactive":
      return "border-border/70 bg-muted/40 text-muted-foreground";
    case "warning":
      return "border-amber-200/80 bg-amber-50 text-amber-700";
  }
}

export function getStatusLabel(status: AdminOverviewWatchdogAlert["status"]) {
  switch (status) {
    case "critical":
      return "Critical";
    case "healthy":
      return "Healthy";
    case "inactive":
      return "Inactive";
    case "warning":
      return "Warning";
  }
}

const TERMINAL_STATUSES = new Set(["won", "lost"]);
export const PIPELINE_STEPS = ["new", "contacted", "qualified"] as const;

export function getStepState(step: string, currentStatus: string) {
  const stepIndex = PIPELINE_STEPS.indexOf(
    step as (typeof PIPELINE_STEPS)[number],
  );
  const currentIndex = PIPELINE_STEPS.indexOf(
    currentStatus as (typeof PIPELINE_STEPS)[number],
  );

  if (TERMINAL_STATUSES.has(currentStatus)) {
    if (stepIndex < PIPELINE_STEPS.length - 1) return "past";
    if (step === "qualified") return "past";
    return "past";
  }

  if (currentStatus === step) return "current";
  if (currentIndex > stepIndex) return "past";
  return "future";
}

export function formatBookingStartTime(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function buildArticleUrl(slug: string) {
  return new URL(`/insights/${slug}`, publicEnv.siteUrl).toString();
}

export function buildShareLinks(title: string, articleUrl: string) {
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);

  return [
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: "LinkedIn",
    },
    {
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      label: "X",
    },
    {
      href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(
        `${title}\n\n${articleUrl}`,
      )}`,
      label: "Email",
    },
  ] as const;
}

export function flattenMarkdownText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (
        isValidElement<{
          children?: ReactNode;
        }>(child)
      ) {
        return flattenMarkdownText(child.props.children);
      }

      return "";
    })
    .join("");
}

export function buildTagHref(tag: string) {
  const params = new URLSearchParams({ tag });

  return `/insights?${params.toString()}`;
}

export function getEntryMetadata(entry: InsightIndexEntry) {
  const primaryTag = entry.tags[0];

  return primaryTag ? `${entry.date} / ${primaryTag}` : entry.date;
}
