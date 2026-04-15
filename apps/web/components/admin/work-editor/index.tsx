"use client";

import { useActionState, useId } from "react";

import { adminWorkEditorStatusMessageByCode } from "@/constants/admin/editor";
import { useAdminGalleryUploadRows } from "@/hooks/admin/use-admin-gallery-upload-rows";
import { useAdminMetricRows } from "@/hooks/admin/use-admin-metric-rows";
import { useAdminRedirect } from "@/hooks/admin/use-admin-redirect";
import type { AdminWorkEditorProps } from "@/interfaces/admin/work-component-props";
import type { AdminCaseStudyEditorFieldErrors } from "@/interfaces/admin/work-editor";
import { initialAdminCaseStudyEditorState } from "@/lib/admin/work-editor";
import { cn } from "@/lib/utils";

import { WorkEditorAssetsSeoSections } from "./work-editor-assets-seo-sections";
import { WorkEditorContentSections } from "./work-editor-content-sections";
import { WorkEditorMetricsSection } from "./work-editor-metrics-section";
import { WorkEditorOverview } from "./work-editor-overview";
import { WorkEditorSidebar } from "./work-editor-sidebar";

export function AdminWorkEditor({
  action,
  caseStudy,
  mode,
  status,
}: AdminWorkEditorProps) {
  const [serverState, formAction] = useActionState(
    action,
    initialAdminCaseStudyEditorState,
  );
  const { addMetricRow, metricRows, removeMetricRow, updateMetricRow } =
    useAdminMetricRows({
      caseStudyId: caseStudy?.id,
      metrics: caseStudy?.metrics,
    });
  const titleId = useId();
  const slugId = useId();
  const clientNameId = useId();
  const industryId = useId();
  const servicesId = useId();
  const challengeId = useId();
  const approachId = useId();
  const outcomesId = useId();
  const metricsId = useId();
  const seoTitleId = useId();
  const seoDescriptionId = useId();
  const coverImageId = useId();
  const coverImageAltId = useId();
  const statusMessage =
    status && status in adminWorkEditorStatusMessageByCode
      ? adminWorkEditorStatusMessageByCode[
          status as keyof typeof adminWorkEditorStatusMessageByCode
        ]
      : null;
  const errors: AdminCaseStudyEditorFieldErrors = serverState.fieldErrors;
  const previewPath =
    mode === "edit" && caseStudy
      ? `/api/preview/work?slug=${caseStudy.slug}`
      : null;
  const currentPath =
    mode === "create"
      ? "/admin/work/new"
      : `/admin/work/${caseStudy?.slug ?? ""}`;
  const {
    addGalleryUploadRow,
    galleryUploadRows,
    removeGalleryUploadRow,
    updateGalleryUploadRow,
  } = useAdminGalleryUploadRows();

  useAdminRedirect({
    redirectTo: serverState.redirectTo,
    status: serverState.status,
  });

  return (
    <div className="space-y-5">
      <WorkEditorOverview
        caseStudy={caseStudy}
        mode={mode}
        previewPath={previewPath}
      />

      <form
        action={formAction}
        className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]"
      >
        {mode === "edit" ? (
          <>
            <input
              type="hidden"
              name="caseStudyId"
              value={caseStudy?.id ?? ""}
            />
            <input
              type="hidden"
              name="currentSlug"
              value={caseStudy?.slug ?? ""}
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

          <WorkEditorContentSections
            approachId={approachId}
            caseStudy={caseStudy}
            challengeId={challengeId}
            clientNameId={clientNameId}
            errors={errors}
            industryId={industryId}
            outcomesId={outcomesId}
            servicesId={servicesId}
            slugId={slugId}
            titleId={titleId}
          />

          <WorkEditorMetricsSection
            addMetricRow={addMetricRow}
            errors={errors}
            metricRows={metricRows}
            metricsId={metricsId}
            removeMetricRow={removeMetricRow}
            updateMetricRow={updateMetricRow}
          />

          <WorkEditorAssetsSeoSections
            addGalleryUploadRow={addGalleryUploadRow}
            caseStudy={caseStudy}
            coverImageId={coverImageId}
            coverImageAltId={coverImageAltId}
            errors={errors}
            galleryUploadRows={galleryUploadRows}
            removeGalleryUploadRow={removeGalleryUploadRow}
            seoDescriptionId={seoDescriptionId}
            seoTitleId={seoTitleId}
            updateGalleryUploadRow={updateGalleryUploadRow}
          />
        </div>

        <WorkEditorSidebar
          caseStudy={caseStudy}
          currentPath={currentPath}
          metricRows={metricRows}
          mode={mode}
        />
      </form>
    </div>
  );
}
