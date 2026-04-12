import type { AdminOverviewDashboardProps } from "@/interfaces/admin/overview-dashboard";

import { AdminOverviewKpiCard } from "./kpi-card";
import { AdminOverviewRangeControls } from "./range-controls";
import { AdminOverviewTopCtasTable } from "./top-ctas-table";
import { AdminOverviewTopLandingPagesTable } from "./top-landing-pages-table";
import { AdminOverviewWatchdogAlertCard } from "./watchdog-alert-card";

export function AdminOverviewDashboard({ data }: AdminOverviewDashboardProps) {
  return (
    <div className="space-y-6">
      <AdminOverviewRangeControls range={data.range} />

      <section className="grid gap-4 xl:grid-cols-3">
        {data.alerts.map((alert) => (
          <AdminOverviewWatchdogAlertCard key={alert.id} alert={alert} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <AdminOverviewKpiCard
          label="Sessions"
          metric={data.sessions}
          format="count"
        />
        <AdminOverviewKpiCard
          label="Qualified leads"
          metric={data.qualifiedLeads}
          format="count"
        />
        <AdminOverviewKpiCard
          label="Conversion rate"
          metric={data.conversionRate}
          format="percent"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <AdminOverviewTopLandingPagesTable rows={data.topLandingPages} />
        <AdminOverviewTopCtasTable rows={data.topCtas} />
      </section>
    </div>
  );
}
