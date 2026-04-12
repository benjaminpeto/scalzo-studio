"use client";

import { useActionState } from "react";

import { adminLeadEditorStatusMessageByCode } from "@/constants/admin/editor";
import { useAdminRedirect } from "@/hooks/admin/use-admin-redirect";
import type {
  AdminLeadEditorRecord,
  AdminLeadEditorState,
} from "@/interfaces/admin/lead-editor";
import { initialAdminLeadEditorState } from "@/actions/admin/leads/helpers";

import { LeadEditorBrief } from "./lead-editor-brief";
import { LeadEditorFormSections } from "./lead-editor-form-sections";
import { LeadEditorSidebar } from "./lead-editor-sidebar";
import { LeadEditorStatusTrack } from "./lead-editor-status-track";

export function AdminLeadEditor({
  action,
  lead,
  status,
}: {
  action: (
    state: AdminLeadEditorState,
    payload: FormData,
  ) => Promise<AdminLeadEditorState>;
  lead: AdminLeadEditorRecord;
  status?: string;
}) {
  const [serverState, formAction] = useActionState(
    action,
    initialAdminLeadEditorState,
  );

  useAdminRedirect({
    redirectTo: serverState.redirectTo,
    status: serverState.status,
  });

  const statusMessage =
    status && status in adminLeadEditorStatusMessageByCode
      ? adminLeadEditorStatusMessageByCode[
          status as keyof typeof adminLeadEditorStatusMessageByCode
        ]
      : null;

  const errors = serverState.fieldErrors;

  return (
    <div className="space-y-5">
      {/* Overview header */}
      <section className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(160deg,rgba(3,130,252,0.10),rgba(255,255,255,0.96)_40%,rgba(241,239,234,0.92))] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Lead detail
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
          {lead.name ?? "Unknown"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {lead.email ?? "No email recorded"}
          {lead.company ? ` · ${lead.company}` : ""}
        </p>
        <div className="mt-5">
          <LeadEditorStatusTrack currentStatus={lead.status} />
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <form action={formAction} className="contents">
          <input type="hidden" name="leadId" value={lead.id} />

          <div className="space-y-4">
            {/* Action feedback messages */}
            {serverState.message ? (
              <div
                className={[
                  "rounded-[1.25rem] border px-4 py-3 text-sm leading-6",
                  serverState.status === "error"
                    ? "border-destructive/25 bg-destructive/8 text-foreground"
                    : "border-emerald-200 bg-emerald-50/90 text-emerald-900",
                ].join(" ")}
                role={serverState.status === "error" ? "alert" : "status"}
              >
                {serverState.message}
              </div>
            ) : null}

            {statusMessage ? (
              <div
                className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm leading-6 text-emerald-900"
                role="status"
              >
                {statusMessage}
              </div>
            ) : null}

            <LeadEditorBrief lead={lead} />

            <LeadEditorFormSections
              currentNotes={lead.internalNotes ?? ""}
              currentStatus={lead.status}
              errors={errors}
            />
          </div>

          <LeadEditorSidebar lead={lead} />
        </form>
      </div>
    </div>
  );
}
