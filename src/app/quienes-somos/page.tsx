import type { Metadata } from "next";
import { Container, SectionHeading, Eyebrow } from "@/components/ui";
import { CtaBanner } from "@/components/cta-banner";
import { ShieldIcon, MailIcon, CheckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Dérmica prepara su apertura en Nicaragua para ofrecer a profesionales médicos rellenos de ácido hialurónico, revitalización inyectable y dermocosmética profesional.",
};

const values = [
  {
    icon: ShieldIcon,
    title: "Decir lo que todavía no es",
    text: "No nos presentamos como distribuidores confirmados ni prometemos registros, exclusivas o resultados. Contamos la intención y el momento: la apertura está por delante.",
  },
  {
    icon: MailIcon,
    title: "Un aviso, con permiso",
    text: "Si dejas tu correo, es porque marcaste que quieres enterarte. No armamos otra lista ni escribimos por otro canal desde este sitio.",
  },
  {
    icon: CheckIcon,
    title: "Lenguaje de categoría",
    text: "Hablamos de rellenos de ácido hialurónico, polirrevitalización inyectable y dermocosmética profesional. Sin nombres comerciales en esta página.",
  },
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
              Queremos llegar con categorías de producto para la práctica médica:
              rellenos dérmicos de ácido hialurónico, revitalización inyectable y
              dermocosmética profesional. Esa es la dirección. La operación todavía
              no está abierta.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5 text-base leading-relaxed text-ink">
            <SectionHeading
              eyebrow="En este momento"
              title="Una presentación, no un historial de ventas"
            />
            <p>
              No tenemos sedes publicadas, no despachamos pedidos y no atendemos
              pacientes. Esta página existe para que un profesional médico sepa qué
              categorías pensamos ofrecer y pueda pedir que le avisemos de la apertura.
            </p>
            <p>
              No afirmamos un acuerdo de distribución, una autorización sanitaria ni
              una fecha. Cuando eso esté definido, lo diremos con el mismo cuidado
              con el que hoy decimos que aún no lo está.
            </p>
            <p>
              Si buscas un tratamiento, una cita o un precio, no podemos ayudarte
              desde aquí. Dérmica no es una clínica.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              "Próximamente en Nicaragua",
              "Solo para profesionales médicos",
              "Sin venta abierta en este sitio",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-line bg-cream-200 p-7">
                <p className="font-display text-2xl font-medium text-plum">{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Cómo hablamos"
            title="Claridad antes que una promesa"
            align="center"
          />
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
