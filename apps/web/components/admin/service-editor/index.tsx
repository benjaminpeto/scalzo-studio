"use client";

import { useActionState, useId } from "react";

import { adminServiceEditorStatusMessageByCode } from "@/constants/admin/editor";
import { useAdminRedirect } from "@/hooks/admin/use-admin-redirect";
import type { AdminServiceEditorProps } from "@/interfaces/admin/component-props";
import type { AdminServiceEditorFieldErrors } from "@/interfaces/admin/service-editor";
import { initialAdminServiceEditorState } from "@/lib/admin/service-editor";
import { cn } from "@/lib/utils";

import { ServiceEditorFormSections } from "./service-editor-form-sections";
import { ServiceEditorOverview } from "./service-editor-overview";
import { ServiceEditorSidebar } from "./service-editor-sidebar";

export function AdminServiceEditor({
  action,
  mode,
  service,
  status,
}: AdminServiceEditorProps) {
  const [serverState, formAction] = useActionState(
    action,
    initialAdminServiceEditorState,
  );
  const titleId = useId();
  const titleEsId = useId();
  const slugId = useId();
  const summaryId = useId();
  const summaryEsId = useId();
  const contentId = useId();
  const contentEsId = useId();
  const deliverablesId = useId();
  const seoTitleId = useId();
  const seoTitleEsId = useId();
  const seoDescriptionId = useId();
  const seoDescriptionEsId = useId();
  const statusMessage =
    status && status in adminServiceEditorStatusMessageByCode
      ? adminServiceEditorStatusMessageByCode[
          status as keyof typeof adminServiceEditorStatusMessageByCode
        ]
      : null;
  const errors: AdminServiceEditorFieldErrors = serverState.fieldErrors;
  const currentPath =
    mode === "create"
      ? "/admin/services/new"
      : `/admin/services/${service?.slug ?? ""}`;
  const previewPath = service?.published ? `/services/${service.slug}` : null;

  useAdminRedirect({
    redirectTo: serverState.redirectTo,
    status: serverState.status,
  });

  return (
    <div className="space-y-5">
      <ServiceEditorOverview
        mode={mode}
        previewPath={previewPath}
        service={service}
      />

      <form
        action={formAction}
        className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]"
      >
        {mode === "edit" ? (
          <>
            <input type="hidden" name="serviceId" value={service?.id ?? ""} />
            <input
              type="hidden"
              name="currentSlug"
              value={service?.slug ?? ""}
            />
          </>
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

          <ServiceEditorFormSections
            contentId={contentId}
            contentEsId={contentEsId}
            deliverablesId={deliverablesId}
            errors={errors}
            seoDescriptionId={seoDescriptionId}
            seoDescriptionEsId={seoDescriptionEsId}
            seoTitleId={seoTitleId}
            seoTitleEsId={seoTitleEsId}
            service={service}
            slugId={slugId}
            summaryId={summaryId}
            summaryEsId={summaryEsId}
            titleId={titleId}
            titleEsId={titleEsId}
          />
        </div>

        <ServiceEditorSidebar
          currentPath={currentPath}
          mode={mode}
          service={service}
        />
      </form>
    </div>
  );
}
