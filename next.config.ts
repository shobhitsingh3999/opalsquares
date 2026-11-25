import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Branded 404 for unmatched URLs (needed because the app has two root layouts).
  experimental: { globalNotFound: true },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      // Every theme/plugin asset is mirrored in public/. Anything the original
      // WordPress scripts request at runtime that was not mirrored is proxied to
      // the live site so behaviour stays identical.
      fallback: [
        {
          source: "/wp-content/:path*",
          destination: "https://opalsquare.in/wp-content/:path*",
        },
        {
          source: "/wp-includes/:path*",
          destination: "https://opalsquare.in/wp-includes/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
