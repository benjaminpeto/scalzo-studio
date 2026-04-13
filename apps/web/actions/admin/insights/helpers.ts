import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  buildUniqueStorageFileName,
  normalizeKebabSlug,
  normalizeOptionalText,
} from "@/actions/admin/shared/helpers";
export {
  buildUniqueStorageFileName,
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
import {
  deleteMediaAssetsByObjectPaths,
  extractImageMetadata,
  updateMediaAssetAltText,
  upsertMediaAsset,
} from "@/lib/media-assets/server";
import { publicEnv } from "@/lib/env/public";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { splitLineSeparatedEntries } from "@/lib/text/lines";
import {
  buildStorageObjectPath,
  getPublicStorageObjectUrl,
  isValidStorageObjectPath,
  storageBuckets,
  validateStorageUploadInput,
} from "@/lib/supabase/storage";

import {
  POST_TAG_LIMIT,
  POST_TAG_MAX_LENGTH,
  reservedInsightSlugs,
  type InsightEditorInput,
  type InsightUpdateInput,
} from "./schemas";

const blogBucketId = storageBuckets.blog.id;

export function collectDistinctTags(items: Array<{ tags: string[] }>) {
  return collectDistinctInsightTags(items);
}

export function buildInsightsReturnPath(input?: {
  publishedFilter?: "all" | "published" | "draft";
  status?: string;
  tag?: string;
}) {
  const searchParams = new URLSearchParams();

  if (input?.publishedFilter && input.publishedFilter !== "all") {
    searchParams.set("published", input.publishedFilter);
  }

  if (input?.tag) {
    searchParams.set("tag", input.tag);
  }

  if (input?.status) {
    searchParams.set("status", input.status);
  }

  const queryString = searchParams.toString();

  return queryString ? `/admin/insights?${queryString}` : "/admin/insights";
}

export function revalidateInsightRoutes(slug: string) {
  revalidatePath("/");
  revalidatePath("/insights");
  revalidatePath(`/insights/${slug}`);
  revalidatePath("/admin/insights");
  revalidatePath("/admin/insights/new");
  revalidatePath(`/admin/insights/${slug}`);
}

export function createActionErrorState(
  message: string,
  fieldErrors: AdminInsightEditorFieldErrors = {},
): AdminInsightEditorState {
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
}): AdminInsightEditorState {
  return {
    fieldErrors: {},
    message: input.message,
    redirectTo: input.redirectTo,
    status: "success",
  };
}

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
  const fieldErrors: AdminInsightEditorFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      field !== "postId" &&
      field !== "currentSlug" &&
      field !== "removeCoverImage" &&
      !fieldErrors[field as keyof AdminInsightEditorFieldErrors]
    ) {
      if (field === "tagLines") {
        fieldErrors.tags = issue.message;
      } else {
        fieldErrors[field as keyof AdminInsightEditorFieldErrors] =
          issue.message;
      }
    }
  }

  return fieldErrors;
}

export function readInsightEditorFormData(formData: FormData) {
  return {
    contentMd: formData.get("contentMd"),
    coverImage: formData.get("coverImage"),
    coverImageAlt: formData.get("coverImageAlt"),
    currentSlug: formData.get("currentSlug"),
    excerpt: formData.get("excerpt"),
    postId: formData.get("postId"),
    published: formData.has("published"),
    removeCoverImage: formData.has("removeCoverImage"),
    seoDescription: formData.get("seoDescription"),
    seoTitle: formData.get("seoTitle"),
    slug: formData.get("slug"),
    tagLines: formData.get("tags"),
    title: formData.get("title"),
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

export function extractManagedBlogObjectPathFromUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const supabaseUrl = new URL(publicEnv.supabaseUrl);

    if (
      parsedUrl.protocol !== supabaseUrl.protocol ||
      parsedUrl.hostname !== supabaseUrl.hostname ||
      parsedUrl.port !== supabaseUrl.port
    ) {
      return null;
    }

    const expectedPrefix = `/storage/v1/object/public/${blogBucketId}/`;

    if (!parsedUrl.pathname.startsWith(expectedPrefix)) {
      return null;
    }

    const objectPath = decodeURIComponent(
      parsedUrl.pathname.slice(expectedPrefix.length),
    );

    return isValidStorageObjectPath(blogBucketId, objectPath)
      ? objectPath
      : null;
  } catch {
    return null;
  }
}

export async function deleteManagedBlogObjects(objectPaths: string[]) {
  const uniquePaths = Array.from(new Set(objectPaths.filter(Boolean)));

  if (!uniquePaths.length) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.storage
    .from(blogBucketId)
    .remove(uniquePaths);

  if (error) {
    throw error;
  }

  await deleteMediaAssetsByObjectPaths({
    bucketId: blogBucketId,
    objectPaths: uniquePaths,
  });
}

export async function uploadBlogImage(input: {
  altText: string;
  file: File;
  kind: "content" | "cover";
  slug: string;
}) {
  const objectPath = buildStorageObjectPath({
    bucketId: blogBucketId,
    fileName: buildUniqueStorageFileName(input.file.name),
    kind: input.kind,
    slug: input.slug,
  });
  const validationResult = validateStorageUploadInput({
    bucketId: blogBucketId,
    contentType: input.file.type,
    fileSizeBytes: input.file.size,
    objectPath,
  });

  if (!validationResult.isValid) {
    throw new Error(validationResult.issues[0] ?? "Invalid image upload.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.storage
    .from(blogBucketId)
    .upload(objectPath, input.file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const publicUrl = getPublicStorageObjectUrl(
    supabase,
    blogBucketId,
    objectPath,
  );

  try {
    const metadata = await extractImageMetadata(input.file);

    await upsertMediaAsset({
      altText: input.altText.trim(),
      blurDataUrl: metadata.blurDataUrl,
      bucketId: blogBucketId,
      height: metadata.height,
      kind: input.kind === "cover" ? "insight-cover" : "insight-content",
      objectPath,
      publicUrl,
      width: metadata.width,
    });
  } catch (metadataError) {
    await supabase.storage.from(blogBucketId).remove([objectPath]);
    throw metadataError;
  }

  return {
    objectPath,
    publicUrl,
  };
}

export async function syncInsightImageAltText(input: {
  altText: string;
  publicUrl: string;
}) {
  await updateMediaAssetAltText(input);
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
      excerpt: normalizeOptionalText(input.excerpt),
      published: input.published,
      publishedAt: input.published ? new Date().toISOString() : null,
      seoDescription: normalizeOptionalText(input.seoDescription),
      seoTitle: normalizeOptionalText(input.seoTitle),
      slug: normalizedSlug,
      tags: tagsResult.tags,
      title: input.title.trim(),
    },
  };
}
