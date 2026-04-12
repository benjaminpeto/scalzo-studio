import type { AdminOverviewLandingPageRow } from "@/interfaces/admin/overview-dashboard";

export function AdminOverviewTopLandingPagesTable({
  rows,
}: {
  rows: AdminOverviewLandingPageRow[];
}) {
  return (
    <section className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82">
      <div className="border-b border-border/60 px-5 py-4">
        <h2 className="text-base font-semibold tracking-[-0.02em] text-foreground">
          Top landing pages
        </h2>
      </div>

      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Page path
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Sessions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((row) => (
                <tr key={row.pagePath}>
                  <td className="px-4 py-3 font-medium text-foreground">
                    <code>{row.pagePath}</code>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {row.sessions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-6 text-sm text-muted-foreground">
          No landing-page sessions were captured in this range.
        </div>
      )}
    </section>
  );
}
