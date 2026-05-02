import type {
  AdminTestimonialEditorFieldErrors,
  AdminTestimonialEditorRecord,
  AdminTestimonialsListData,
  AdminTestimonialEditorState,
} from "@/interfaces/admin/testimonial-editor";

export interface TestimonialEditorOverviewProps {
  mode: "create" | "edit";
  testimonial?: AdminTestimonialEditorRecord;
}

export interface TestimonialEditorFormSectionsProps {
  avatarId: string;
  companyId: string;
  errors: AdminTestimonialEditorFieldErrors;
  nameId: string;
  quoteId: string;
  quoteEsId: string;
  roleId: string;
  roleEsId: string;
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
