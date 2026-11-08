import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, ButtonLink } from "@/components/ui";
import { ProductPlaceholder } from "@/components/product-card";
import { categories, getCategory } from "@/lib/data";
import { prelaunchNote, waitlistHref } from "@/lib/site";
import { CheckIcon, ArrowRightIcon } from "@/components/icons";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Categoría no encontrada" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const related = categories.filter((item) => item.slug !== category.slug);

  return (
    <>
      <Container className="py-6">
        <nav aria-label="Miga de pan" className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-plum">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/catalogo" className="hover:text-plum">
            Categorías
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink">{category.name}</span>
        </nav>
      </Container>

      <Container className="pb-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductPlaceholder
            tone={category.tone}
            label={category.shortName}
            className="aspect-square w-full rounded-3xl shadow-sm"
          />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Categoría prevista · Nicaragua
            </p>
            <h1 className="font-display mt-3 text-3xl font-medium leading-tight text-plum sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink">{category.detail}</p>
            <p className="mt-4 rounded-2xl bg-cream-200 px-4 py-3 text-sm text-ink">{prelaunchNote}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={waitlistHref}>Unirme a la lista de espera</ButtonLink>
              <ButtonLink href="/catalogo" variant="outline">
                Volver a categorías
              </ButtonLink>
            </div>

            <ul className="mt-8 space-y-3 rounded-2xl border border-line bg-white p-6">
              {category.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-ink">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <Container className="pb-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-medium text-plum">Otras categorías</h2>
          <ButtonLink href="/catalogo" variant="ghost">
            Ver todas
            <ArrowRightIcon className="h-4 w-4" />
          </ButtonLink>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {related.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/catalogo/${item.slug}`}
                className="block rounded-2xl border border-line bg-white p-5 transition-colors hover:border-blush"
              >
                <span className="font-medium text-plum">{item.name}</span>
                <span className="mt-1 block text-sm text-muted">{item.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
