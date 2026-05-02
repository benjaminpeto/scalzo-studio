import type {
  AdminCaseStudyEditorFieldErrors,
  AdminCaseStudyEditorRecord,
  AdminCaseStudiesListData,
  AdminCaseStudyEditorState,
  GalleryUploadRowState,
  MetricRowState,
} from "@/interfaces/admin/work-editor";

export interface WorkEditorOverviewProps {
  caseStudy?: AdminCaseStudyEditorRecord;
  mode: "create" | "edit";
  previewPath: string | null;
}

export interface WorkEditorContentSectionsProps {
  approachId: string;
  approachEsId: string;
  caseStudy?: AdminCaseStudyEditorRecord;
  challengeId: string;
  challengeEsId: string;
  clientNameId: string;
  errors: AdminCaseStudyEditorFieldErrors;
  industryId: string;
  outcomesId: string;
  outcomesEsId: string;
  servicesId: string;
  slugId: string;
  titleId: string;
  titleEsId: string;
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
  seoDescriptionEsId: string;
  seoTitleId: string;
  seoTitleEsId: string;
  updateGalleryUploadRow: (id: string, value: string) => void;
}

export interface WorkEditorCoverImageSectionProps {
  caseStudy?: AdminCaseStudyEditorRecord;
  coverImageAltId: string;
  coverImageId: string;
  errors: AdminCaseStudyEditorFieldErrors;
}

export interface WorkEditorGallerySectionProps {
  addGalleryUploadRow: () => void;
  caseStudy?: AdminCaseStudyEditorRecord;
  errors: AdminCaseStudyEditorFieldErrors;
  galleryUploadRows: GalleryUploadRowState[];
  removeGalleryUploadRow: (id: string) => void;
  updateGalleryUploadRow: (id: string, value: string) => void;
}

export interface WorkEditorSeoSectionProps {
  caseStudy?: AdminCaseStudyEditorRecord;
  errors: AdminCaseStudyEditorFieldErrors;
  seoDescriptionId: string;
  seoDescriptionEsId: string;
  seoTitleId: string;
  seoTitleEsId: string;
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
