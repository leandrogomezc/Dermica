"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Container, SectionHeading } from "@/components/ui";
import { ProductPlaceholder } from "@/components/product-card";
import { CheckIcon, ArrowRightIcon, WhatsAppIcon } from "@/components/icons";
import { products, formatLps, formatUsd } from "@/lib/data";
import { whatsappProductLink } from "@/lib/whatsapp";

const spotlightSlugs = ["xeomin", "radiesse", "belotero"];

const tagline: Record<string, string> = {
  xeomin: "Toxina botulínica",
  radiesse: "Bioestimulador de colágeno",
  belotero: "Relleno de ácido hialurónico",
};

const featured = spotlightSlugs
  .map((slug) => products.find((p) => p.slug === slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

export function ProductSpotlight() {
  const reduce = useReducedMotion();

  return (
    <section id="merz" className="border-y border-line bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Línea Merz Aesthetics"
          title="Tres referencias que confían los médicos"
          description="Originales, con trazabilidad y respaldo de marca. Cotiza por WhatsApp y recíbelas en frío en todo el país."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featured.map((product, i) => (
            <motion.article
              key={product.slug}
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.12, ease: "easeOut" }}
              className="flex flex-col overflow-hidden rounded-3xl border border-line bg-cream"
            >
              <div className="relative">
                <ProductPlaceholder
                  tone={product.tone}
                  label={product.name}
                  className="aspect-[16/10] w-full"
                />
                <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold text-plum shadow-sm">
                  {tagline[product.slug]}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-medium text-plum">
                  {product.name.split("(")[0].trim()}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {product.shortDescription}
                </p>

                <ul className="mt-4 space-y-2">
                  {product.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-ink">
                    {formatLps(product.priceLps)}
                  </span>
                  <span className="text-sm text-muted">
                    / {formatUsd(product.priceUsd)}
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={whatsappProductLink(product.name, product.sku)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1eb558]"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Cotizar
                  </a>
                  <Link
                    href={`/producto/${product.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-plum/30 px-4 py-2.5 text-sm font-semibold text-plum transition-colors hover:bg-plum hover:text-cream"
                  >
                    Conocer más
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
