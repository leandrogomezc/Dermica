import { Container, Eyebrow } from "@/components/ui";
import { WaitlistForm } from "@/components/waitlist-form";

export function WaitlistSection() {
  return (
    <section id="lista-espera" className="scroll-mt-24 py-20 sm:py-24" aria-labelledby="lista-titulo">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>Lista de espera</Eyebrow>
            <h2
              id="lista-titulo"
              className="font-display mt-3 text-3xl font-semibold leading-tight text-clinical sm:text-4xl"
            >
              Enterate primero
            </h2>
            <p className="mt-4 text-base leading-relaxed text-clinical">
              Anotate para el cupo de 30 médicos fundadores. Incluye acceso anticipado
              y precio de apertura, para marzo de 2027 en Nicaragua.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-clinical">
              <li>Acceso anticipado y precio de apertura para ese cupo de fundadores.</li>
              <li>Te avisamos primero. Anotarte no te reserva el lugar por sí solo.</li>
              <li>Las novedades de marketing son opcionales y por correo.</li>
              <li>Si hoy no podemos guardar la lista, el formulario lo dice y no anota tu correo.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-mist bg-white p-6 sm:p-8">
            <WaitlistForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
