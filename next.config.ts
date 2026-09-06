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
      { source: "/full", destination: "/", permanent: true },
      { source: "/cold", destination: "/", permanent: true },
      { source: "/warm", destination: "/", permanent: true },
      { source: "/preview", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
