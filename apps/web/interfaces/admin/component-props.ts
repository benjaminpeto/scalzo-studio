import type { ReactNode } from "react";

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
