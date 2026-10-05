import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  outputFileTracingRoot: path.resolve(__dirname),
  // Keep Turbopack scoped to this app when a parent directory has a lockfile.
=======
  // Explicitly set turbopack root to this package directory to prevent
  // confusion from the root-level package-lock.json at d:\kavon 2\kavon.net\
>>>>>>> 0046e567ddbf60b0a1c0c1c6fa8ee5d2dd390c70
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
<<<<<<< HEAD
      {
        protocol: "https",
        hostname: "**",
      },
=======
>>>>>>> 0046e567ddbf60b0a1c0c1c6fa8ee5d2dd390c70
    ],
  },
};

export default nextConfig;
