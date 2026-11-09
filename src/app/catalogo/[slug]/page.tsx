import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, ButtonLink } from "@/components/ui";
import { ProductPlaceholder } from "@/components/product-card";
import { categories, getCategory } from "@/lib/data";
import { categoryGuides, categoryLimits } from "@/lib/category-guides";
import { pageMetadata } from "@/lib/page-metadata";
import { site, waitlistHref } from "@/lib/site";
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
  return pageMetadata({
    title: category.name,
    description: `${category.description} Categoría en preparación para médicos en Nicaragua.`,
    path: `/catalogo/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const related = categories.filter((item) => item.slug !== category.slug);
  const guide = categoryGuides[category.slug] ?? [];
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
      { "@type": "ListItem", position: 2, name: "Categorías", item: `${site.url}/catalogo` },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${site.url}/catalogo/${category.slug}`,
      },
    ],
  };

  return (
    <>
      <Container className="py-6">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
        <nav aria-label="Miga de pan" className="flex flex-wrap items-center gap-2 text-sm text-clinical">
          <Link href="/" className="hover:text-clinical">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/catalogo" className="hover:text-clinical">
            Categorías
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-clinical">{category.name}</span>
        </nav>
      </Container>

      <Container className="pb-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductPlaceholder
            tone={category.tone}
            label={category.shortName}
            className="aspect-square w-full rounded-2xl"
          />

          <div>
            <p className="text-xs font-semibold text-clinical">
              En preparación · Nicaragua
            </p>
            <h1 className="font-display mt-3 text-3xl font-semibold leading-tight text-clinical sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-clinical">{category.detail}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={waitlistHref} metric="cta">Avisame cuando abran</ButtonLink>
              <ButtonLink href="/catalogo" variant="outline">
                Volver a categorías
              </ButtonLink>
            </div>

            <ul className="mt-8 space-y-3 rounded-2xl border border-mist bg-white p-6">
              {category.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-clinical">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-clinical" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <Container className="pb-16">
        <div className="max-w-3xl space-y-10">
        {guide.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-2xl font-semibold text-clinical">{section.heading}</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-clinical">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
        <section className="rounded-2xl border border-mist bg-sky-100 p-6">
          <h2 className="font-display text-2xl font-semibold text-clinical">Qué no promete esta ficha</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-clinical">
            {categoryLimits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-clinical">
            <Link href="/apertura" className="font-semibold text-clinical underline-offset-4 hover:underline">
              Límites del prelanzamiento
            </Link>
          </p>
        </section>
        </div>
      </Container>

      <Container className="pb-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-clinical">Otras categorías</h2>
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
                className="block rounded-2xl border border-mist bg-white p-5 transition-colors hover:border-clinical"
              >
                <span className="font-medium text-clinical">{item.name}</span>
                <span className="mt-1 block text-sm text-clinical">{item.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
