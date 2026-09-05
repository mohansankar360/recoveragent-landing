import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/calender",
        destination: "/calendar",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
