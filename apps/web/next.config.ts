import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
