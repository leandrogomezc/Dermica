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
  async rewrites() {
    return [{ source: "/.well-known/llms.txt", destination: "/llms.txt" }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
