import type { AdminLeadEditorRecord } from "@/interfaces/admin/lead-editor";

const UTM_LABELS: Record<string, string> = {
  referrer: "Referrer URL",
  utm_campaign: "Campaign",
  utm_content: "Content",
  utm_medium: "Medium",
  utm_source: "Source",
  utm_term: "Term",
};

// Internal keys written by the server — not meaningful to show admins.
const HIDDEN_UTM_KEYS = new Set(["submitted_via"]);

export function LeadEditorBrief({ lead }: { lead: AdminLeadEditorRecord }) {
  const utmEntries = lead.sourceUtm
    ? Object.entries(lead.sourceUtm).filter(([k]) => !HIDDEN_UTM_KEYS.has(k))
    : [];

  return (
    <div className="space-y-4">
      {/* Contact */}
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Contact
        </p>
        <dl className="mt-4 grid gap-3 text-sm leading-6 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-foreground">Name</dt>
            <dd className="text-muted-foreground">{lead.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Email</dt>
            <dd className="break-all text-muted-foreground">
              {lead.email ? (
                <a
                  href={`mailto:${lead.email}`}
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  {lead.email}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Company</dt>
            <dd className="text-muted-foreground">{lead.company ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Website</dt>
            <dd className="break-all text-muted-foreground">
              {lead.website ?? "—"}
            </dd>
          </div>
        </dl>
      </section>

      {/* Brief */}
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Brief
        </p>
        <dl className="mt-4 space-y-4 text-sm leading-6">
          <div>
            <dt className="font-semibold text-foreground">Project brief</dt>
            <dd className="mt-1 whitespace-pre-wrap text-muted-foreground">
              {lead.message ?? (
                <span className="italic">No brief recorded.</span>
              )}
            </dd>
          </div>
          {lead.servicesInterest.length > 0 ? (
            <div>
              <dt className="font-semibold text-foreground">Interests</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {lead.servicesInterest.map((s) => (
                  <span
                    key={s}
                    className="inline-flex rounded-full border border-border/70 bg-white px-3 py-0.5 text-xs font-medium text-foreground"
                  >
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-foreground">Budget</dt>
              <dd className="text-muted-foreground">
                {lead.budgetBand ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Timeline</dt>
              <dd className="text-muted-foreground">
                {lead.timelineBand ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Submitted from</dt>
              <dd className="break-all text-muted-foreground">
                {lead.pagePath ?? "—"}
              </dd>
            </div>
          </div>
        </dl>
      </section>

      {/* Acquisition */}
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Acquisition
        </p>
        <dl className="mt-4 grid gap-3 text-sm leading-6 sm:grid-cols-2">
          {utmEntries.length > 0 ? (
            utmEntries.map(([key, value]) => (
              <div key={key}>
                <dt className="font-semibold text-foreground">
                  {UTM_LABELS[key] ?? key}
                </dt>
                <dd className="break-all text-muted-foreground">
                  {value ?? <span className="italic">Direct / none</span>}
                </dd>
              </div>
            ))
          ) : (
            <div className="sm:col-span-2">
              <p className="text-muted-foreground">
                No acquisition data recorded for this submission.
              </p>
            </div>
          )}
        </dl>
      </section>
    </div>
  );
}
