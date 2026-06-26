import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, ButtonLink } from "@/components/ui";
import { ProductPlaceholder, ProductCard } from "@/components/product-card";
import {
  products,
  getProduct,
  getCategory,
  getProductsByCategory,
  formatLps,
  formatUsd,
} from "@/lib/data";
import { site } from "@/lib/site";
import { whatsappProductLink } from "@/lib/whatsapp";
import {
  WhatsAppIcon,
  CheckIcon,
  TruckIcon,
  ShieldIcon,
  ArrowRightIcon,
} from "@/components/icons";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <Container className="py-6">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-plum">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-plum">
            Catálogo
          </Link>
          <span>/</span>
          <Link
            href={`/catalogo?categoria=${product.category}`}
            className="hover:text-plum"
          >
            {category?.shortName}
          </Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
      </Container>

      <Container className="pb-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <ProductPlaceholder
              tone={product.tone}
              label={product.name}
              className="aspect-square w-full rounded-3xl shadow-sm"
            />
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <ProductPlaceholder
                  key={i}
                  tone={product.tone}
                  label={product.name}
                  className="aspect-square rounded-2xl opacity-70"
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {category?.shortName} · {product.brand}
            </p>
            <h1 className="font-display mt-3 text-3xl font-medium leading-tight text-plum sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-muted">Ref. {product.sku}</p>

            <p className="mt-5 text-base leading-relaxed text-ink">
              {product.description}
            </p>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-semibold text-plum">
                {formatLps(product.priceLps)}
              </span>
              <span className="pb-1 text-lg text-muted">
                / {formatUsd(product.priceUsd)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Precio de referencia. Solicita tu cotización con precio mayorista.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={whatsappProductLink(product.name, product.sku)}
                variant="whatsapp"
                external
              >
                <WhatsAppIcon className="h-4 w-4" />
                Cotizar este producto
              </ButtonLink>
              <ButtonLink href="/catalogo" variant="outline">
                Seguir viendo
              </ButtonLink>
            </div>

            <ul className="mt-8 space-y-3 rounded-2xl border border-line bg-white p-6">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-ink">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl bg-cream-200 p-4">
                <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-plum" />
                <p className="text-sm text-ink">
                  Envíos a todo Honduras con {site.couriers.join(" y ")}.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-cream-200 p-4">
                <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-plum" />
                <p className="text-sm text-ink">
                  Producto original de distribuidor autorizado.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-line p-5">
              <h3 className="text-sm font-semibold text-plum">
                Métodos de pago
              </h3>
              <p className="mt-2 text-sm text-muted">
                Aceptamos transferencias bancarias a {site.banks.join(", ")}. Los
                datos de cuenta se comparten al confirmar tu pedido por WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {related.length > 0 ? (
        <Container className="py-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-medium text-plum">
              Productos relacionados
            </h2>
            <ButtonLink
              href={`/catalogo?categoria=${product.category}`}
              variant="ghost"
            >
              Ver más
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      ) : null}
    </>
  );
}
