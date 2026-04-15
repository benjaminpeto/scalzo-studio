import type { CmsImageAsset } from "@/interfaces/media-assets";
import type { AdminEditorState } from "@/interfaces/admin/shared";

export interface AdminTestimonialEditorFieldErrors {
  avatar?: string;
  avatarAlt?: string;
  company?: string;
  name?: string;
  quote?: string;
  role?: string;
}

export type AdminTestimonialEditorState =
  AdminEditorState<AdminTestimonialEditorFieldErrors>;

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
