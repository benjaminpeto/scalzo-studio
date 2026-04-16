"use client";

import { useId } from "react";

import { LEAD_STATUSES } from "@/actions/admin/leads/schemas";
import { AdminEditorField } from "@/components/admin/shared/admin-editor-field";
import { AdminEditorTextarea } from "@/components/admin/shared/admin-editor-textarea";
import type { AdminLeadEditorFieldErrors } from "@/interfaces/admin/lead-editor";
import { buildDescribedBy } from "@/lib/admin/field";

export function LeadEditorFormSections({
  currentNotes,
  currentStatus,
  errors,
}: {
  currentNotes: string;
  currentStatus: string;
  errors: AdminLeadEditorFieldErrors;
}) {
  const statusId = useId();
  const notesId = useId();

  return (
    <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        Status &amp; notes
      </p>
      <div className="mt-5 grid gap-5">
        <AdminEditorField
          error={errors.status}
          hint="Track where this lead is in the qualification pipeline."
          htmlFor={statusId}
          label="Status"
        >
          <select
            id={statusId}
            name="status"
            defaultValue={currentStatus}
            aria-invalid={Boolean(errors.status)}
            aria-describedby={buildDescribedBy({
              error: errors.status,
              hint: "Track where this lead is in the qualification pipeline.",
              id: statusId,
            })}
            className="input-shell h-12 rounded-[1rem] border border-border/70 bg-white/82 px-4 text-sm text-foreground"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </AdminEditorField>

        <AdminEditorField
          error={errors.internalNotes}
          hint="Internal notes are never visible to the contact."
          htmlFor={notesId}
          label="Internal notes"
          optionalLabel="Optional"
        >
          <AdminEditorTextarea
            id={notesId}
            name="internalNotes"
            defaultValue={currentNotes}
            aria-invalid={Boolean(errors.internalNotes)}
            aria-describedby={buildDescribedBy({
              error: errors.internalNotes,
              hint: "Internal notes are never visible to the contact.",
              id: notesId,
            })}
            placeholder="Add context, next steps, or follow-up notes…"
          />
        </AdminEditorField>
      </div>
    </section>
  );
}
