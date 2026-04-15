import type { RefObject } from "react";

import type {
  AdminInsightEditorFieldErrors,
  AdminInsightEditorRecord,
  AdminInsightsListData,
  AdminInsightEditorState,
  AdminInsightMediaState,
} from "@/interfaces/admin/insight-editor";

export interface InsightEditorOverviewProps {
  mode: "create" | "edit";
  post?: AdminInsightEditorRecord;
  previewPath: string | null;
  slugValue: string;
}

export interface InsightEditorContentSectionsProps {
  contentId: string;
  contentMdValue: string;
  contentTextareaRef: RefObject<HTMLTextAreaElement | null>;
  coverImageId: string;
  errors: AdminInsightEditorFieldErrors;
  excerptId: string;
  excerptValue: string;
  onContentChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  post?: AdminInsightEditorRecord;
  previewTags: string[];
  slugId: string;
  slugValue: string;
  tagsId: string;
  tagsValue: string;
  titleId: string;
  titleValue: string;
}

export interface InsightEditorMetadataSectionProps {
  errors: AdminInsightEditorFieldErrors;
  excerptId: string;
  excerptValue: string;
  onExcerptChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  slugId: string;
  slugValue: string;
  tagsId: string;
  tagsValue: string;
  titleId: string;
  titleValue: string;
}

export interface InsightEditorMarkdownPreviewSectionProps {
  contentId: string;
  contentMdValue: string;
  contentTextareaRef: RefObject<HTMLTextAreaElement | null>;
  errors: AdminInsightEditorFieldErrors;
  excerptValue: string;
  onContentChange: (value: string) => void;
  post?: AdminInsightEditorRecord;
  previewTags: string[];
  titleValue: string;
}

export interface InsightEditorCoverImageSectionProps {
  coverImageId: string;
  errors: AdminInsightEditorFieldErrors;
  post?: AdminInsightEditorRecord;
}

export interface InsightEditorSidebarProps {
  currentPath: string;
  errors: AdminInsightEditorFieldErrors;
  mode: "create" | "edit";
  onSeoDescriptionChange: (value: string) => void;
  onSeoTitleChange: (value: string) => void;
  postId?: string;
  publicPath: string;
  published?: boolean;
  seoDescriptionId: string;
  seoDescriptionValue: string;
  seoTitleId: string;
  seoTitleValue: string;
}

export interface InsightEditorMediaHelperProps {
  insertUploadedSnippet: () => void;
  mediaAction: (payload: FormData) => void;
  mediaState: AdminInsightMediaState;
  post?: AdminInsightEditorRecord;
}

export interface AdminInsightEditorProps {
  action: (
    state: AdminInsightEditorState,
    payload: FormData,
  ) => Promise<AdminInsightEditorState>;
  mediaAction: (
    state: AdminInsightMediaState,
    payload: FormData,
  ) => Promise<AdminInsightMediaState>;
  mode: "create" | "edit";
  post?: AdminInsightEditorRecord;
  status?: string;
}

export interface AdminInsightsListProps {
  data: AdminInsightsListData;
  status?: string;
}
