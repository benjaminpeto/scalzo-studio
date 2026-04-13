import type { CmsImageAsset } from "@/lib/media-assets/shared";

export interface AdminTestimonialEditorFieldErrors {
  avatar?: string;
  avatarAlt?: string;
  company?: string;
  name?: string;
  quote?: string;
  role?: string;
}

export interface AdminTestimonialEditorState {
  fieldErrors: AdminTestimonialEditorFieldErrors;
  message: string | null;
  redirectTo: string | null;
  status: "idle" | "success" | "error";
}

export interface AdminTestimonialEditorRecord {
  avatar: CmsImageAsset | null;
  company: string;
  featured: boolean;
  id: string;
  name: string;
  published: boolean;
  quote: string;
  role: string;
  updatedAt: string;
}

export interface AdminTestimonialListItem {
  avatarUrl: string | null;
  company: string | null;
  featured: boolean;
  id: string;
  name: string;
  published: boolean;
  quote: string;
  role: string | null;
  updatedAt: string;
}

export interface AdminTestimonialsListData {
  featuredCount: number;
  filteredCount: number;
  publishedCount: number;
  query: string;
  selectedFeaturedFilter: "all" | "featured" | "standard";
  selectedPublishedFilter: "all" | "published" | "draft";
  testimonials: AdminTestimonialListItem[];
  totalCount: number;
}
