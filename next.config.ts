import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg", "node:sqlite"],
  outputFileTracingIncludes: {
    "/api/lista-espera": ["./db/migrations/001_dermica_waitlist.sql"],
  },
  async redirects() {
    return [
      { source: "/envios", destination: "/apertura", permanent: false },
      { source: "/producto/:slug", destination: "/catalogo", permanent: false },
    ];
  },
};

export default nextConfig;
