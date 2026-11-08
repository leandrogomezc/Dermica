import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, ButtonLink } from "@/components/ui";
import { OfferingCard } from "@/components/product-card";
import { CatalogFilters } from "@/components/catalog-filters";
import { categories, getCategory } from "@/lib/data";
import { prelaunchNote, waitlistHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Categorías previstas para profesionales médicos",
  description:
    "Categorías que Dérmica prevé ofrecer en Nicaragua: rellenos dérmicos de ácido hialurónico, revitalización inyectable y dermocosmética profesional. Sin precios ni existencias.",
};

type SearchParams = Promise<{
  categoria?: string;
  q?: string;
}>;

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { categoria, q } = await searchParams;
  const activeCategory = categoria ? getCategory(categoria) : undefined;

  const filtered = categories.filter((category) => {
    if (categoria && category.slug !== categoria) return false;
    if (q) {
      const needle = normalize(q);
      const haystack = normalize(`${category.name} ${category.shortName} ${category.description}`);
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Categorías
          </p>
          <h1 className="font-display mt-3 text-3xl font-medium text-plum sm:text-4xl">
            {activeCategory ? activeCategory.name : "Categorías que prevemos ofrecer"}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            {activeCategory ? activeCategory.description : prelaunchNote}
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Suspense fallback={<div className="text-sm text-muted">Cargando filtros…</div>}>
              <CatalogFilters />
            </Suspense>
          </aside>

          <div>
            <p className="mb-6 text-sm text-muted">
              {filtered.length} {filtered.length === 1 ? "categoría" : "categorías"}
            </p>

            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((category) => (
                  <OfferingCard key={category.slug} category={category} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
                <h2 className="font-display text-xl text-plum">
                  No hay una categoría con ese texto
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Si quieres saber cuándo abramos, puedes dejar tu correo en la lista de espera.
                </p>
                <div className="mt-6 flex justify-center">
                  <ButtonLink href={waitlistHref}>Enterarme de la apertura</ButtonLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
