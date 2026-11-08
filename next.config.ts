import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["node:sqlite"],
  async redirects() {
    return [
      { source: "/envios", destination: "/apertura", permanent: false },
      { source: "/producto/:slug", destination: "/catalogo", permanent: false },
    ];
  },
};

export default nextConfig;
