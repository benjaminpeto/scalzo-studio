import { z } from "zod";

const returnQuerySchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().max(200),
);

export const publishedFilterSchema = z.enum(["all", "published", "draft"]);
export const featuredFilterSchema = z.enum(["all", "featured", "standard"]);

export const publishActionSchema = z.object({
  featuredFilter: featuredFilterSchema,
  currentPublished: z.enum(["true", "false"]),
  publishedFilter: publishedFilterSchema,
  searchQuery: returnQuerySchema,
  testimonialId: z.string().uuid(),
});

export const featureActionSchema = z.object({
  currentFeatured: z.enum(["true", "false"]),
  featuredFilter: featuredFilterSchema,
  publishedFilter: publishedFilterSchema,
  searchQuery: returnQuerySchema,
  testimonialId: z.string().uuid(),
});

export const deleteActionSchema = z.object({
  confirmDelete: z.literal("true"),
  testimonialId: z.string().uuid(),
});

export const TESTIMONIAL_NAME_MAX_LENGTH = 120;
export const TESTIMONIAL_COMPANY_MAX_LENGTH = 120;
export const TESTIMONIAL_ROLE_MAX_LENGTH = 120;
export const TESTIMONIAL_QUOTE_MAX_LENGTH = 2000;
export const TESTIMONIAL_IMAGE_ALT_MAX_LENGTH = 160;

const optionalTestimonialString = (maxLength: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(maxLength).optional(),
  );

export const testimonialEditorSchema = z.object({
  company: optionalTestimonialString(TESTIMONIAL_COMPANY_MAX_LENGTH),
  featured: z.boolean(),
  name: z
    .string()
    .trim()
    .min(2, "Enter the client or author name.")
    .max(
      TESTIMONIAL_NAME_MAX_LENGTH,
      `Keep the name under ${TESTIMONIAL_NAME_MAX_LENGTH} characters.`,
    ),
  published: z.boolean(),
  quote: z
    .string()
    .trim()
    .min(2, "Enter the testimonial quote.")
    .max(
      TESTIMONIAL_QUOTE_MAX_LENGTH,
      `Keep the quote under ${TESTIMONIAL_QUOTE_MAX_LENGTH} characters.`,
    ),
  role: optionalTestimonialString(TESTIMONIAL_ROLE_MAX_LENGTH),
});

export const testimonialUpdateSchema = testimonialEditorSchema.extend({
  removeAvatar: z.boolean(),
  testimonialId: z.string().uuid(),
});

export type TestimonialEditorInput = z.infer<typeof testimonialEditorSchema>;
export type TestimonialUpdateInput = z.infer<typeof testimonialUpdateSchema>;
