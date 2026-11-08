"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Container, SectionHeading } from "@/components/ui";
import { ProductPlaceholder } from "@/components/product-card";
import { CheckIcon, ArrowRightIcon } from "@/components/icons";
import { categories } from "@/lib/data";

export function ProductSpotlight() {
  const reduce = useReducedMotion();

  return (
    <section className="border-y border-line bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Lo que prevemos ofrecer"
          title="Tres categorías para la práctica médica"
          description="Son la oferta que queremos tener lista cuando abramos en Nicaragua, descrita en lenguaje llano."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.article
              key={category.slug}
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: reduce ? 0 : index * 0.12, ease: "easeOut" }}
              className="flex flex-col overflow-hidden rounded-3xl border border-line bg-cream"
            >
              <div className="relative">
                <ProductPlaceholder
                  tone={category.tone}
                  label={category.shortName}
                  className="aspect-[16/10] w-full"
                />
                <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold text-plum shadow-sm">
                  En preparación
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-medium text-plum">{category.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{category.description}</p>
                <ul className="mt-4 space-y-2">
                  {category.points.slice(0, 2).map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-ink">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/catalogo/${category.slug}`}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-plum/30 px-4 py-2.5 text-sm font-semibold text-plum transition-colors hover:bg-plum hover:text-cream"
                >
                  Conocer la categoría
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
