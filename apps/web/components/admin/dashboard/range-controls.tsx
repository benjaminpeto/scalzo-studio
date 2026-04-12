import Link from "next/link";

import { adminOverviewRangeOptions } from "@/constants/admin/dashboard";
import type { AdminOverviewDateRange } from "@/interfaces/admin/overview-dashboard";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";

export function AdminOverviewRangeControls({
  range,
}: {
  range: AdminOverviewDateRange;
}) {
  return (
    <section className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Date range
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground md:text-4xl">
            Overview KPI dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Current window: {range.label}. Comparison window:{" "}
            {range.previousFrom} to {range.previousTo}.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {adminOverviewRangeOptions.map((option) => {
            const isActive = option.value === range.key;

            return (
              <Button
                key={option.value}
                asChild
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="rounded-full px-4"
              >
                <Link
                  href={
                    option.value === "custom"
                      ? "/admin?range=custom"
                      : `/admin?range=${option.value}`
                  }
                >
                  {option.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>

      <form
        action="/admin"
        className="mt-5 flex flex-col gap-3 md:flex-row md:items-end"
      >
        <input type="hidden" name="range" value="custom" />
        <label className="space-y-2 text-sm text-foreground">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            From
          </span>
          <Input
            type="date"
            name="from"
            defaultValue={range.from}
            className="h-11 rounded-full border-border/70 bg-white/82 px-4"
          />
        </label>
        <label className="space-y-2 text-sm text-foreground">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            To
          </span>
          <Input
            type="date"
            name="to"
            defaultValue={range.to}
            className="h-11 rounded-full border-border/70 bg-white/82 px-4"
          />
        </label>
        <Button type="submit" size="sm" className="h-11 rounded-full px-5">
          Apply custom range
        </Button>
      </form>
    </section>
  );
}
