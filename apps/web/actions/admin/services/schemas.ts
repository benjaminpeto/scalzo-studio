import { z } from "zod";

const returnQuerySchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().max(200),
);

export const publishActionSchema = z.object({
  currentPublished: z.enum(["true", "false"]),
  searchQuery: returnQuerySchema,
  serviceId: z.string().uuid(),
  slug: z.string().trim().min(1).max(200),
});

export const moveActionSchema = z.object({
  direction: z.enum(["up", "down"]),
  searchQuery: returnQuerySchema,
  serviceId: z.string().uuid(),
});

export const SERVICE_TITLE_MAX_LENGTH = 140;
export const SERVICE_SLUG_MAX_LENGTH = 160;
export const SERVICE_SUMMARY_MAX_LENGTH = 320;
export const SERVICE_CONTENT_MAX_LENGTH = 24000;
export const SERVICE_DELIVERABLE_MAX_LENGTH = 160;
export const SERVICE_DELIVERABLE_LIMIT = 24;
export const SEO_TITLE_MAX_LENGTH = 70;
export const SEO_DESCRIPTION_MAX_LENGTH = 160;

export const reservedServiceSlugs = new Set(["new"]);

const optionalServiceString = (maxLength: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(maxLength).optional(),
  );

export const serviceEditorSchema = z.object({
  contentMd: optionalServiceString(SERVICE_CONTENT_MAX_LENGTH),
  contentMdEs: optionalServiceString(SERVICE_CONTENT_MAX_LENGTH),
  deliverables: optionalServiceString(
    SERVICE_DELIVERABLE_LIMIT * (SERVICE_DELIVERABLE_MAX_LENGTH + 1),
  ),
  published: z.boolean(),
  seoDescription: optionalServiceString(SEO_DESCRIPTION_MAX_LENGTH),
  seoDescriptionEs: optionalServiceString(SEO_DESCRIPTION_MAX_LENGTH),
  seoTitle: optionalServiceString(SEO_TITLE_MAX_LENGTH),
  seoTitleEs: optionalServiceString(SEO_TITLE_MAX_LENGTH),
  slug: optionalServiceString(SERVICE_SLUG_MAX_LENGTH),
  summary: optionalServiceString(SERVICE_SUMMARY_MAX_LENGTH),
  summaryEs: optionalServiceString(SERVICE_SUMMARY_MAX_LENGTH),
  title: z
    .string()
    .trim()
    .min(2, "Enter a service title.")
    .max(
      SERVICE_TITLE_MAX_LENGTH,
      `Keep the title under ${SERVICE_TITLE_MAX_LENGTH} characters.`,
    ),
  titleEs: optionalServiceString(SERVICE_TITLE_MAX_LENGTH),
});

export const serviceUpdateSchema = serviceEditorSchema.extend({
  currentSlug: z.string().trim().min(1).max(SERVICE_SLUG_MAX_LENGTH),
  serviceId: z.string().uuid(),
});

export type ServiceEditorInput = z.infer<typeof serviceEditorSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;
