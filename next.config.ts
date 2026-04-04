import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "cdn.imagin.studio" },
      { hostname: "i.ytimg.com" },
      { hostname: "upload.wikimedia.org" },
      { hostname: "images.unsplash.com" },
      { hostname: "**.supabase.co" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
