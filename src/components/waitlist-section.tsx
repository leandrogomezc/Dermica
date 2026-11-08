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
              className="font-display mt-3 text-3xl font-medium leading-tight text-plum sm:text-4xl"
            >
              Dejanos tu correo y te avisamos cuando abramos
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Si sos profesional médico y querés saber cuándo abrimos en Nicaragua,
              completá estos datos.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-ink">
              <li>Un solo propósito: avisarte de la apertura.</li>
              <li>Si hoy no podemos guardar la lista, el formulario lo dice y no anota tu correo.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
            <WaitlistForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
