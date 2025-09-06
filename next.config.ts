import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

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
        hostname: '**',
        // pathname: '/**', // allow all paths
      },
    ],
  },
};

const withPWA = withPWAInit({
  dest: "public", // Destination directory for the service worker files
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true, // Automatically register the service worker
  workboxOptions: {
    skipWaiting: true,
  },
});

export default withPWA(nextConfig);
