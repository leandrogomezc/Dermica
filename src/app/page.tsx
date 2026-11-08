import { Container, SectionHeading } from "@/components/ui";
import { CategoryCard } from "@/components/category-card";
import { HeroScan } from "@/components/hero-scan";
import { ProductSpotlight } from "@/components/product-spotlight";
import { CtaBanner } from "@/components/cta-banner";
import { WaitlistSection } from "@/components/waitlist-section";
import { categories } from "@/lib/data";
import { ShieldIcon, MailIcon, UsersIcon } from "@/components/icons";

const valueProps = [
  {
    icon: ShieldIcon,
    title: "Para la consulta médica",
    text: "Pensamos en profesionales que ya ejercen en su consulta.",
  },
  {
    icon: UsersIcon,
    title: "Tres categorías previstas",
    text: "Rellenos de ácido hialurónico, revitalización inyectable y dermocosmética profesional.",
  },
  {
    icon: MailIcon,
    title: "Aviso, no un pedido",
    text: "La lista de espera sirve para enterarte de la apertura.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroScan />

      <section className="border-t border-line bg-white py-8">
        <Container className="grid gap-6 sm:grid-cols-3">
          {valueProps.map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cream-200 text-plum">
                <item.icon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-semibold text-plum">{item.title}</h2>
                <p className="mt-1 text-sm text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <ProductSpotlight />

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Categorías"
            title="Lo que queremos poner a tu alcance"
            description="Cada ficha explica la categoría en castellano llano."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-white py-16">
        <Container className="max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Para quién es esta página
          </p>
          <h2 className="font-display mt-3 text-3xl font-medium text-plum">
            Médicos que quieran saber cuándo abramos
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Dermatología, medicina estética y cirugía son el perfil que tenemos en mente.
            El formulario pide nombre y correo, y deja el resto como opcional.
          </p>
        </Container>
      </section>

      <WaitlistSection />
      <CtaBanner />
    </>
  );
}
