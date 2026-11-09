import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, PageHero, ButtonLink } from "@/components/ui";
import { OfferingCard } from "@/components/product-card";
import { CatalogFilters } from "@/components/catalog-filters";
import { categories, getCategory } from "@/lib/data";
import { waitlistHref } from "@/lib/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Categorías para profesionales médicos",
  description:
    "Tres categorías que estamos preparando para la práctica médica en Nicaragua: rellenos de ácido hialurónico, polirrevitalización inyectable y dermocosmética profesional.",
  path: "/catalogo",
});

type SearchParams = Promise<{
  categoria?: string;
}>;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { categoria } = await searchParams;
  const activeCategory = categoria ? getCategory(categoria) : undefined;

  const filtered = categories.filter((category) => {
    if (categoria && category.slug !== categoria) return false;
    return true;
  });

  return (
    <>
      <section className="border-b border-mist bg-white">
        <Container className="py-16 sm:py-20">
          <PageHero
            eyebrow="Categorías"
            title={activeCategory ? activeCategory.name : "Categorías para profesionales médicos"}
          >
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-clinical">
              {activeCategory
                ? activeCategory.description
                : "Tres categorías que estamos preparando para la práctica médica en Nicaragua."}
            </p>
          </PageHero>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Suspense fallback={<div className="text-sm text-clinical">Cargando filtros…</div>}>
              <CatalogFilters />
            </Suspense>
          </aside>

          <div>
            <p className="mb-6 text-sm text-clinical">
              {filtered.length} {filtered.length === 1 ? "categoría" : "categorías"}
            </p>

            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((category) => (
                  <OfferingCard key={category.slug} category={category} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-mist bg-white p-12 text-center">
                <h2 className="font-display text-xl text-clinical">
                  No encontramos una categoría con ese texto
                </h2>
                <p className="mt-2 text-sm text-clinical">
                  Si querés enterarte cuando abramos, dejanos tu correo.
                </p>
                <div className="mt-6 flex justify-center">
                  <ButtonLink href={waitlistHref} metric="cta">Avisame cuando abran</ButtonLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
