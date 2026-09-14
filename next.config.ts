import type { NextConfig } from "next";

const WWW_HOST = "www.recoveragent.ai";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "recoveragent.ai" }],
        destination: `https://${WWW_HOST}/:path*`,
        permanent: true,
      },
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
