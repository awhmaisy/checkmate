import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Completely disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
