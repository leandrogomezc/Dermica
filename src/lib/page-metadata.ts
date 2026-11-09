import type { Metadata } from "next";
import { site } from "./site";

const shareImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Dérmica. Insumos de medicina estética para médicos en Nicaragua.",
} as const;

export function pageMetadata({
  title,
  description,
  path,
  absolute = false,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  absolute?: boolean;
  noIndex?: boolean;
}): Metadata {
  const socialTitle = absolute ? title : `${title} | ${site.name}`;
  return {
    title: absolute ? { absolute: socialTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [shareImage.url],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
