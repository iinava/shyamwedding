import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve the couple's photographs in modern formats by default.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 390, 430, 640, 828, 1080, 1400],
  },
};

export default nextConfig;
