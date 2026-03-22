// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       // Azure Blob Storage
//       { protocol: "https", hostname: "storagerealestateapp3000.blob.core.windows.net" },
//       // Unsplash (seed demo images)
//       { protocol: "https", hostname: "images.unsplash.com" },
//     ],
//     // Higher quality for property photos
//     qualities: [75, 85, 90, 100],
//     formats: ["image/avif", "image/webp"],
//   },
//   experimental: {
//     serverActions: { allowedOrigins: ["localhost:3000"] },
//   },
// };

// export default nextConfig;



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Azure Blob Storage
      { protocol: "https", hostname: "storagerealestateapp3000.blob.core.windows.net" },
      // Unsplash (seed demo images)
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
  },
};

export default nextConfig;
