"use client";

import { useActionState, useId } from "react";

import { adminInsightEditorStatusMessageByCode } from "@/constants/admin/editor";
import { useAdminInsightFormState } from "@/hooks/admin/use-admin-insight-form-state";
import { useAdminRedirect } from "@/hooks/admin/use-admin-redirect";
import type { AdminInsightEditorProps } from "@/interfaces/admin/insight-component-props";
import type { AdminInsightEditorFieldErrors } from "@/interfaces/admin/insight-editor";
import {
  initialAdminInsightEditorState,
  initialAdminInsightMediaState,
  insertInsightSnippet,
} from "@/lib/admin/insight-editor";
import { cn } from "@/lib/utils";

import { InsightEditorContentSections } from "./insight-editor-content-sections";
import { InsightEditorMediaHelper } from "./insight-editor-media-helper";
import { InsightEditorOverview } from "./insight-editor-overview";
import { InsightEditorSidebar } from "./insight-editor-sidebar";

export function AdminInsightEditor({
  action,
  mediaAction,
  mode,
  post,
  status,
}: AdminInsightEditorProps) {
  const [serverState, formAction] = useActionState(
    action,
    initialAdminInsightEditorState,
  );
  const [mediaState, mediaFormAction] = useActionState(
    mediaAction,
    initialAdminInsightMediaState,
  );
  const {
    contentMdValue,
    contentTextareaRef,
    excerptValue,
    previewTags,
    seoDescriptionValue,
    seoTitleValue,
    setContentMdValue,
    setExcerptValue,
    setSeoDescriptionValue,
    setSeoTitleValue,
    setSlugValue,
    setTagsValue,
    setTitleValue,
    slugValue,
    tagsValue,
    titleValue,
  } = useAdminInsightFormState(post);
  const titleId = useId();
  const slugId = useId();
  const excerptId = useId();
  const tagsId = useId();
  const contentId = useId();
  const coverImageId = useId();
  const seoTitleId = useId();
  const seoDescriptionId = useId();
  const errors: AdminInsightEditorFieldErrors = serverState.fieldErrors;
  const currentPath =
    mode === "create"
      ? "/admin/insights/new"
      : `/admin/insights/${post?.slug ?? ""}`;
  const previewPath =
    mode === "edit" && post ? `/api/preview/insights?slug=${post.slug}` : null;
  const statusMessage =
    status && status in adminInsightEditorStatusMessageByCode
      ? adminInsightEditorStatusMessageByCode[
          status as keyof typeof adminInsightEditorStatusMessageByCode
        ]
      : null;

  useAdminRedirect({
    redirectTo: serverState.redirectTo,
    status: serverState.status,
  });

  function insertUploadedSnippet() {
    if (!mediaState.snippet) {
      return;
    }

    const snippet = mediaState.snippet;
    const textarea = contentTextareaRef.current;

    if (!textarea) {
      setContentMdValue((current) =>
        insertInsightSnippet({ content: current, snippet }),
      );
      return;
    }

    const selectionStart = textarea.selectionStart ?? textarea.value.length;
    const selectionEnd = textarea.selectionEnd ?? textarea.value.length;

    setContentMdValue((current) =>
      insertInsightSnippet({
        content: current,
        selectionEnd,
        selectionStart,
        snippet,
      }),
    );

    requestAnimationFrame(() => {
      textarea.focus();
    });
  }

  return (
    <div className="space-y-5">
      <InsightEditorOverview
        mode={mode}
        post={post}
        previewPath={previewPath}
        slugValue={slugValue}
      />

      <form
        action={formAction}
        className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]"
      >
        {mode === "edit" ? (
          <>
            <input type="hidden" name="postId" value={post?.id ?? ""} />
            <input type="hidden" name="currentSlug" value={post?.slug ?? ""} />
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

          <InsightEditorContentSections
            contentId={contentId}
            contentMdValue={contentMdValue}
            contentTextareaRef={contentTextareaRef}
            coverImageId={coverImageId}
            errors={errors}
            excerptId={excerptId}
            excerptValue={excerptValue}
            onContentChange={setContentMdValue}
            onExcerptChange={setExcerptValue}
            onSlugChange={setSlugValue}
            onTagsChange={setTagsValue}
            onTitleChange={setTitleValue}
            post={post}
            previewTags={previewTags}
            slugId={slugId}
            slugValue={slugValue}
            tagsId={tagsId}
            tagsValue={tagsValue}
            titleId={titleId}
            titleValue={titleValue}
          />
        </div>

        <InsightEditorSidebar
          currentPath={currentPath}
          errors={errors}
          mode={mode}
          onSeoDescriptionChange={setSeoDescriptionValue}
          onSeoTitleChange={setSeoTitleValue}
          postId={post?.id}
          publicPath={
            mode === "create"
              ? "Assigned after slug validation and save"
              : `/insights/${slugValue || "{slug}"}`
          }
          published={post?.published}
          seoDescriptionId={seoDescriptionId}
          seoDescriptionValue={seoDescriptionValue}
          seoTitleId={seoTitleId}
          seoTitleValue={seoTitleValue}
        />
      </form>

      <InsightEditorMediaHelper
        insertUploadedSnippet={insertUploadedSnippet}
        mediaAction={mediaFormAction}
        mediaState={mediaState}
        post={mode === "edit" ? post : undefined}
      />
    </div>
  );
}
