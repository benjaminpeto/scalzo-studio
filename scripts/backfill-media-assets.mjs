import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const rootDir = process.cwd();
const envFiles = [
  path.join(rootDir, ".env.local"),
  path.join(rootDir, "apps/web/.env.local"),
];

const BLUR_PLACEHOLDER_WIDTH = 24;
const BLUR_PLACEHOLDER_QUALITY = 70;

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

for (const envFile of envFiles) {
  loadEnvFile(envFile);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for media backfill.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function inferKind(bucketId, objectPath) {
  const [, variant] = objectPath.split("/");

  if (bucketId === "case-study-images") {
    return variant === "gallery" ? "case-study-gallery" : "case-study-cover";
  }

  if (bucketId === "blog-images") {
    return variant === "content" ? "insight-content" : "insight-cover";
  }

  return "testimonial-avatar";
}

function extractInsightImageUrls(content) {
  return Array.from(
    new Set(
      [...content.matchAll(/!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)]
        .map((match) => match[1]?.trim())
        .filter(Boolean),
    ),
  );
}

function parsePublicStorageUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const match = parsedUrl.pathname.match(
      /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/,
    );

    if (!match) {
      return null;
    }

    return {
      bucketId: decodeURIComponent(match[1]),
      objectPath: decodeURIComponent(match[2]),
      publicUrl: url,
    };
  } catch {
    return null;
  }
}

async function buildMetadataFromUrl(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to fetch media asset: ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const image = sharp(buffer, { failOn: "warning" });
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to determine image dimensions: ${url}`);
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

async function main() {
  const [
    caseStudiesResult,
    postsResult,
    testimonialsResult,
    existingAssetsResult,
  ] = await Promise.all([
    supabase
      .from("case_studies")
      .select("cover_image_url, gallery_urls")
      .not("cover_image_url", "is", null),
    supabase.from("posts").select("content_md, cover_image_url"),
    supabase.from("testimonials").select("avatar_url"),
    supabase.from("media_assets").select("alt_text, public_url"),
  ]);

  if (
    caseStudiesResult.error ||
    postsResult.error ||
    testimonialsResult.error
  ) {
    throw (
      caseStudiesResult.error || postsResult.error || testimonialsResult.error
    );
  }

  const existingAltByUrl = new Map(
    (existingAssetsResult.data ?? []).map((asset) => [
      asset.public_url,
      asset.alt_text,
    ]),
  );

  const candidateUrls = new Set();

  for (const caseStudy of caseStudiesResult.data ?? []) {
    if (caseStudy.cover_image_url) {
      candidateUrls.add(caseStudy.cover_image_url);
    }

    for (const url of caseStudy.gallery_urls ?? []) {
      candidateUrls.add(url);
    }
  }

  for (const post of postsResult.data ?? []) {
    if (post.cover_image_url) {
      candidateUrls.add(post.cover_image_url);
    }

    for (const url of extractInsightImageUrls(post.content_md ?? "")) {
      candidateUrls.add(url);
    }
  }

  for (const testimonial of testimonialsResult.data ?? []) {
    if (testimonial.avatar_url) {
      candidateUrls.add(testimonial.avatar_url);
    }
  }

  const assets = [...candidateUrls]
    .map((url) => parsePublicStorageUrl(url))
    .filter(Boolean);

  let processed = 0;

  for (const asset of assets) {
    const metadata = await buildMetadataFromUrl(asset.publicUrl);
    const { error } = await supabase.from("media_assets").upsert(
      {
        alt_text: existingAltByUrl.get(asset.publicUrl) ?? null,
        blur_data_url: metadata.blurDataUrl,
        bucket_id: asset.bucketId,
        height: metadata.height,
        kind: inferKind(asset.bucketId, asset.objectPath),
        object_path: asset.objectPath,
        public_url: asset.publicUrl,
        width: metadata.width,
      },
      { onConflict: "bucket_id,object_path" },
    );

    if (error) {
      throw error;
    }

    processed += 1;
  }

  console.log(`Backfilled ${processed} media assets.`);
}

main().catch((error) => {
  console.error("Media asset backfill failed.");
  console.error(error);
  process.exitCode = 1;
});
