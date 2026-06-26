import { site } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phoneDisplay,
    currenciesAccepted: "HNL, USD",
    paymentAccepted: "Transferencia bancaria",
    areaServed: { "@type": "Country", name: "Honduras" },
    sameAs: [site.social.instagram, site.social.facebook, site.social.tiktok],
    location: site.locations.map((loc) => ({
      "@type": "Place",
      name: `${site.name} ${loc.city}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: loc.address,
        addressLocality: loc.city,
        addressCountry: "HN",
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
