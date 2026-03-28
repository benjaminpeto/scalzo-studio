import type { AdminTestimonialEditorState } from "@/interfaces/admin/testimonial-editor";

export const initialAdminTestimonialEditorState: AdminTestimonialEditorState = {
  fieldErrors: {},
  message: null,
  redirectTo: null,
  status: "idle",
};
