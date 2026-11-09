import type { Metadata } from "next";
import { Container, SectionHeading, Eyebrow } from "@/components/ui";
import { CtaBanner } from "@/components/cta-banner";
import { ShieldIcon, MailIcon, CheckIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Quiénes somos",
  description:
    "Dérmica prepara su apertura en Nicaragua para ofrecer a profesionales médicos rellenos de ácido hialurónico, polirrevitalización inyectable y dermocosmética profesional.",
  path: "/quienes-somos",
});

const values = [
  {
    icon: ShieldIcon,
    title: "Claridad primero",
    text: "No hablamos de acuerdos, registros, exclusivas ni resultados que no estén confirmados.",
  },
  {
    icon: MailIcon,
    title: "Tu correo, con un fin claro",
    text: "El aviso de apertura es el motivo de la lista. Las novedades de marketing son opcionales, solo por correo, y no cambian el alta si no las marcás.",
  },
  {
    icon: CheckIcon,
    title: "Lenguaje de categoría",
    text: "Hablamos de categorías de producto, sin nombres comerciales.",
  },
];

const facts = [
  "Prelanzamiento en Nicaragua",
  "Solo para profesionales médicos",
  "Un aviso por correo, cuando abramos",
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-white">
        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Quiénes somos</Eyebrow>
            <h1 className="font-display mt-4 text-4xl font-medium leading-tight text-plum sm:text-5xl">
              Preparamos Dérmica para los médicos de Nicaragua
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Queremos acercar a la práctica médica rellenos de ácido hialurónico,
              polirrevitalización inyectable y dermocosmética profesional. Estamos en
              prelanzamiento y preparando la apertura.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5 text-base leading-relaxed text-ink">
            <SectionHeading eyebrow="En este momento" title="Una presentación honesta" />
            <p>
              Este sitio existe para que conozcás lo que preparamos y nos pidás el aviso
              de apertura. Cuando tengamos fecha, condiciones y acuerdos definidos, los
              vamos a comunicar con la misma claridad.
            </p>
            <p>
              Si buscás un tratamiento o una cita, Dérmica no es una clínica y no podemos
              ayudarte desde aquí.
            </p>
          </div>
          <div className="grid gap-4">
            {facts.map((item) => (
              <div key={item} className="rounded-2xl border border-line bg-cream-200 p-7">
                <p className="font-display text-2xl font-medium text-plum">{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading title="Cómo trabajamos" align="center" />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-line bg-cream p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-plum text-cream">
                  <value.icon className="h-6 w-6" />
                </span>
                <h3 className="font-display mt-5 text-xl font-medium text-plum">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{value.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
