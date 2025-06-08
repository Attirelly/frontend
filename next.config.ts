import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'attirellydev.s3.ap-south-1.amazonaws.com',
        pathname: '/**', // allow all paths
      },
    ],
  }
};

export default nextConfig;
