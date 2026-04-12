import type { AdminOverviewTopCtaRow } from "@/interfaces/admin/overview-dashboard";

export function AdminOverviewTopCtasTable({
  rows,
}: {
  rows: AdminOverviewTopCtaRow[];
}) {
  return (
    <section className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82">
      <div className="border-b border-border/60 px-5 py-4">
        <h2 className="text-base font-semibold tracking-[-0.02em] text-foreground">
          Top CTAs
        </h2>
      </div>

      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  CTA id
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Placement
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Clicks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((row) => (
                <tr key={`${row.ctaId}-${row.placement}`}>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {row.ctaId}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.placement}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {row.clicks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-6 text-sm text-muted-foreground">
          No CTA clicks were captured in this range.
        </div>
      )}
    </section>
  );
}
