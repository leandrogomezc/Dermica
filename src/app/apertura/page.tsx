import type { Metadata } from "next";
import { Container, SectionHeading, Eyebrow, ButtonLink } from "@/components/ui";
import { CheckIcon, CloseIcon } from "@/components/icons";
import { waitlistHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Apertura en Nicaragua",
  description:
    "Dérmica aún no tiene fecha de apertura ni cobertura de envíos en Nicaragua. Puedes dejar tu correo para enterarte cuando haya novedades.",
};

const yes = [
  "Puedes dejar nombre y correo para un aviso de apertura.",
  "Puedes leer las tres categorías que prevemos ofrecer.",
  "Puedes decidir no escribirnos: la casilla de aceptación viene desmarcada.",
];

const no = [
  "No hay una fecha de apertura confirmada.",
  "No despachamos pedidos ni prometemos llegar a todo el país.",
  "No publicamos sedes, teléfonos ni horarios de atención.",
  "No agendamos pacientes ni realizamos tratamientos.",
];

export default function OpeningPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-white">
        <span className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full bg-blush/20 blur-3xl" />
        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Apertura</Eyebrow>
            <h1 className="font-display mt-4 text-4xl font-medium leading-tight text-plum sm:text-5xl">
              Próximamente en Nicaragua
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Estamos preparando la llegada. Hasta que abramos, esta página no
              toma pedidos, no calcula envíos y no confirma cobertura.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white p-8">
            <SectionHeading eyebrow="Sí" title="Lo que puedes hacer hoy" />
            <ul className="mt-6 space-y-4">
              {yes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-plum-900 p-8 text-cream">
            <h2 className="font-display text-3xl font-medium">Lo que aún no hacemos</h2>
            <ul className="mt-6 space-y-4">
              {no.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-cream/90">
                  <CloseIcon className="mt-0.5 h-5 w-5 shrink-0 text-blush" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="pb-8 text-center">
        <Container>
          <h2 className="font-display text-2xl font-medium text-plum sm:text-3xl">
            El siguiente paso es la lista, si quieres estar
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            No implica una reserva de producto. Solo nos deja tu contacto para el
            aviso de apertura.
          </p>
          <div className="mt-6 flex justify-center">
            <ButtonLink href={waitlistHref}>Unirme a la lista de espera</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
