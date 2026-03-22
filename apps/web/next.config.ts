import type { NextConfig } from "next";

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
  async headers() {
    return deploymentAssetHeaders;
  },
};

export default nextConfig;
