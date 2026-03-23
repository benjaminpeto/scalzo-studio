import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

export const STORAGE_IMAGE_ALLOWED_MIME_TYPES = [
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const STORAGE_IMAGE_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const STORAGE_FILE_EXTENSION_PATTERN = /\.(avif|jpe?g|png|webp)$/;
const STORAGE_FILE_NAME_PATTERN =
  /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?\.(?:avif|jpe?g|png|webp)$/;
const STORAGE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const storageBuckets = {
  caseStudies: {
    id: "case-study-images",
    pathPattern:
      /^[a-z0-9]+(?:-[a-z0-9]+)*\/(cover|gallery)\/[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?\.(?:avif|jpe?g|png|webp)$/,
    visibility: "public",
  },
  blog: {
    id: "blog-images",
    pathPattern:
      /^[a-z0-9]+(?:-[a-z0-9]+)*\/(cover|content)\/[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?\.(?:avif|jpe?g|png|webp)$/,
    visibility: "public",
  },
} as const;

export type StorageBucketId =
  (typeof storageBuckets)[keyof typeof storageBuckets]["id"];
export type CaseStudyImageKind = "cover" | "gallery";
export type BlogImageKind = "cover" | "content";

type StorageVisibility =
  (typeof storageBuckets)[keyof typeof storageBuckets]["visibility"];

type StorageBucketConfig = {
  id: StorageBucketId;
  pathPattern: RegExp;
  visibility: StorageVisibility;
};

type StorageTarget =
  | {
      bucketId: typeof storageBuckets.caseStudies.id;
      fileName: string;
      kind: CaseStudyImageKind;
      slug: string;
    }
  | {
      bucketId: typeof storageBuckets.blog.id;
      fileName: string;
      kind: BlogImageKind;
      slug: string;
    };

export interface StorageUploadValidationInput {
  bucketId: StorageBucketId;
  contentType: string;
  fileSizeBytes: number;
  objectPath: string;
}

function getStorageBucketConfig(
  bucketId: StorageBucketId,
): StorageBucketConfig {
  const config = Object.values(storageBuckets).find(
    (candidate) => candidate.id === bucketId,
  );

  if (!config) {
    throw new Error(`Unsupported storage bucket: ${bucketId}`);
  }

  return config;
}

function normalizeSlug(slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();

  if (!STORAGE_SLUG_PATTERN.test(normalizedSlug)) {
    throw new Error(
      `Invalid storage slug "${slug}". Expected a lowercase kebab-case slug.`,
    );
  }

  return normalizedSlug;
}

function normalizeFileName(fileName: string) {
  const trimmedFileName = fileName.trim();
  const fileNameWithoutPath = trimmedFileName.split(/[\\/]/).pop() ?? "";
  const normalizedBaseName = fileNameWithoutPath
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+|\.+$/g, "")
    .replace(/^-+|-+$/g, "");

  if (!STORAGE_FILE_EXTENSION_PATTERN.test(normalizedBaseName)) {
    throw new Error(
      `Invalid storage file name "${fileName}". Expected one of: ${STORAGE_IMAGE_ALLOWED_MIME_TYPES.join(", ")}.`,
    );
  }

  if (!STORAGE_FILE_NAME_PATTERN.test(normalizedBaseName)) {
    throw new Error(`Invalid storage file name "${fileName}".`);
  }

  return normalizedBaseName;
}

export function buildStorageObjectPath(target: StorageTarget) {
  const slug = normalizeSlug(target.slug);
  const fileName = normalizeFileName(target.fileName);

  return `${slug}/${target.kind}/${fileName}`;
}

export function isValidStorageObjectPath(
  bucketId: StorageBucketId,
  objectPath: string,
) {
  return getStorageBucketConfig(bucketId).pathPattern.test(objectPath);
}

export function validateStorageUploadInput(
  input: StorageUploadValidationInput,
) {
  const issues: string[] = [];

  if (!STORAGE_IMAGE_ALLOWED_MIME_TYPES.includes(input.contentType as never)) {
    issues.push(
      `Unsupported content type "${input.contentType}". Expected one of: ${STORAGE_IMAGE_ALLOWED_MIME_TYPES.join(", ")}.`,
    );
  }

  if (input.fileSizeBytes > STORAGE_IMAGE_MAX_FILE_SIZE_BYTES) {
    issues.push(
      `File size ${input.fileSizeBytes} exceeds the ${STORAGE_IMAGE_MAX_FILE_SIZE_BYTES}-byte limit.`,
    );
  }

  if (!isValidStorageObjectPath(input.bucketId, input.objectPath)) {
    issues.push(
      `Invalid object path "${input.objectPath}" for bucket "${input.bucketId}".`,
    );
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

export function getPublicStorageObjectUrl(
  supabase: SupabaseClient<Database>,
  bucketId: StorageBucketId,
  objectPath: string,
) {
  const bucketConfig = getStorageBucketConfig(bucketId);

  if (bucketConfig.visibility !== "public") {
    throw new Error(`Bucket "${bucketId}" does not expose public URLs.`);
  }

  const { data } = supabase.storage.from(bucketId).getPublicUrl(objectPath);

  return data.publicUrl;
}

export async function createSignedStorageObjectUrl(
  supabase: SupabaseClient<Database>,
  bucketId: StorageBucketId,
  objectPath: string,
  expiresInSeconds = 60 * 60,
) {
  const { data, error } = await supabase.storage
    .from(bucketId)
    .createSignedUrl(objectPath, expiresInSeconds);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}

export async function resolveStorageObjectUrl(
  supabase: SupabaseClient<Database>,
  bucketId: StorageBucketId,
  objectPath: string,
  signedUrlExpiresInSeconds = 60 * 60,
) {
  const bucketConfig = getStorageBucketConfig(bucketId);

  if (bucketConfig.visibility === "public") {
    return getPublicStorageObjectUrl(supabase, bucketId, objectPath);
  }

  return createSignedStorageObjectUrl(
    supabase,
    bucketId,
    objectPath,
    signedUrlExpiresInSeconds,
  );
}
