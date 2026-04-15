import { revalidatePath } from "next/cache";
import { z } from "zod";

import { normalizeOptionalText } from "@/actions/admin/shared/helpers";
export {
  isFileEntry,
  normalizeStringEntry,
} from "@/actions/admin/shared/helpers";
import type { AdminTestimonialListItem } from "@/interfaces/admin/testimonial-editor";
import type {
  AdminTestimonialEditorFieldErrors,
  AdminTestimonialEditorState,
} from "@/interfaces/admin/testimonial-editor";
import type { Database } from "@/lib/supabase/database.types";

import type { TestimonialEditorInput, TestimonialUpdateInput } from "./schemas";
import {
  TESTIMONIAL_COMPANY_MAX_LENGTH,
  TESTIMONIAL_NAME_MAX_LENGTH,
  TESTIMONIAL_QUOTE_MAX_LENGTH,
  TESTIMONIAL_ROLE_MAX_LENGTH,
} from "./schemas";

type TestimonialFilterInput = {
  featuredFilter: "all" | "featured" | "standard";
  publishedFilter: "all" | "published" | "draft";
  query: string;
};

type TestimonialWithSearchText = AdminTestimonialListItem & {
  searchText: string;
};

export function createActionErrorState(
  message: string,
  fieldErrors: AdminTestimonialEditorFieldErrors = {},
): AdminTestimonialEditorState {
  return {
    fieldErrors,
    message,
    redirectTo: null,
    status: "error",
  };
}

export function createActionSuccessState(input: {
  message: string;
  redirectTo: string;
}): AdminTestimonialEditorState {
  return {
    fieldErrors: {},
    message: input.message,
    redirectTo: input.redirectTo,
    status: "success",
  };
}

export function readTestimonialEditorFormData(formData: FormData) {
  return {
    avatar: formData.get("avatar"),
    avatarAlt: formData.get("avatarAlt"),
    company: formData.get("company"),
    featured: formData.has("featured"),
    name: formData.get("name"),
    published: formData.has("published"),
    quote: formData.get("quote"),
    removeAvatar: formData.has("removeAvatar"),
    role: formData.get("role"),
    testimonialId: formData.get("testimonialId"),
  };
}

export function buildTestimonialEditorFieldErrors(
  error: z.ZodError<TestimonialEditorInput | TestimonialUpdateInput>,
): AdminTestimonialEditorFieldErrors {
  const fieldErrors: AdminTestimonialEditorFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      field !== "testimonialId" &&
      field !== "removeAvatar" &&
      !fieldErrors[field as keyof AdminTestimonialEditorFieldErrors]
    ) {
      fieldErrors[field as keyof AdminTestimonialEditorFieldErrors] =
        issue.message;
    }
  }

  return fieldErrors;
}

export function buildTestimonialsReturnPath(input?: {
  featuredFilter?: "all" | "featured" | "standard";
  publishedFilter?: "all" | "published" | "draft";
  query?: string;
  status?: string;
}) {
  const searchParams = new URLSearchParams();

  if (input?.query) {
    searchParams.set("q", input.query);
  }

  if (input?.publishedFilter && input.publishedFilter !== "all") {
    searchParams.set("published", input.publishedFilter);
  }

  if (input?.featuredFilter && input.featuredFilter !== "all") {
    searchParams.set("featured", input.featuredFilter);
  }

  if (input?.status) {
    searchParams.set("status", input.status);
  }

  const queryString = searchParams.toString();

  return queryString
    ? `/admin/testimonials?${queryString}`
    : "/admin/testimonials";
}

export function getTestimonialSearchText(testimonial: {
  company: string | null;
  name: string;
  quote: string;
  role: string | null;
}) {
  return [
    testimonial.name,
    testimonial.company,
    testimonial.role,
    testimonial.quote,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function summarizeAdminTestimonials(
  testimonials: AdminTestimonialListItem[],
) {
  return {
    featuredCount: testimonials.filter((testimonial) => testimonial.featured)
      .length,
    publishedCount: testimonials.filter((testimonial) => testimonial.published)
      .length,
    totalCount: testimonials.length,
  };
}

export function filterAdminTestimonials(
  testimonials: TestimonialWithSearchText[],
  input: TestimonialFilterInput,
) {
  const normalizedQuery = input.query.trim().toLowerCase();

  return testimonials
    .filter((testimonial) => {
      const queryMatches = normalizedQuery
        ? testimonial.searchText.includes(normalizedQuery)
        : true;
      const publishedMatches =
        input.publishedFilter === "all"
          ? true
          : input.publishedFilter === "published"
            ? testimonial.published
            : !testimonial.published;
      const featuredMatches =
        input.featuredFilter === "all"
          ? true
          : input.featuredFilter === "featured"
            ? testimonial.featured
            : !testimonial.featured;

      return queryMatches && publishedMatches && featuredMatches;
    })
    .map((testimonial) => ({
      avatarUrl: testimonial.avatarUrl,
      company: testimonial.company,
      featured: testimonial.featured,
      id: testimonial.id,
      name: testimonial.name,
      published: testimonial.published,
      quote: testimonial.quote,
      role: testimonial.role,
      updatedAt: testimonial.updatedAt,
    }));
}

export function revalidateTestimonialRoutes(ids: string | string[]) {
  const testimonialIds = Array.isArray(ids) ? ids : [ids];

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/testimonials");
  revalidatePath("/admin/testimonials/new");

  for (const testimonialId of new Set(testimonialIds.filter(Boolean))) {
    revalidatePath(`/admin/testimonials/${testimonialId}`);
  }
}

export function buildNormalizedTestimonialPayload(
  input: TestimonialEditorInput | TestimonialUpdateInput,
) {
  return {
    errorState: null,
    payload: {
      company: normalizeOptionalText(input.company),
      featured: input.featured,
      name: input.name.trim(),
      published: input.published,
      quote: input.quote.trim(),
      role: normalizeOptionalText(input.role),
    } satisfies Database["public"]["Tables"]["testimonials"]["Insert"],
  };
}

export const testimonialFieldLimits = {
  company: TESTIMONIAL_COMPANY_MAX_LENGTH,
  name: TESTIMONIAL_NAME_MAX_LENGTH,
  quote: TESTIMONIAL_QUOTE_MAX_LENGTH,
  role: TESTIMONIAL_ROLE_MAX_LENGTH,
} as const;
