import { Container, ButtonLink, SectionHeading, Eyebrow } from "@/components/ui";
import { CategoryCard } from "@/components/category-card";
import { ProductCard, ProductPlaceholder } from "@/components/product-card";
import { BrandsStrip } from "@/components/brands-strip";
import { Testimonials } from "@/components/testimonials";
import { CtaBanner } from "@/components/cta-banner";
import { categories, products } from "@/lib/data";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import {
  WhatsAppIcon,
  ArrowRightIcon,
  CheckIcon,
  TruckIcon,
  ShieldIcon,
} from "@/components/icons";

const featured = products.filter((p) => p.badge).slice(0, 3);

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
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <span className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-blush/25 blur-3xl" />
          <span className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        </div>
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <Eyebrow>Distribuidora profesional · Honduras</Eyebrow>
            <h1 className="font-display mt-4 text-4xl font-medium leading-[1.1] text-plum sm:text-5xl lg:text-6xl">
              Productos estéticos profesionales para hacer crecer tu negocio de
              belleza
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Distribuidores autorizados de las mejores marcas en aparatología,
              cuidado de la piel e insumos. Cotiza fácil por WhatsApp y recíbelo
              en todo el país.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={whatsappLink()} variant="whatsapp" external>
                <WhatsAppIcon className="h-4 w-4" />
                Cotizar por WhatsApp
              </ButtonLink>
              <ButtonLink href="/catalogo" variant="outline">
                Ver catálogo
                <ArrowRightIcon className="h-4 w-4" />
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink">
              {[
                "Marcas originales",
                "Precios en L. y $",
                "Asesoría especializada",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative animate-fade-up">
            <div className="grid grid-cols-2 gap-4">
              {products.slice(0, 4).map((p, i) => (
                <ProductPlaceholder
                  key={p.slug}
                  tone={p.tone}
                  label={p.name}
                  className={`aspect-square rounded-3xl shadow-md ${
                    i % 2 === 0 ? "mt-0" : "mt-8"
                  }`}
                />
              ))}
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-2xl border border-line bg-white px-6 py-3 shadow-lg">
              <p className="text-center text-sm font-semibold text-plum">
                +500 profesionales abastecidos
              </p>
            </div>
          </div>
        </Container>
      </section>

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
