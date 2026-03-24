import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import {
  type AdminInsightEditorFieldErrors,
  type AdminInsightEditorRecord,
  type AdminInsightEditorState,
  type AdminInsightMediaState,
} from "@/lib/admin/insight-editor";
import { publicEnv } from "@/lib/env/public";
import type { Database } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  buildStorageObjectPath,
  getPublicStorageObjectUrl,
  isValidStorageObjectPath,
  storageBuckets,
  validateStorageUploadInput,
} from "@/lib/supabase/storage";

const returnQuerySchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().max(200),
);

const publishedFilterSchema = z.enum(["all", "published", "draft"]);

const publishActionSchema = z.object({
  currentPublished: z.enum(["true", "false"]),
  currentPublishedAt: returnQuerySchema,
  postId: z.string().uuid(),
  publishedFilter: publishedFilterSchema,
  slug: z.string().trim().min(1).max(200),
  tagFilter: returnQuerySchema,
});

const POST_TITLE_MAX_LENGTH = 140;
const POST_SLUG_MAX_LENGTH = 160;
const POST_EXCERPT_MAX_LENGTH = 320;
const POST_CONTENT_MAX_LENGTH = 32000;
const POST_TAG_LIMIT = 12;
const POST_TAG_MAX_LENGTH = 60;
const SEO_TITLE_MAX_LENGTH = 70;
const SEO_DESCRIPTION_MAX_LENGTH = 160;

const reservedInsightSlugs = new Set(["new"]);
const blogBucketId = storageBuckets.blog.id;

const optionalInsightString = (maxLength: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(maxLength).optional(),
  );

const insightEditorSchema = z.object({
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
  excerpt: optionalInsightString(POST_EXCERPT_MAX_LENGTH),
  published: z.boolean(),
  seoDescription: optionalInsightString(SEO_DESCRIPTION_MAX_LENGTH),
  seoTitle: optionalInsightString(SEO_TITLE_MAX_LENGTH),
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
});

const insightUpdateSchema = insightEditorSchema.extend({
  currentSlug: z.string().trim().min(1).max(POST_SLUG_MAX_LENGTH),
  postId: z.string().uuid(),
  removeCoverImage: z.boolean(),
});

const contentImageUploadSchema = z.object({
  contentImageAlt: optionalInsightString(140),
  currentSlug: z.string().trim().min(1).max(POST_SLUG_MAX_LENGTH),
});

type InsightEditorInput = z.infer<typeof insightEditorSchema>;
type InsightUpdateInput = z.infer<typeof insightUpdateSchema>;

export interface AdminInsightListItem {
  coverImageUrl: string | null;
  excerpt: string | null;
  id: string;
  published: boolean;
  publishedAt: string | null;
  slug: string;
  tags: string[];
  title: string;
  updatedAt: string;
}

export interface AdminInsightsListData {
  draftCount: number;
  filteredCount: number;
  posts: AdminInsightListItem[];
  publishedCount: number;
  selectedPublishedFilter: "all" | "published" | "draft";
  selectedTag: string;
  tags: string[];
  totalCount: number;
}

function normalizeTag(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function collectDistinctTags(items: Array<{ tags: string[] }>) {
  const tagsByKey = new Map<string, string>();

  for (const item of items) {
    for (const tag of item.tags) {
      const trimmedTag = tag.trim();
      const normalizedTag = normalizeTag(trimmedTag);

      if (!trimmedTag || !normalizedTag || tagsByKey.has(normalizedTag)) {
        continue;
      }

      tagsByKey.set(normalizedTag, trimmedTag);
    }
  }

  return Array.from(tagsByKey.values()).sort((left, right) =>
    left.localeCompare(right, "en", { sensitivity: "base" }),
  );
}

function buildInsightsReturnPath(input?: {
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

function revalidateInsightRoutes(slug: string) {
  revalidatePath("/");
  revalidatePath("/insights");
  revalidatePath(`/insights/${slug}`);
  revalidatePath("/admin/insights");
  revalidatePath("/admin/insights/new");
  revalidatePath(`/admin/insights/${slug}`);
}

function createActionErrorState(
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

function createActionSuccessState(input: {
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

function createMediaErrorState(message: string): AdminInsightMediaState {
  return {
    message,
    snippet: null,
    uploadedUrl: null,
    status: "error",
  };
}

function createMediaSuccessState(input: {
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

function normalizeStringEntry(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function normalizeOptionalText(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeInsightSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTagLines(value?: string) {
  const uniqueTags: string[] = [];
  const seenTags = new Set<string>();

  for (const rawTag of (value ?? "").split(/\r?\n/)) {
    const trimmedTag = rawTag.trim();

    if (!trimmedTag) {
      continue;
    }

    if (trimmedTag.length > POST_TAG_MAX_LENGTH) {
      return {
        error: `Each tag must stay under ${POST_TAG_MAX_LENGTH} characters.`,
        tags: [] as string[],
      };
    }

    const normalizedTag = normalizeTag(trimmedTag);

    if (seenTags.has(normalizedTag)) {
      continue;
    }

    seenTags.add(normalizedTag);
    uniqueTags.push(trimmedTag);
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

function buildInsightEditorFieldErrors(
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

function readInsightEditorFormData(formData: FormData) {
  return {
    contentMd: formData.get("contentMd"),
    coverImage: formData.get("coverImage"),
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

function readContentImageUploadFormData(formData: FormData) {
  return {
    contentImage: formData.get("contentImage"),
    contentImageAlt: formData.get("contentImageAlt"),
    currentSlug: formData.get("currentSlug"),
  };
}

function isFileEntry(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0 && Boolean(value.name);
}

function buildUniqueStorageFileName(fileName: string) {
  return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${fileName}`;
}

async function ensureUniqueInsightSlug(input: {
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

function extractManagedBlogObjectPathFromUrl(url: string) {
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

async function deleteManagedBlogObjects(objectPaths: string[]) {
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
}

async function uploadBlogImage(input: {
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

  return {
    objectPath,
    publicUrl: getPublicStorageObjectUrl(supabase, blogBucketId, objectPath),
  };
}

function buildNormalizedInsightPayload(input: InsightEditorInput) {
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

  const normalizedSlug = normalizeInsightSlug(
    input.slug?.trim() || input.title,
  );

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

export async function getAdminInsightsListData(input?: {
  publishedFilter?: string;
  tag?: string;
}): Promise<AdminInsightsListData> {
  await requireCurrentAdminAccess("/admin/insights");

  const selectedPublishedFilter = publishedFilterSchema.safeParse(
    input?.publishedFilter,
  ).success
    ? (input?.publishedFilter as "all" | "published" | "draft")
    : "all";
  const selectedTag = input?.tag?.trim() ?? "";
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "cover_image_url, excerpt, id, published, published_at, slug, tags, title, updated_at",
    )
    .order("published", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error("Could not load admin insights list.");
  }

  const allPosts = (data ?? []).map((post) => ({
    coverImageUrl: post.cover_image_url,
    excerpt: post.excerpt,
    id: post.id,
    published: post.published,
    publishedAt: post.published_at,
    slug: post.slug,
    tags: post.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
    title: post.title,
    updatedAt: post.updated_at,
  }));
  const tags = collectDistinctTags(allPosts);
  const selectedTagKey = normalizeTag(selectedTag);

  const posts = allPosts.filter((post) => {
    const publishedMatches =
      selectedPublishedFilter === "all"
        ? true
        : selectedPublishedFilter === "published"
          ? post.published
          : !post.published;
    const tagMatches = selectedTagKey
      ? post.tags.some((tag) => normalizeTag(tag) === selectedTagKey)
      : true;

    return publishedMatches && tagMatches;
  });

  return {
    draftCount: allPosts.filter((post) => !post.published).length,
    filteredCount: posts.length,
    posts,
    publishedCount: allPosts.filter((post) => post.published).length,
    selectedPublishedFilter,
    selectedTag,
    tags,
    totalCount: allPosts.length,
  };
}

export async function getAdminInsightBySlug(
  slug: string,
): Promise<AdminInsightEditorRecord | null> {
  await requireCurrentAdminAccess(`/admin/insights/${slug}`);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "content_md, cover_image_url, excerpt, id, published, published_at, seo_description, seo_title, slug, tags, title, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    contentMd: data.content_md,
    coverImageUrl: data.cover_image_url,
    excerpt: data.excerpt ?? "",
    id: data.id,
    published: data.published,
    publishedAt: data.published_at,
    seoDescription: data.seo_description ?? "",
    seoTitle: data.seo_title ?? "",
    slug: data.slug,
    tags: data.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
    title: data.title,
    updatedAt: data.updated_at,
  };
}

export async function createAdminInsight(
  _prevState: AdminInsightEditorState,
  formData: FormData,
): Promise<AdminInsightEditorState> {
  "use server";

  await requireCurrentAdminAccess("/admin/insights/new");

  const rawInput = readInsightEditorFormData(formData);
  const parsedInput = insightEditorSchema.safeParse({
    contentMd: normalizeStringEntry(rawInput.contentMd),
    excerpt: normalizeStringEntry(rawInput.excerpt),
    published: rawInput.published,
    seoDescription: normalizeStringEntry(rawInput.seoDescription),
    seoTitle: normalizeStringEntry(rawInput.seoTitle),
    slug: normalizeStringEntry(rawInput.slug),
    tagLines: normalizeStringEntry(rawInput.tagLines),
    title: normalizeStringEntry(rawInput.title),
  });

  if (!parsedInput.success) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      buildInsightEditorFieldErrors(parsedInput.error),
    );
  }

  const normalizedInput = buildNormalizedInsightPayload(parsedInput.data);

  if (normalizedInput.errorState || !normalizedInput.payload) {
    return normalizedInput.errorState as AdminInsightEditorState;
  }

  const coverImageFile = isFileEntry(rawInput.coverImage)
    ? rawInput.coverImage
    : null;
  const uploadedObjectPaths: string[] = [];

  try {
    const slugExists = await ensureUniqueInsightSlug({
      slug: normalizedInput.payload.slug,
    });

    if (slugExists) {
      return createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          slug: "That slug is already in use by another post.",
        },
      );
    }

    let coverImageUrl: string | null = null;

    if (coverImageFile) {
      const uploadResult = await uploadBlogImage({
        file: coverImageFile,
        kind: "cover",
        slug: normalizedInput.payload.slug,
      });

      uploadedObjectPaths.push(uploadResult.objectPath);
      coverImageUrl = uploadResult.publicUrl;
    }

    const insertPayload: Database["public"]["Tables"]["posts"]["Insert"] = {
      content_md: normalizedInput.payload.contentMd,
      cover_image_url: coverImageUrl,
      excerpt: normalizedInput.payload.excerpt,
      published: normalizedInput.payload.published,
      published_at: normalizedInput.payload.publishedAt,
      seo_description: normalizedInput.payload.seoDescription,
      seo_title: normalizedInput.payload.seoTitle,
      slug: normalizedInput.payload.slug,
      tags: normalizedInput.payload.tags,
      title: normalizedInput.payload.title,
    };
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("posts").insert(insertPayload);

    if (error) {
      await deleteManagedBlogObjects(uploadedObjectPaths).catch(
        (cleanupError) => {
          console.error(
            "Admin insight upload cleanup failed after create error",
            cleanupError,
          );
        },
      );

      console.error("Admin insight create failed", {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message,
        slug: normalizedInput.payload.slug,
      });

      return createActionErrorState(
        "The post could not be created right now. Try again.",
      );
    }

    revalidateInsightRoutes(normalizedInput.payload.slug);

    return createActionSuccessState({
      message: "Post created. Redirecting to the editor.",
      redirectTo: `/admin/insights/${normalizedInput.payload.slug}?status=created`,
    });
  } catch (error) {
    await deleteManagedBlogObjects(uploadedObjectPaths).catch(
      (cleanupError) => {
        console.error(
          "Admin insight upload cleanup failed after create exception",
          cleanupError,
        );
      },
    );

    const message =
      error instanceof Error
        ? error.message
        : "The post could not be created right now. Try again.";
    const fieldErrors: AdminInsightEditorFieldErrors = {};

    if (message.includes("image")) {
      fieldErrors.coverImage = message;
    }

    console.error("Admin insight create threw an unexpected error", error);

    return createActionErrorState(
      message === "Invalid image upload."
        ? "Check the highlighted fields and try again."
        : message,
      fieldErrors,
    );
  }
}

export async function updateAdminInsight(
  _prevState: AdminInsightEditorState,
  formData: FormData,
): Promise<AdminInsightEditorState> {
  "use server";

  const rawInput = readInsightEditorFormData(formData);
  const currentSlug = normalizeStringEntry(rawInput.currentSlug);

  await requireCurrentAdminAccess(
    currentSlug ? `/admin/insights/${currentSlug}` : "/admin/insights",
  );

  const parsedInput = insightUpdateSchema.safeParse({
    contentMd: normalizeStringEntry(rawInput.contentMd),
    currentSlug,
    excerpt: normalizeStringEntry(rawInput.excerpt),
    postId: normalizeStringEntry(rawInput.postId),
    published: rawInput.published,
    removeCoverImage: rawInput.removeCoverImage,
    seoDescription: normalizeStringEntry(rawInput.seoDescription),
    seoTitle: normalizeStringEntry(rawInput.seoTitle),
    slug: normalizeStringEntry(rawInput.slug),
    tagLines: normalizeStringEntry(rawInput.tagLines),
    title: normalizeStringEntry(rawInput.title),
  });

  if (!parsedInput.success) {
    return createActionErrorState(
      "Check the highlighted fields and try again.",
      buildInsightEditorFieldErrors(parsedInput.error),
    );
  }

  const normalizedInput = buildNormalizedInsightPayload(parsedInput.data);

  if (normalizedInput.errorState || !normalizedInput.payload) {
    return normalizedInput.errorState as AdminInsightEditorState;
  }

  try {
    const slugExists = await ensureUniqueInsightSlug({
      postId: parsedInput.data.postId,
      slug: normalizedInput.payload.slug,
    });

    if (slugExists) {
      return createActionErrorState(
        "Check the highlighted fields and try again.",
        {
          slug: "That slug is already in use by another post.",
        },
      );
    }
  } catch (error) {
    console.error("Admin insight slug validation failed", error);

    return createActionErrorState(
      "The post could not be validated right now. Try again.",
    );
  }

  const existingPost = await getAdminInsightBySlug(currentSlug);

  if (!existingPost || existingPost.id !== parsedInput.data.postId) {
    return createActionErrorState(
      "That post could not be found anymore. Refresh and try again.",
    );
  }

  const coverImageFile = isFileEntry(rawInput.coverImage)
    ? rawInput.coverImage
    : null;
  const uploadedObjectPaths: string[] = [];

  try {
    let nextCoverImageUrl =
      parsedInput.data.removeCoverImage && !coverImageFile
        ? null
        : existingPost.coverImageUrl;

    if (coverImageFile) {
      const uploadResult = await uploadBlogImage({
        file: coverImageFile,
        kind: "cover",
        slug: normalizedInput.payload.slug,
      });

      uploadedObjectPaths.push(uploadResult.objectPath);
      nextCoverImageUrl = uploadResult.publicUrl;
    }

    const nextPublishedAt = normalizedInput.payload.published
      ? (existingPost.publishedAt ?? normalizedInput.payload.publishedAt)
      : null;
    const updatePayload: Database["public"]["Tables"]["posts"]["Update"] = {
      content_md: normalizedInput.payload.contentMd,
      cover_image_url: nextCoverImageUrl,
      excerpt: normalizedInput.payload.excerpt,
      published: normalizedInput.payload.published,
      published_at: nextPublishedAt,
      seo_description: normalizedInput.payload.seoDescription,
      seo_title: normalizedInput.payload.seoTitle,
      slug: normalizedInput.payload.slug,
      tags: normalizedInput.payload.tags,
      title: normalizedInput.payload.title,
    };
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("posts")
      .update(updatePayload)
      .eq("id", parsedInput.data.postId)
      .select("slug")
      .maybeSingle();

    if (error || !data) {
      await deleteManagedBlogObjects(uploadedObjectPaths).catch(
        (cleanupError) => {
          console.error(
            "Admin insight upload cleanup failed after update error",
            cleanupError,
          );
        },
      );

      console.error("Admin insight update failed", {
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        message: error?.message,
        postId: parsedInput.data.postId,
        slug: normalizedInput.payload.slug,
      });

      return createActionErrorState(
        "The post changes could not be saved right now. Try again.",
      );
    }

    const coverUrlToDelete =
      existingPost.coverImageUrl &&
      (parsedInput.data.removeCoverImage || Boolean(coverImageFile))
        ? extractManagedBlogObjectPathFromUrl(existingPost.coverImageUrl)
        : null;

    if (coverUrlToDelete) {
      await deleteManagedBlogObjects([coverUrlToDelete]).catch(
        (cleanupError) => {
          console.error(
            "Admin insight cover cleanup failed after save",
            cleanupError,
          );
        },
      );
    }

    revalidateInsightRoutes(currentSlug);

    if (normalizedInput.payload.slug !== currentSlug) {
      revalidateInsightRoutes(normalizedInput.payload.slug);
    }

    return createActionSuccessState({
      message: "Post changes saved. Refreshing the editor.",
      redirectTo: `/admin/insights/${normalizedInput.payload.slug}?status=saved`,
    });
  } catch (error) {
    await deleteManagedBlogObjects(uploadedObjectPaths).catch(
      (cleanupError) => {
        console.error(
          "Admin insight upload cleanup failed after exception",
          cleanupError,
        );
      },
    );

    const message =
      error instanceof Error
        ? error.message
        : "The post changes could not be saved right now. Try again.";
    const fieldErrors: AdminInsightEditorFieldErrors = {};

    if (message.includes("image")) {
      fieldErrors.coverImage = message;
    }

    console.error("Admin insight update threw an unexpected error", error);

    return createActionErrorState(
      message === "Invalid image upload."
        ? "Check the highlighted fields and try again."
        : message,
      fieldErrors,
    );
  }
}

export async function uploadAdminInsightContentImage(
  _prevState: AdminInsightMediaState,
  formData: FormData,
): Promise<AdminInsightMediaState> {
  "use server";

  const rawInput = readContentImageUploadFormData(formData);
  const currentSlug = normalizeStringEntry(rawInput.currentSlug);

  await requireCurrentAdminAccess(
    currentSlug ? `/admin/insights/${currentSlug}` : "/admin/insights",
  );

  const parsedInput = contentImageUploadSchema.safeParse({
    contentImageAlt: normalizeStringEntry(rawInput.contentImageAlt),
    currentSlug,
  });

  if (!parsedInput.success) {
    return createMediaErrorState(
      "Check the image upload fields and try again.",
    );
  }

  const contentImageFile = isFileEntry(rawInput.contentImage)
    ? rawInput.contentImage
    : null;

  if (!contentImageFile) {
    return createMediaErrorState("Choose an image file before uploading.");
  }

  try {
    const uploadResult = await uploadBlogImage({
      file: contentImageFile,
      kind: "content",
      slug: parsedInput.data.currentSlug,
    });
    const altText = parsedInput.data.contentImageAlt?.trim() || "Alt text";

    return createMediaSuccessState({
      message:
        "Image uploaded. Insert the markdown snippet into the article body.",
      snippet: `![${altText}](${uploadResult.publicUrl})`,
      uploadedUrl: uploadResult.publicUrl,
    });
  } catch (error) {
    console.error("Admin insight content image upload failed", error);

    return createMediaErrorState(
      error instanceof Error
        ? error.message
        : "The image could not be uploaded right now. Try again.",
    );
  }
}

export async function toggleAdminInsightPublished(formData: FormData) {
  "use server";

  await requireCurrentAdminAccess("/admin/insights");

  const parsedInput = publishActionSchema.safeParse({
    currentPublished: formData.get("currentPublished"),
    currentPublishedAt: formData.get("currentPublishedAt"),
    postId: formData.get("postId"),
    publishedFilter: formData.get("publishedFilter"),
    slug: formData.get("slug"),
    tagFilter: formData.get("tagFilter"),
  });

  if (!parsedInput.success) {
    redirect(buildInsightsReturnPath({ status: "invalid-action" }));
  }

  const {
    currentPublished,
    currentPublishedAt,
    postId,
    publishedFilter,
    slug,
    tagFilter,
  } = parsedInput.data;
  const nextPublished = currentPublished !== "true";
  const nextPublishedAt = nextPublished
    ? currentPublishedAt || new Date().toISOString()
    : null;
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("posts")
    .update({
      published: nextPublished,
      published_at: nextPublishedAt,
    })
    .eq("id", postId);

  if (error) {
    redirect(
      buildInsightsReturnPath({
        publishedFilter,
        status: "update-error",
        tag: tagFilter,
      }),
    );
  }

  revalidateInsightRoutes(slug);

  redirect(
    buildInsightsReturnPath({
      publishedFilter,
      status: "publish-updated",
      tag: tagFilter,
    }),
  );
}
