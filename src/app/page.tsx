import { Container, ButtonLink, SectionHeading } from "@/components/ui";
import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { HeroScan } from "@/components/hero-scan";
import { ProductSpotlight } from "@/components/product-spotlight";
import { BrandsStrip } from "@/components/brands-strip";
import { Testimonials } from "@/components/testimonials";
import { CtaBanner } from "@/components/cta-banner";
import { categories, products } from "@/lib/data";
import { site } from "@/lib/site";
import {
  WhatsAppIcon,
  ArrowRightIcon,
  TruckIcon,
  ShieldIcon,
} from "@/components/icons";

const featured = products
  .filter((p) => p.badge && p.category !== "medicina-estetica")
  .slice(0, 3);

const valueProps = [
  {
    icon: ShieldIcon,
    title: "Distribuidores autorizados",
    text: "Productos originales con respaldo de marca y garantía real en aparatología.",
  },
  {
    icon: TruckIcon,
    title: "Envíos a todo Honduras",
    text: "Despachamos a todo el país con Cargo Expreso y CAEX. Retiro disponible en sede.",
  },
  {
    icon: WhatsAppIcon,
    title: "Cotización por WhatsApp",
    text: "Atención personalizada, precios en lempiras y dólares y respuesta en minutos.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroScan />

      <section className="border-t border-line bg-white py-8">
        <Container className="grid gap-6 sm:grid-cols-3">
          {valueProps.map((v) => (
            <div key={v.title} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cream-200 text-plum">
                <v.icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-semibold text-plum">{v.title}</h3>
                <p className="mt-1 text-sm text-muted">{v.text}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <ProductSpotlight />

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Nuestras categorías"
            title="Todo lo que tu cabina necesita, en un solo lugar"
            description="Encuentra equipos, activos profesionales e insumos seleccionados para clínicas, spas y salones de belleza."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </Container>
      </section>

      <BrandsStrip />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Selección destacada"
              title="Los favoritos de los profesionales"
            />
            <ButtonLink href="/catalogo" variant="ghost">
              Ver todo el catálogo
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Container>
      </section>

      <Testimonials />

      <CtaBanner />

      <div className="py-12 text-center">
        <p className="text-sm text-muted">
          Aceptamos transferencias bancarias:{" "}
          <span className="font-medium text-ink">{site.banks.join(" · ")}</span>
        </p>
      </div>
    </>
  );
}
