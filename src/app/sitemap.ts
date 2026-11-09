import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { categories } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = [
  "",
  "/catalogo",
  "/quienes-somos",
  "/apertura",
  "/contacto",
  "/preguntas-frecuentes",
  "/privacidad",
].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const categoryRoutes = categories.map((category) => ({
    url: `${base}/catalogo/${category.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes];
}
