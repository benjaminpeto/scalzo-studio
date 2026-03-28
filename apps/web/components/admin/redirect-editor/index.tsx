"use client";

import { useActionState, useId } from "react";

import { adminRedirectEditorStatusMessageByCode } from "@/constants/admin/editor";
import { useAdminRedirect } from "@/hooks/admin/use-admin-redirect";
import type { AdminRedirectEditorProps } from "@/interfaces/admin/component-props";
import type { AdminRedirectEditorFieldErrors } from "@/interfaces/admin/redirect-editor";
import { initialAdminRedirectEditorState } from "@/lib/admin/redirect-editor";
import { cn } from "@/lib/utils";

import { RedirectEditorDeletePanel } from "./redirect-editor-delete-panel";
import { RedirectEditorFormSections } from "./redirect-editor-form-sections";
import { RedirectEditorOverview } from "./redirect-editor-overview";
import { RedirectEditorSidebar } from "./redirect-editor-sidebar";

export function AdminRedirectEditor({
  action,
  deleteAction,
  mode,
  redirectRecord,
  status,
}: AdminRedirectEditorProps) {
  const [serverState, formAction] = useActionState(
    action,
    initialAdminRedirectEditorState,
  );
  const fromPathId = useId();
  const statusCodeId = useId();
  const toPathId = useId();
  const statusMessage =
    status && status in adminRedirectEditorStatusMessageByCode
      ? adminRedirectEditorStatusMessageByCode[
          status as keyof typeof adminRedirectEditorStatusMessageByCode
        ]
      : null;
  const errors: AdminRedirectEditorFieldErrors = serverState.fieldErrors;
  const currentPath =
    mode === "create"
      ? "/admin/redirects/new"
      : `/admin/redirects/${redirectRecord?.id ?? ""}`;

  useAdminRedirect({
    redirectTo: serverState.redirectTo,
    status: serverState.status,
  });

  return (
    <div className="space-y-5">
      <RedirectEditorOverview mode={mode} redirectRecord={redirectRecord} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <form action={formAction} className="contents">
          {mode === "edit" ? (
            <input
              type="hidden"
              name="redirectId"
              value={redirectRecord?.id ?? ""}
            />
          ) : null}

          <div className="space-y-4">
            {serverState.message ? (
              <div
                className={cn(
                  "rounded-[1.25rem] border px-4 py-3 text-sm leading-6",
                  serverState.status === "error"
                    ? "border-destructive/25 bg-destructive/8 text-foreground"
                    : "border-emerald-200 bg-emerald-50/90 text-emerald-900",
                )}
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

            <RedirectEditorFormSections
              errors={errors}
              fromPathId={fromPathId}
              redirectRecord={redirectRecord}
              statusCodeId={statusCodeId}
              toPathId={toPathId}
            />
          </div>

          <RedirectEditorSidebar
            currentPath={currentPath}
            mode={mode}
            redirectRecord={redirectRecord}
          />
        </form>

        {mode === "edit" && redirectRecord && deleteAction ? (
          <RedirectEditorDeletePanel
            action={deleteAction}
            redirectRecord={redirectRecord}
          />
        ) : null}
      </div>
    </div>
  );
}
