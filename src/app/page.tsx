import { Container, SectionHeading } from "@/components/ui";
import { CategoryCard } from "@/components/category-card";
import { HeroScan } from "@/components/hero-scan";
import { ProductSpotlight } from "@/components/product-spotlight";
import { CtaBanner } from "@/components/cta-banner";
import { WaitlistSection } from "@/components/waitlist-section";
import { categories } from "@/lib/data";
import { ShieldIcon, MailIcon, UsersIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/page-metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${site.name} | ${site.tagline}`,
  description: site.description,
  path: "/",
  absolute: true,
});

const valueProps = [
  {
    icon: ShieldIcon,
    title: "Pensado para tu consulta",
    text: "Trabajamos la propuesta para médicos que ya realizan procedimientos estéticos.",
  },
  {
    icon: UsersIcon,
    title: "Tres categorías",
    text: "Rellenos de ácido hialurónico, polirrevitalización inyectable y dermocosmética profesional.",
  },
  {
    icon: MailIcon,
    title: "Un aviso, cuando abramos",
    text: "Te escribimos al correo cuando abramos. Las novedades de marketing son opcionales y aparte.",
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
            title="Lo que estamos preparando para tu práctica"
            description="Cada categoría explicada con claridad, sin nombres comerciales."
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
            Para quién es Dérmica
          </p>
          <h2 className="font-display mt-3 text-3xl font-medium text-plum">
            Para médicos que trabajan estética en su consulta
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Dermatología, medicina estética y cirugía son los perfiles que tenemos en mente.
            Para anotarte pedimos tu correo y que marques el aviso. El nombre y lo demás son opcionales.
          </p>
        </Container>
      </section>

      <WaitlistSection />
      <CtaBanner />
    </>
  );
}
