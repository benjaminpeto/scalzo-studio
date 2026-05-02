import { z } from "zod";

const returnQuerySchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().max(200),
);

export const publishedFilterSchema = z.enum(["all", "published", "draft"]);

export const publishActionSchema = z.object({
  currentPublished: z.enum(["true", "false"]),
  currentPublishedAt: returnQuerySchema,
  postId: z.string().uuid(),
  publishedFilter: publishedFilterSchema,
  slug: z.string().trim().min(1).max(200),
  tagFilter: returnQuerySchema,
});

export const POST_TITLE_MAX_LENGTH = 140;
export const POST_SLUG_MAX_LENGTH = 160;
export const POST_EXCERPT_MAX_LENGTH = 320;
export const POST_CONTENT_MAX_LENGTH = 32000;
export const POST_TAG_LIMIT = 12;
export const POST_TAG_MAX_LENGTH = 60;
export const POST_IMAGE_ALT_MAX_LENGTH = 160;
export const SEO_TITLE_MAX_LENGTH = 70;
export const SEO_DESCRIPTION_MAX_LENGTH = 160;

export const reservedInsightSlugs = new Set(["new"]);

const optionalInsightString = (maxLength: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(maxLength).optional(),
  );

export const insightEditorSchema = z.object({
  contentMd: z
    .string()
    .max(
      POST_CONTENT_MAX_LENGTH,
      `Keep the article body under ${POST_CONTENT_MAX_LENGTH} characters.`,
    )
    .refine(
      (value) => value.trim().length > 0,
      "Enter article markdown before saving.",
    ),
  contentMdEs: optionalInsightString(POST_CONTENT_MAX_LENGTH),
  excerpt: optionalInsightString(POST_EXCERPT_MAX_LENGTH),
  excerptEs: optionalInsightString(POST_EXCERPT_MAX_LENGTH),
  published: z.boolean(),
  seoDescription: optionalInsightString(SEO_DESCRIPTION_MAX_LENGTH),
  seoDescriptionEs: optionalInsightString(SEO_DESCRIPTION_MAX_LENGTH),
  seoTitle: optionalInsightString(SEO_TITLE_MAX_LENGTH),
  seoTitleEs: optionalInsightString(SEO_TITLE_MAX_LENGTH),
  slug: optionalInsightString(POST_SLUG_MAX_LENGTH),
  tagLines: optionalInsightString(POST_TAG_LIMIT * (POST_TAG_MAX_LENGTH + 1)),
  title: z
    .string()
    .trim()
    .min(2, "Enter a post title.")
    .max(
      POST_TITLE_MAX_LENGTH,
      `Keep the title under ${POST_TITLE_MAX_LENGTH} characters.`,
    ),
  titleEs: optionalInsightString(POST_TITLE_MAX_LENGTH),
});

export const insightUpdateSchema = insightEditorSchema.extend({
  currentSlug: z.string().trim().min(1).max(POST_SLUG_MAX_LENGTH),
  postId: z.string().uuid(),
  removeCoverImage: z.boolean(),
});

export const contentImageUploadSchema = z.object({
  contentImageAlt: z
    .string()
    .trim()
    .min(1, "Enter alt text for the uploaded image.")
    .max(
      POST_IMAGE_ALT_MAX_LENGTH,
      `Keep alt text under ${POST_IMAGE_ALT_MAX_LENGTH} characters.`,
    ),
  currentSlug: z.string().trim().min(1).max(POST_SLUG_MAX_LENGTH),
});

export type InsightEditorInput = z.infer<typeof insightEditorSchema>;
export type InsightUpdateInput = z.infer<typeof insightUpdateSchema>;
