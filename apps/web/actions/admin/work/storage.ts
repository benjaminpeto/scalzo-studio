import {
  buildUniqueStorageFileName,
  normalizeStringEntry,
} from "@/actions/admin/shared/helpers";
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

const caseStudyBucketId = storageBuckets.caseStudies.id;

export function extractManagedCaseStudyObjectPathFromUrl(url: string) {
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

    const expectedPrefix = `/storage/v1/object/public/${caseStudyBucketId}/`;

    if (!parsedUrl.pathname.startsWith(expectedPrefix)) {
      return null;
    }

    const objectPath = decodeURIComponent(
      parsedUrl.pathname.slice(expectedPrefix.length),
    );

    return isValidStorageObjectPath(caseStudyBucketId, objectPath)
      ? objectPath
      : null;
  } catch {
    return null;
  }
}

export async function deleteManagedCaseStudyObjects(objectPaths: string[]) {
  const uniquePaths = Array.from(new Set(objectPaths.filter(Boolean)));

  if (!uniquePaths.length) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.storage
    .from(caseStudyBucketId)
    .remove(uniquePaths);

  if (error) {
    throw error;
  }

  await deleteMediaAssetsByObjectPaths({
    bucketId: caseStudyBucketId,
    objectPaths: uniquePaths,
  });
}

export async function uploadCaseStudyImage(input: {
  altText: string;
  file: File;
  kind: "cover" | "gallery";
  slug: string;
}) {
  const objectPath = buildStorageObjectPath({
    bucketId: caseStudyBucketId,
    fileName: buildUniqueStorageFileName(input.file.name),
    kind: input.kind,
    slug: input.slug,
  });
  const validationResult = validateStorageUploadInput({
    bucketId: caseStudyBucketId,
    contentType: input.file.type,
    fileSizeBytes: input.file.size,
    objectPath,
  });

  if (!validationResult.isValid) {
    throw new Error(validationResult.issues[0] ?? "Invalid image upload.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.storage
    .from(caseStudyBucketId)
    .upload(objectPath, input.file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const publicUrl = getPublicStorageObjectUrl(
    supabase,
    caseStudyBucketId,
    objectPath,
  );

  try {
    const metadata = await extractImageMetadata(input.file);

    await upsertMediaAsset({
      altText: input.altText.trim(),
      blurDataUrl: metadata.blurDataUrl,
      bucketId: caseStudyBucketId,
      height: metadata.height,
      kind: input.kind === "cover" ? "case-study-cover" : "case-study-gallery",
      objectPath,
      publicUrl,
      width: metadata.width,
    });
  } catch (metadataError) {
    await supabase.storage.from(caseStudyBucketId).remove([objectPath]);
    throw metadataError;
  }

  return {
    objectPath,
    publicUrl,
  };
}

export async function syncCaseStudyImageAltText(input: {
  altText: string;
  publicUrl: string;
}) {
  await updateMediaAssetAltText(input);
}

export function buildExistingGalleryImageAltEntries(input: {
  alts: FormDataEntryValue[];
  urls: FormDataEntryValue[];
}) {
  return input.urls.map((entry, index) => ({
    alt: normalizeStringEntry(input.alts[index]).trim(),
    url: normalizeStringEntry(entry).trim(),
  }));
}
