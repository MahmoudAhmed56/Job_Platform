import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "e3vjorsq2d.ufs.sh",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
