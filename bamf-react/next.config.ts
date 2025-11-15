import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // If you use Unsplash
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com", // If you use Cloudinary
      },
      // Add more as needed
    ],
  },
};

export default nextConfig;