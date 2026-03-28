"use client";

import { useMemo, useRef, useState } from "react";

import type { AdminInsightEditorRecord } from "@/interfaces/admin/insight-editor";
import { splitLineSeparatedEntries } from "@/lib/text/lines";

export function useAdminInsightFormState(post?: AdminInsightEditorRecord) {
  const [titleValue, setTitleValue] = useState(post?.title ?? "");
  const [slugValue, setSlugValue] = useState(post?.slug ?? "");
  const [excerptValue, setExcerptValue] = useState(post?.excerpt ?? "");
  const [tagsValue, setTagsValue] = useState(post?.tags.join("\n") ?? "");
  const [contentMdValue, setContentMdValue] = useState(post?.contentMd ?? "");
  const [seoTitleValue, setSeoTitleValue] = useState(post?.seoTitle ?? "");
  const [seoDescriptionValue, setSeoDescriptionValue] = useState(
    post?.seoDescription ?? "",
  );
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const previewTags = useMemo(
    () => splitLineSeparatedEntries(tagsValue),
    [tagsValue],
  );

  return {
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
  };
}
