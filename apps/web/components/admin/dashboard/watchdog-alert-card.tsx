import type { AdminOverviewWatchdogAlert } from "@/interfaces/admin/overview-dashboard";

function formatLastCheckedAt(value: string | null) {
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

function getStatusClassName(status: AdminOverviewWatchdogAlert["status"]) {
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

function getStatusLabel(status: AdminOverviewWatchdogAlert["status"]) {
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
