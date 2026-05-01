import type { AdminOverviewWatchdogAlert } from "@/interfaces/admin/overview-dashboard";
import {
  getStatusClassName,
  getStatusLabel,
  formatLastCheckedAt,
} from "@/lib/helpers";

export function AdminOverviewWatchdogAlertCard({
  alert,
}: {
  alert: AdminOverviewWatchdogAlert;
}) {
  return (
    <article className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Watchdog
          </p>
          <h2 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-foreground">
            {alert.label}
          </h2>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${getStatusClassName(alert.status)}`}
        >
          {getStatusLabel(alert.status)}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-foreground">{alert.summary}</p>
      <p className="mt-4 text-xs text-muted-foreground">
        Last checked: {formatLastCheckedAt(alert.lastCheckedAt)}
      </p>
    </article>
  );
}
