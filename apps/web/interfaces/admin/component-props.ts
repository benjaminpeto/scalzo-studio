import type { ReactNode, RefObject } from "react";

import type {
  AdminInsightEditorFieldErrors,
  AdminInsightEditorRecord,
  AdminInsightsListData,
  AdminInsightEditorState,
  AdminInsightMediaState,
} from "@/interfaces/admin/insight-editor";
import type {
  AdminLeadEditorRecord,
  AdminLeadEditorState,
} from "@/interfaces/admin/lead-editor";
import type { AdminLeadsListData } from "@/interfaces/admin/lead-list";
import type { AdminNavigationItem } from "@/interfaces/admin/navigation";
import type {
  AdminServiceEditorFieldErrors,
  AdminServiceEditorRecord,
  AdminServicesListData,
  AdminServiceEditorState,
} from "@/interfaces/admin/service-editor";
import type {
  AdminRedirectEditorFieldErrors,
  AdminRedirectEditorRecord,
  AdminRedirectsListData,
  AdminRedirectEditorState,
} from "@/interfaces/admin/redirect-editor";
import type {
  AdminTestimonialEditorFieldErrors,
  AdminTestimonialEditorRecord,
  AdminTestimonialsListData,
  AdminTestimonialEditorState,
} from "@/interfaces/admin/testimonial-editor";
import type {
  AdminCaseStudyEditorFieldErrors,
  AdminCaseStudyEditorRecord,
  AdminCaseStudiesListData,
  AdminCaseStudyEditorState,
  GalleryUploadRowState,
  MetricRowState,
} from "@/interfaces/admin/work-editor";

export interface BuildDescribedByInput {
  error?: string;
  hint?: string;
  id: string;
}

export interface AdminShellProps {
  children: ReactNode;
  userEmail: string | null;
}

export interface AdminProfileMenuProps {
  isCollapsed: boolean;
  isOpen: boolean;
  profileInitials: string;
  toggle: () => void;
  userEmail: string | null;
}

export interface SidebarPrimaryLinkProps {
  collapsed: boolean;
  item: AdminNavigationItem;
  pathname: string;
}

export interface SidebarSectionLinkProps {
  collapsed: boolean;
  item: AdminNavigationItem;
}

export interface AdminEditorFieldMessageProps {
  error?: string;
  id: string;
}

export interface AdminEditorFieldProps {
  children: ReactNode;
  error?: string;
  hint?: string;
  htmlFor?: string;
  label: string;
  optionalLabel?: string;
}

export interface AdminPublishFieldProps {
  copy: string;
  defaultChecked: boolean;
}

export interface AdminSubmitButtonProps {
  createLabel: string;
  mode: "create" | "edit";
}

export interface ServiceEditorOverviewProps {
  mode: "create" | "edit";
  previewPath: string | null;
  service?: AdminServiceEditorRecord;
}

export interface ServiceEditorFormSectionsProps {
  contentId: string;
  deliverablesId: string;
  errors: AdminServiceEditorFieldErrors;
  seoDescriptionId: string;
  seoTitleId: string;
  service?: AdminServiceEditorRecord;
  slugId: string;
  summaryId: string;
  titleId: string;
}

export interface ServiceEditorSidebarProps {
  currentPath: string;
  mode: "create" | "edit";
  service?: AdminServiceEditorRecord;
}

export interface AdminServiceEditorProps {
  action: (
    state: AdminServiceEditorState,
    payload: FormData,
  ) => Promise<AdminServiceEditorState>;
  mode: "create" | "edit";
  service?: AdminServiceEditorRecord;
  status?: string;
}

export interface AdminServicesListProps {
  data: AdminServicesListData;
  status?: string;
}

export interface RedirectEditorOverviewProps {
  mode: "create" | "edit";
  redirectRecord?: AdminRedirectEditorRecord;
}

export interface RedirectEditorFormSectionsProps {
  errors: AdminRedirectEditorFieldErrors;
  fromPathId: string;
  redirectRecord?: AdminRedirectEditorRecord;
  statusCodeId: string;
  toPathId: string;
}

export interface RedirectEditorSidebarProps {
  currentPath: string;
  mode: "create" | "edit";
  redirectRecord?: AdminRedirectEditorRecord;
}

export interface RedirectEditorDeletePanelProps {
  action: (payload: FormData) => Promise<void>;
  redirectRecord: AdminRedirectEditorRecord;
}

export interface AdminRedirectEditorProps {
  action: (
    state: AdminRedirectEditorState,
    payload: FormData,
  ) => Promise<AdminRedirectEditorState>;
  deleteAction: ((payload: FormData) => Promise<void>) | null;
  mode: "create" | "edit";
  redirectRecord?: AdminRedirectEditorRecord;
  status?: string;
}

export interface AdminRedirectsListProps {
  data: AdminRedirectsListData;
  status?: string;
}

export interface WorkEditorOverviewProps {
  caseStudy?: AdminCaseStudyEditorRecord;
  mode: "create" | "edit";
  previewPath: string | null;
}

export interface WorkEditorContentSectionsProps {
  approachId: string;
  caseStudy?: AdminCaseStudyEditorRecord;
  challengeId: string;
  clientNameId: string;
  errors: AdminCaseStudyEditorFieldErrors;
  industryId: string;
  outcomesId: string;
  servicesId: string;
  slugId: string;
  titleId: string;
}

export interface WorkEditorMetricsSectionProps {
  addMetricRow: () => void;
  errors: AdminCaseStudyEditorFieldErrors;
  metricsId: string;
  metricRows: MetricRowState[];
  removeMetricRow: (id: string) => void;
  updateMetricRow: (
    id: string,
    field: "label" | "value",
    value: string,
  ) => void;
}

export interface WorkEditorAssetsSeoSectionsProps {
  addGalleryUploadRow: () => void;
  caseStudy?: AdminCaseStudyEditorRecord;
  coverImageId: string;
  coverImageAltId: string;
  errors: AdminCaseStudyEditorFieldErrors;
  galleryUploadRows: GalleryUploadRowState[];
  removeGalleryUploadRow: (id: string) => void;
  seoDescriptionId: string;
  seoTitleId: string;
  updateGalleryUploadRow: (id: string, value: string) => void;
}

export interface WorkEditorSidebarProps {
  caseStudy?: AdminCaseStudyEditorRecord;
  currentPath: string;
  metricRows: MetricRowState[];
  mode: "create" | "edit";
}

export interface AdminWorkEditorProps {
  action: (
    state: AdminCaseStudyEditorState,
    payload: FormData,
  ) => Promise<AdminCaseStudyEditorState>;
  caseStudy?: AdminCaseStudyEditorRecord;
  mode: "create" | "edit";
  status?: string;
}

export interface AdminWorkListProps {
  data: AdminCaseStudiesListData;
  status?: string;
}

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

export interface TestimonialEditorOverviewProps {
  mode: "create" | "edit";
  testimonial?: AdminTestimonialEditorRecord;
}

export interface TestimonialEditorFormSectionsProps {
  avatarId: string;
  errors: AdminTestimonialEditorFieldErrors;
  nameId: string;
  quoteId: string;
  roleId: string;
  companyId: string;
  testimonial?: AdminTestimonialEditorRecord;
}

export interface TestimonialEditorSidebarProps {
  currentPath: string;
  mode: "create" | "edit";
  testimonial?: AdminTestimonialEditorRecord;
}

export interface TestimonialEditorDeletePanelProps {
  action: (payload: FormData) => Promise<void>;
  testimonial: AdminTestimonialEditorRecord;
}

export interface AdminTestimonialEditorProps {
  action: (
    state: AdminTestimonialEditorState,
    payload: FormData,
  ) => Promise<AdminTestimonialEditorState>;
  deleteAction: ((payload: FormData) => Promise<void>) | null;
  mode: "create" | "edit";
  status?: string;
  testimonial?: AdminTestimonialEditorRecord;
}

export interface AdminTestimonialsListProps {
  data: AdminTestimonialsListData;
  status?: string;
}

export interface AdminLeadsListProps {
  data: AdminLeadsListData;
}

export interface AdminLeadEditorProps {
  action: (
    state: AdminLeadEditorState,
    payload: FormData,
  ) => Promise<AdminLeadEditorState>;
  lead: AdminLeadEditorRecord;
  status?: string;
}
