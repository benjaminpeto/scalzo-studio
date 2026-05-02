import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  buildAdminReturnPath,
  buildZodFieldErrors,
  createEditorActionStateBuilders,
  normalizeKebabSlug,
  normalizeOptionalText,
} from "@/actions/admin/shared/helpers";
export {
  isFileEntry,
  normalizeOptionalText,
  normalizeStringEntry,
} from "@/actions/admin/shared/helpers";
import type {
  AdminInsightEditorFieldErrors,
  AdminInsightEditorState,
  AdminInsightMediaState,
} from "@/interfaces/admin/insight-editor";
import {
  collectDistinctInsightTags,
  normalizeInsightTag,
} from "@/lib/insights/tags";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { splitLineSeparatedEntries } from "@/lib/text/lines";

import {
  POST_TAG_LIMIT,
  POST_TAG_MAX_LENGTH,
  reservedInsightSlugs,
  type InsightEditorInput,
  type InsightUpdateInput,
} from "./schemas";

const insightActionStateBuilders = createEditorActionStateBuilders<
  AdminInsightEditorFieldErrors,
  AdminInsightEditorState
>();

export function collectDistinctTags(items: Array<{ tags: string[] }>) {
  return collectDistinctInsightTags(items);
}

export function buildInsightsReturnPath(input?: {
  publishedFilter?: "all" | "published" | "draft";
  status?: string;
  tag?: string;
}) {
  return buildAdminReturnPath({
    basePath: "/admin/insights",
    params: [
      {
        key: "published",
        value: input?.publishedFilter,
        valueToSkip: "all",
      },
      { key: "tag", value: input?.tag },
      { key: "status", value: input?.status },
    ],
  });
}

export function revalidateInsightRoutes(slug: string) {
  revalidatePath("/");
  revalidatePath("/insights");
  revalidatePath(`/insights/${slug}`);
  revalidatePath("/admin/insights");
  revalidatePath("/admin/insights/new");
  revalidatePath(`/admin/insights/${slug}`);
}

export const createActionErrorState =
  insightActionStateBuilders.createActionErrorState;
export const createActionSuccessState =
  insightActionStateBuilders.createActionSuccessState;

export function createMediaErrorState(message: string): AdminInsightMediaState {
  return {
    message,
    snippet: null,
    uploadedUrl: null,
    status: "error",
  };
}

export function createMediaSuccessState(input: {
  message: string;
  snippet: string;
  uploadedUrl: string;
}): AdminInsightMediaState {
  return {
    message: input.message,
    snippet: input.snippet,
    uploadedUrl: input.uploadedUrl,
    status: "success",
  };
}

export function normalizeTagLines(value?: string) {
  const uniqueTags: string[] = [];
  const seenTags = new Set<string>();

  for (const tag of splitLineSeparatedEntries(value)) {
    if (tag.length > POST_TAG_MAX_LENGTH) {
      return {
        error: `Each tag must stay under ${POST_TAG_MAX_LENGTH} characters.`,
        tags: [] as string[],
      };
    }

    const normalizedTag = normalizeInsightTag(tag);

    if (seenTags.has(normalizedTag)) {
      continue;
    }

    seenTags.add(normalizedTag);
    uniqueTags.push(tag);
  }

  if (uniqueTags.length > POST_TAG_LIMIT) {
    return {
      error: `Keep the tags list to ${POST_TAG_LIMIT} entries or fewer.`,
      tags: [] as string[],
    };
  }

  return {
    error: null,
    tags: uniqueTags,
  };
}

export function buildInsightEditorFieldErrors(
  error: z.ZodError<InsightEditorInput | InsightUpdateInput>,
): AdminInsightEditorFieldErrors {
  return buildZodFieldErrors({
    error,
    fieldAliases: {
      tagLines: "tags",
    },
    ignoredFields: ["postId", "currentSlug", "removeCoverImage"],
  });
}

export function readInsightEditorFormData(formData: FormData) {
  return {
    contentMd: formData.get("contentMd"),
    contentMdEs: formData.get("contentMdEs"),
    coverImage: formData.get("coverImage"),
    coverImageAlt: formData.get("coverImageAlt"),
    currentSlug: formData.get("currentSlug"),
    excerpt: formData.get("excerpt"),
    excerptEs: formData.get("excerptEs"),
    postId: formData.get("postId"),
    published: formData.has("published"),
    removeCoverImage: formData.has("removeCoverImage"),
    seoDescription: formData.get("seoDescription"),
    seoDescriptionEs: formData.get("seoDescriptionEs"),
    seoTitle: formData.get("seoTitle"),
    seoTitleEs: formData.get("seoTitleEs"),
    slug: formData.get("slug"),
    tagLines: formData.get("tags"),
    title: formData.get("title"),
    titleEs: formData.get("titleEs"),
  };
}

export function readContentImageUploadFormData(formData: FormData) {
  return {
    contentImage: formData.get("contentImage"),
    contentImageAlt: formData.get("contentImageAlt"),
    currentSlug: formData.get("currentSlug"),
  };
}

export async function ensureUniqueInsightSlug(input: {
  postId?: string;
  slug: string;
}) {
  "use server";
  const supabase = await createServerSupabaseClient();
  let query = supabase.from("posts").select("id").eq("slug", input.slug);

  if (input.postId) {
    query = query.neq("id", input.postId);
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) {
    throw new Error("Could not validate the post slug.");
  }

  return Boolean(data);
}

export function buildNormalizedInsightPayload(input: InsightEditorInput) {
  const tagsResult = normalizeTagLines(input.tagLines);

  if (tagsResult.error) {
    return {
      errorState: createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          tags: tagsResult.error,
        },
      ),
      payload: null,
    };
  }

  const normalizedSlug = normalizeKebabSlug(input.slug?.trim() || input.title);

  if (!normalizedSlug) {
    return {
      errorState: createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          slug: "Enter a slug or title that can be converted into a route segment.",
        },
      ),
      payload: null,
    };
  }

  if (reservedInsightSlugs.has(normalizedSlug)) {
    return {
      errorState: createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          slug: "This slug is reserved for an internal admin route.",
        },
      ),
      payload: null,
    };
  }

  return {
    errorState: null,
    payload: {
      contentMd: input.contentMd,
      contentMdEs: normalizeOptionalText(input.contentMdEs),
      excerpt: normalizeOptionalText(input.excerpt),
      excerptEs: normalizeOptionalText(input.excerptEs),
      published: input.published,
      publishedAt: input.published ? new Date().toISOString() : null,
      seoDescription: normalizeOptionalText(input.seoDescription),
      seoDescriptionEs: normalizeOptionalText(input.seoDescriptionEs),
      seoTitle: normalizeOptionalText(input.seoTitle),
      seoTitleEs: normalizeOptionalText(input.seoTitleEs),
      slug: normalizedSlug,
      tags: tagsResult.tags,
      title: input.title.trim(),
      titleEs: normalizeOptionalText(input.titleEs),
    },
  };
}
