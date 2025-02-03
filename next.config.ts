import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mdcomputers-in.b-cdn.net"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
    ]
  }
};

export default nextConfig;
