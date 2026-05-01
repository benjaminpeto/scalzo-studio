import type { AdminOverviewKpiCardProps } from "@/interfaces/admin/overview-dashboard";
import { formatDeltaLabel, formatMetricValue } from "@/lib/helpers";

export function AdminOverviewKpiCard({
  format,
  label,
  metric,
}: AdminOverviewKpiCardProps) {
  const deltaToneClass =
    metric.delta.valueDelta > 0
      ? metric.tone === "positive"
        ? "text-emerald-700"
        : "text-foreground"
      : metric.delta.valueDelta < 0
        ? "text-muted-foreground"
        : "text-muted-foreground";

  return (
    <article className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-4 font-display text-[3rem] leading-none tracking-[-0.06em] text-foreground">
        {formatMetricValue(metric.value, format)}
      </p>
      <p className={`mt-4 text-sm font-medium ${deltaToneClass}`}>
        {formatDeltaLabel({
          format,
          percentageDelta: metric.delta.percentageDelta,
          valueDelta: metric.delta.valueDelta,
        })}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Previous period: {formatMetricValue(metric.delta.previousValue, format)}
      </p>
    </article>
  );
}
