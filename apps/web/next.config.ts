import type { NextConfig } from "next";

function getSupabaseRemotePatterns(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return [];
  }

  try {
    const url = new URL(supabaseUrl);

    return [
      {
        hostname: url.hostname,
        pathname: "/storage/v1/object/public/**",
        port: url.port,
        protocol: url.protocol.replace(":", "") as "http" | "https",
      },
    ];
  } catch {
    return [];
  }
}

const deploymentAssetHeaders = [
  {
    source: "/placeholders/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=0, must-revalidate",
      },
      {
        key: "Vercel-CDN-Cache-Control",
        value: "s-maxage=86400, stale-while-revalidate=604800",
      },
    ],
  },
  {
    source: "/favicon.ico",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=0, must-revalidate",
      },
      {
        key: "Vercel-CDN-Cache-Control",
        value: "s-maxage=86400, stale-while-revalidate=604800",
      },
    ],
  },
  {
    source: "/opengraph-image.png",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=0, must-revalidate",
      },
      {
        key: "Vercel-CDN-Cache-Control",
        value: "s-maxage=86400, stale-while-revalidate=604800",
      },
    ],
  },
  {
    source: "/twitter-image.png",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=0, must-revalidate",
      },
      {
        key: "Vercel-CDN-Cache-Control",
        value: "s-maxage=86400, stale-while-revalidate=604800",
      },
    ],
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    externalDir: true,
  },
  images: {
    remotePatterns: getSupabaseRemotePatterns(),
  },
  async headers() {
    return deploymentAssetHeaders;
  },
};

export default nextConfig;
