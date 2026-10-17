import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: false,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nexus-vyoma.s3.ap-south-2.amazonaws.com",
        pathname: "/event-banners/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/event',
        destination: '/events',
        permanent: true,
      },
      {
        source: '/enroll-event',
        destination: '/register/enroll-event',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
