import { z } from "zod";

const returnQuerySchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().max(200),
);

export const publishedFilterSchema = z.enum(["all", "published", "draft"]);

export const publishActionSchema = z.object({
  caseStudyId: z.string().uuid(),
  currentPublished: z.enum(["true", "false"]),
  industryFilter: returnQuerySchema,
  publishedFilter: publishedFilterSchema,
  slug: z.string().trim().min(1).max(200),
});

export const CASE_STUDY_TITLE_MAX_LENGTH = 140;
export const CASE_STUDY_SLUG_MAX_LENGTH = 160;
export const CASE_STUDY_CLIENT_MAX_LENGTH = 120;
export const CASE_STUDY_INDUSTRY_MAX_LENGTH = 120;
export const CASE_STUDY_TEXT_MAX_LENGTH = 5000;
export const CASE_STUDY_OUTCOMES_MAX_LENGTH = 4000;
export const CASE_STUDY_SERVICES_LIMIT = 12;
export const CASE_STUDY_SERVICE_MAX_LENGTH = 120;
export const CASE_STUDY_METRICS_LIMIT = 12;
export const CASE_STUDY_METRIC_LABEL_MAX_LENGTH = 80;
export const CASE_STUDY_METRIC_VALUE_MAX_LENGTH = 120;
export const SEO_TITLE_MAX_LENGTH = 70;
export const SEO_DESCRIPTION_MAX_LENGTH = 160;

export const reservedCaseStudySlugs = new Set(["new"]);

const optionalCaseStudyString = (maxLength: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(maxLength).optional(),
  );

const caseStudyBaseSchema = z.object({
  approach: optionalCaseStudyString(CASE_STUDY_TEXT_MAX_LENGTH),
  challenge: optionalCaseStudyString(CASE_STUDY_TEXT_MAX_LENGTH),
  clientName: optionalCaseStudyString(CASE_STUDY_CLIENT_MAX_LENGTH),
  industry: optionalCaseStudyString(CASE_STUDY_INDUSTRY_MAX_LENGTH),
  outcomes: optionalCaseStudyString(CASE_STUDY_OUTCOMES_MAX_LENGTH),
  published: z.boolean(),
  seoDescription: optionalCaseStudyString(SEO_DESCRIPTION_MAX_LENGTH),
  seoTitle: optionalCaseStudyString(SEO_TITLE_MAX_LENGTH),
  serviceLines: optionalCaseStudyString(
    CASE_STUDY_SERVICES_LIMIT * (CASE_STUDY_SERVICE_MAX_LENGTH + 1),
  ),
  slug: optionalCaseStudyString(CASE_STUDY_SLUG_MAX_LENGTH),
  title: z
    .string()
    .trim()
    .min(2, "Enter a case study title.")
    .max(
      CASE_STUDY_TITLE_MAX_LENGTH,
      `Keep the title under ${CASE_STUDY_TITLE_MAX_LENGTH} characters.`,
    ),
});

export const caseStudyCreateSchema = caseStudyBaseSchema;

export const caseStudyUpdateSchema = caseStudyBaseSchema.extend({
  caseStudyId: z.string().uuid(),
  currentSlug: z.string().trim().min(1).max(CASE_STUDY_SLUG_MAX_LENGTH),
  removeCoverImage: z.boolean(),
});

export type CaseStudyCreateInput = z.infer<typeof caseStudyCreateSchema>;
export type CaseStudyUpdateInput = z.infer<typeof caseStudyUpdateSchema>;
