import type { Metadata, Viewport } from "next";
import { Figtree, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteMetrics } from "@/components/site-metrics";
import { JsonLd } from "@/components/json-ld";
import { searchEngineVerification } from "@/lib/search-verification";
import { site } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const verification = searchEngineVerification();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Dérmica. Insumos de medicina estética para médicos en Nicaragua.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/app-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/app-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  ...(verification ? { verification } : {}),
};

export const viewport: Viewport = {
  themeColor: "#1E3A5F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-NI"
      className={`${inter.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:min-h-11 focus:rounded-lg focus:bg-clinical focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido
        </a>
        <JsonLd />
        <SiteMetrics />
        <SiteHeader />
        <main id="contenido" className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
