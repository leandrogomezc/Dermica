import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, ButtonLink } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { CatalogFilters } from "@/components/catalog-filters";
import { products, getCategory } from "@/lib/data";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Catálogo de productos estéticos profesionales",
  description:
    "Explora nuestro catálogo de aparatología, cuidado de la piel e insumos profesionales. Filtra por categoría y marca, y cotiza por WhatsApp.",
};

type SearchParams = Promise<{
  categoria?: string;
  marca?: string;
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
  const { categoria, marca, q } = await searchParams;
  const activeCategory = categoria ? getCategory(categoria) : undefined;

  const filtered = products.filter((p) => {
    if (categoria && p.category !== categoria) return false;
    if (marca && p.brand !== marca) return false;
    if (q) {
      const needle = normalize(q);
      const haystack = normalize(
        `${p.name} ${p.shortDescription} ${p.brand} ${getCategory(p.category)?.name ?? ""}`,
      );
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Catálogo
          </p>
          <h1 className="font-display mt-3 text-3xl font-medium text-plum sm:text-4xl">
            {activeCategory ? activeCategory.name : "Nuestro catálogo profesional"}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            {activeCategory
              ? activeCategory.description
              : "Equipos, activos profesionales e insumos para clínicas, spas y salones de belleza. Filtra y cotiza en segundos."}
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
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted">
                {filtered.length}{" "}
                {filtered.length === 1 ? "producto" : "productos"}
              </p>
            </div>

            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
                <h2 className="font-display text-xl text-plum">
                  No encontramos productos con esos filtros
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Cuéntanos qué buscas y te ayudamos a conseguirlo.
                </p>
                <div className="mt-6 flex justify-center">
                  <ButtonLink href={whatsappLink()} variant="whatsapp" external>
                    <WhatsAppIcon className="h-4 w-4" />
                    Consultar por WhatsApp
                  </ButtonLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
