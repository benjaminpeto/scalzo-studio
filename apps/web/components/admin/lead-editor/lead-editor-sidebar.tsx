import Link from "next/link";

import { AdminSubmitButton } from "@/components/admin/shared/admin-submit-button";
import type { AdminLeadEditorRecord } from "@/interfaces/admin/lead-editor";
import { formatUpdatedAt } from "@/lib/admin/format";
import { Button } from "@ui/components/ui/button";

export function LeadEditorSidebar({ lead }: { lead: AdminLeadEditorRecord }) {
  return (
    <aside className="space-y-4">
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Lead metadata
        </p>
        <dl className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          <div>
            <dt className="font-semibold text-foreground">Lead ID</dt>
            <dd className="break-all font-mono text-xs">{lead.id}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Received</dt>
            <dd>{formatUpdatedAt(lead.createdAt)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Current status</dt>
            <dd className="capitalize">{lead.status}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Save
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Saving updates the lead status and internal notes. Changes are
          internal only and never sent to the contact.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <AdminSubmitButton createLabel="Save changes" mode="edit" />
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/leads">Back to leads</Link>
          </Button>
        </div>
      </section>
    </aside>
  );
}
