import { site } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.name,
        description: site.description,
        url: site.url,
        email: site.email,
        areaServed: { "@type": "Country", name: site.country },
        knowsLanguage: "es",
      },
      {
        "@type": "WebSite",
        name: site.name,
        url: site.url,
        description: site.description,
        inLanguage: "es-NI",
        publisher: { "@type": "Organization", name: site.name, url: site.url },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
