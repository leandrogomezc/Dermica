import type { Metadata } from "next";
import { Container, SectionHeading, PageHero, ButtonLink } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import { waitlistHref } from "@/lib/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Apertura en Nicaragua",
  description:
    "Abrimos en marzo de 2027 en Nicaragua. Cupo de 30 médicos fundadores, con acceso anticipado y precio de apertura.",
  path: "/apertura",
});

const today = [
  "Apertura en marzo de 2027, en Nicaragua.",
  "Cupo de 30 médicos fundadores, con acceso anticipado.",
  "Precio de apertura. El monto no está publicado.",
];

const pending = [
  "El monto del precio de apertura, las sedes y los canales de atención.",
  "La cobertura de envíos.",
  "Dérmica no es una clínica: no agendamos pacientes ni realizamos tratamientos.",
];

export default function OpeningPage() {
  return (
    <>
      <section className="border-b border-mist bg-white">
        <Container className="py-16 sm:py-20">
          <PageHero eyebrow="Apertura" title="Abrimos en marzo de 2027">
            <p className="mt-6 text-lg leading-relaxed text-clinical">
              Hay un cupo de 30 médicos fundadores, con acceso anticipado y precio de
              apertura. Anotate y te avisamos primero. El sitio no toma pedidos ni confirma envíos.
            </p>
          </PageHero>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-mist bg-white p-8">
            <SectionHeading eyebrow="Lo que te llevás" title="Acceso anticipado" />
            <ul className="mt-6 space-y-4">
              {today.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-clinical">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-clinical" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-clinical p-8 text-white">
            <h2 className="font-display text-3xl font-semibold">Lo que todavía no está definido</h2>
            <ul className="mt-6 space-y-4">
              {pending.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/90">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-sky" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="pb-8 text-center">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-clinical sm:text-3xl">
            Anotate y enterate primero
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-clinical">
            Te avisamos antes de marzo de 2027. Anotarte no reserva productos ni te garantiza el cupo. Si marcás novedades, ese correo es aparte.
          </p>
          <div className="mt-6 flex justify-center">
            <ButtonLink href={waitlistHref} metric="cta">Avisame cuando abran</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
