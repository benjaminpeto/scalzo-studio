import "server-only";

import sharp from "sharp";

import type { Database } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { StorageBucketId } from "@/lib/supabase/storage";
import type {
  CmsImageAsset,
  CmsManagedImageKind,
} from "@/interfaces/media-assets";

import { createCmsImageAsset, defaultCmsImageDimensions } from "./shared";

const BLUR_PLACEHOLDER_WIDTH = 24;
const BLUR_PLACEHOLDER_QUALITY = 70;

// TODO move server actions out from here!!!!!!
type MediaAssetRow = Database["public"]["Tables"]["media_assets"]["Row"];

async function toBuffer(input: Buffer | File) {
  if ("arrayBuffer" in input) {
    return Buffer.from(await input.arrayBuffer());
  }

  return input;
}

export async function extractImageMetadata(input: Buffer | File) {
  const buffer = await toBuffer(input);
  const image = sharp(buffer, { failOn: "warning" });
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Unable to determine the uploaded image dimensions.");
  }

  const blurBuffer = await image
    .resize(BLUR_PLACEHOLDER_WIDTH)
    .webp({ quality: BLUR_PLACEHOLDER_QUALITY })
    .toBuffer();

  return {
    blurDataUrl: `data:image/webp;base64,${blurBuffer.toString("base64")}`,
    height: metadata.height,
    width: metadata.width,
  };
}

export async function upsertMediaAsset(input: {
  altText: string | null;
  blurDataUrl: string;
  bucketId: StorageBucketId;
  height: number;
  kind: CmsManagedImageKind;
  objectPath: string;
  publicUrl: string;
  width: number;
}) {
  const supabase = await createServerSupabaseClient();
  const payload: Database["public"]["Tables"]["media_assets"]["Insert"] = {
    alt_text: input.altText,
    blur_data_url: input.blurDataUrl,
    bucket_id: input.bucketId,
    height: input.height,
    kind: input.kind,
    object_path: input.objectPath,
    public_url: input.publicUrl,
    width: input.width,
  };
  const { error } = await supabase
    .from("media_assets")
    .upsert(payload, { onConflict: "bucket_id,object_path" });

  if (error) {
    throw error;
  }
}

export async function updateMediaAssetAltText(input: {
  altText: string;
  publicUrl: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("media_assets")
    .update({
      alt_text: input.altText.trim(),
    })
    .eq("public_url", input.publicUrl);

  if (error) {
    throw error;
  }
}

export async function deleteMediaAssetsByObjectPaths(input: {
  bucketId: StorageBucketId;
  objectPaths: string[];
}) {
  const objectPaths = Array.from(new Set(input.objectPaths.filter(Boolean)));

  if (!objectPaths.length) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("media_assets")
    .delete()
    .eq("bucket_id", input.bucketId)
    .in("object_path", objectPaths);

  if (error) {
    throw error;
  }
}

function createResolvedCmsImageAsset(input: {
  fallbackAlt: string;
  record?: Pick<
    MediaAssetRow,
    "alt_text" | "blur_data_url" | "height" | "public_url" | "width"
  > | null;
  url: string;
}): CmsImageAsset {
  const alt = input.record?.alt_text?.trim() || input.fallbackAlt.trim();

  return createCmsImageAsset({
    alt,
    blurDataUrl: input.record?.blur_data_url,
    height: input.record?.height ?? defaultCmsImageDimensions.height,
    src: input.url,
    width: input.record?.width ?? defaultCmsImageDimensions.width,
  });
}

export async function resolveCmsImageAssetMap(
  input: Array<{
    fallbackAlt: string;
    url: string | null | undefined;
  }>,
) {
  const entries = input.filter(
    (entry): entry is { fallbackAlt: string; url: string } =>
      typeof entry.url === "string" && entry.url.trim().length > 0,
  );

  if (!entries.length) {
    return {} as Record<string, CmsImageAsset>;
  }

  const urls = Array.from(new Set(entries.map((entry) => entry.url.trim())));
  const mediaAssetsByUrl = await getMediaAssetRecordMap(urls);

  return Object.fromEntries(
    entries.map((entry) => [
      entry.url,
      createResolvedCmsImageAsset({
        fallbackAlt: entry.fallbackAlt,
        record: mediaAssetsByUrl.get(entry.url),
        url: entry.url,
      }),
    ]),
  ) as Record<string, CmsImageAsset>;
}

export async function getMediaAssetRecordMap(urls: string[]) {
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));

  if (!uniqueUrls.length) {
    return new Map<string, MediaAssetRow>();
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select(
      "alt_text, blur_data_url, bucket_id, height, id, kind, object_path, public_url, width",
    )
    .in("public_url", uniqueUrls);

  if (error) {
    throw error;
  }

  return new Map((data ?? []).map((record) => [record.public_url, record]));
}
