import { buildUniqueStorageFileName } from "@/actions/admin/shared/helpers";
import {
  deleteMediaAssetsByObjectPaths,
  updateMediaAssetAltText,
  upsertMediaAsset,
} from "@/actions/media-assets/server";
import { extractImageMetadata } from "@/lib/media-assets/server";
import { publicEnv } from "@/lib/env/public";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  buildStorageObjectPath,
  getPublicStorageObjectUrl,
  isValidStorageObjectPath,
  storageBuckets,
  validateStorageUploadInput,
} from "@/lib/supabase/storage";

const blogBucketId = storageBuckets.blog.id;

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
