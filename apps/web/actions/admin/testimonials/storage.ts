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

const testimonialAvatarBucketId = storageBuckets.testimonialAvatars.id;

export function extractManagedTestimonialAvatarObjectPathFromUrl(url: string) {
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

    const expectedPrefix = `/storage/v1/object/public/${testimonialAvatarBucketId}/`;

    if (!parsedUrl.pathname.startsWith(expectedPrefix)) {
      return null;
    }

    const objectPath = decodeURIComponent(
      parsedUrl.pathname.slice(expectedPrefix.length),
    );

    return isValidStorageObjectPath(testimonialAvatarBucketId, objectPath)
      ? objectPath
      : null;
  } catch {
    return null;
  }
}

export async function deleteManagedTestimonialAvatarObjects(
  objectPaths: string[],
) {
  const uniquePaths = Array.from(new Set(objectPaths.filter(Boolean)));

  if (!uniquePaths.length) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.storage
    .from(testimonialAvatarBucketId)
    .remove(uniquePaths);

  if (error) {
    throw error;
  }

  await deleteMediaAssetsByObjectPaths({
    bucketId: testimonialAvatarBucketId,
    objectPaths: uniquePaths,
  });
}

export async function uploadTestimonialAvatar(input: {
  altText: string;
  file: File;
  testimonialId: string;
}) {
  const objectPath = buildStorageObjectPath({
    bucketId: testimonialAvatarBucketId,
    fileName: buildUniqueStorageFileName(input.file.name),
    kind: "avatar",
    testimonialId: input.testimonialId,
  });
  const validationResult = validateStorageUploadInput({
    bucketId: testimonialAvatarBucketId,
    contentType: input.file.type,
    fileSizeBytes: input.file.size,
    objectPath,
  });

  if (!validationResult.isValid) {
    throw new Error(validationResult.issues[0] ?? "Invalid image upload.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.storage
    .from(testimonialAvatarBucketId)
    .upload(objectPath, input.file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const publicUrl = getPublicStorageObjectUrl(
    supabase,
    testimonialAvatarBucketId,
    objectPath,
  );

  try {
    const metadata = await extractImageMetadata(input.file);

    await upsertMediaAsset({
      altText: input.altText.trim(),
      blurDataUrl: metadata.blurDataUrl,
      bucketId: testimonialAvatarBucketId,
      height: metadata.height,
      kind: "testimonial-avatar",
      objectPath,
      publicUrl,
      width: metadata.width,
    });
  } catch (metadataError) {
    await supabase.storage.from(testimonialAvatarBucketId).remove([objectPath]);
    throw metadataError;
  }

  return {
    objectPath,
    publicUrl,
  };
}

export async function syncTestimonialAvatarAltText(input: {
  altText: string;
  publicUrl: string;
}) {
  await updateMediaAssetAltText(input);
}
