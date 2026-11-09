import { Container, SectionHeading } from "@/components/ui";
import { CategoryCard } from "@/components/category-card";
import { HeroScan } from "@/components/hero-scan";
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
    title: "Enterate primero",
    text: "En marzo de 2027 hay un cupo de 30 médicos fundadores, con acceso anticipado y precio de apertura.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroScan />

      <section className="border-t border-mist bg-white py-8">
        <Container className="grid gap-6 sm:grid-cols-3">
          {valueProps.map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-clinical">
                <item.icon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-semibold text-clinical">{item.title}</h2>
                <p className="mt-1 text-sm text-clinical">{item.text}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

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

      <section className="border-y border-mist bg-white py-16">
        <Container className="max-w-3xl text-center">
          <p className="text-xs font-semibold text-clinical">
            Para quién es Dérmica
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-clinical">
            Si trabajás estética en tu consulta
          </h2>
          <p className="mt-4 text-base leading-relaxed text-clinical">
            Dermatología, medicina estética y cirugía son los perfiles que tenemos en mente.
            Anotate y enterate primero. El nombre y lo demás son opcionales.
          </p>
        </Container>
      </section>

      <WaitlistSection />
      <CtaBanner />
    </>
  );
}
