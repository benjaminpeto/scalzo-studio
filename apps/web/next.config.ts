import type { NextConfig } from "next";

function getSupabaseImageConfig(): Pick<
  NonNullable<NextConfig["images"]>,
  "dangerouslyAllowLocalIP" | "remotePatterns"
> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return {
      dangerouslyAllowLocalIP: false,
      remotePatterns: [],
    };
  }

  try {
    const url = new URL(supabaseUrl);
    const isLocalSupabaseHost =
      url.hostname === "127.0.0.1" || url.hostname === "localhost";
    const hostnames = new Set<string>([url.hostname]);

    if (isLocalSupabaseHost) {
      hostnames.add("127.0.0.1");
      hostnames.add("localhost");
    }

    return [
      {
        dangerouslyAllowLocalIP: isLocalSupabaseHost,
        remotePatterns: Array.from(hostnames).map((hostname) => ({
          hostname,
          pathname: "/storage/v1/object/public/**",
          port: url.port,
          protocol: url.protocol.replace(":", "") as "http" | "https",
        })),
      },
    ][0];
  } catch {
    return {
      dangerouslyAllowLocalIP: false,
      remotePatterns: [],
    };
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
  images: getSupabaseImageConfig(),
  skipTrailingSlashRedirect: true,
  async headers() {
    return deploymentAssetHeaders;
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
};

export default nextConfig;
