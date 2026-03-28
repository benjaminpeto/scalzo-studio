"use client";

import { useActionState, useId } from "react";

import { adminTestimonialEditorStatusMessageByCode } from "@/constants/admin/editor";
import { useAdminRedirect } from "@/hooks/admin/use-admin-redirect";
import type { AdminTestimonialEditorProps } from "@/interfaces/admin/component-props";
import type { AdminTestimonialEditorFieldErrors } from "@/interfaces/admin/testimonial-editor";
import { initialAdminTestimonialEditorState } from "@/lib/admin/testimonial-editor";
import { cn } from "@/lib/utils";

import { TestimonialEditorDeletePanel } from "./testimonial-editor-delete-panel";
import { TestimonialEditorFormSections } from "./testimonial-editor-form-sections";
import { TestimonialEditorOverview } from "./testimonial-editor-overview";
import { TestimonialEditorSidebar } from "./testimonial-editor-sidebar";

export function AdminTestimonialEditor({
  action,
  deleteAction,
  mode,
  status,
  testimonial,
}: AdminTestimonialEditorProps) {
  const [serverState, formAction] = useActionState(
    action,
    initialAdminTestimonialEditorState,
  );
  const avatarId = useId();
  const companyId = useId();
  const nameId = useId();
  const quoteId = useId();
  const roleId = useId();
  const statusMessage =
    status && status in adminTestimonialEditorStatusMessageByCode
      ? adminTestimonialEditorStatusMessageByCode[
          status as keyof typeof adminTestimonialEditorStatusMessageByCode
        ]
      : null;
  const errors: AdminTestimonialEditorFieldErrors = serverState.fieldErrors;
  const currentPath =
    mode === "create"
      ? "/admin/testimonials/new"
      : `/admin/testimonials/${testimonial?.id ?? ""}`;

  useAdminRedirect({
    redirectTo: serverState.redirectTo,
    status: serverState.status,
  });

  return (
    <div className="space-y-5">
      <TestimonialEditorOverview mode={mode} testimonial={testimonial} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <form action={formAction} className="contents">
          {mode === "edit" ? (
            <input
              type="hidden"
              name="testimonialId"
              value={testimonial?.id ?? ""}
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

            <TestimonialEditorFormSections
              avatarId={avatarId}
              companyId={companyId}
              errors={errors}
              nameId={nameId}
              quoteId={quoteId}
              roleId={roleId}
              testimonial={testimonial}
            />
          </div>

          <TestimonialEditorSidebar
            currentPath={currentPath}
            mode={mode}
            testimonial={testimonial}
          />
        </form>

        {mode === "edit" && testimonial && deleteAction ? (
          <TestimonialEditorDeletePanel
            action={deleteAction}
            testimonial={testimonial}
          />
        ) : null}
      </div>
    </div>
  );
}
