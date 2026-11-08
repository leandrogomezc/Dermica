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
              Enterarme de la apertura
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Si eres profesional médico y quieres saber cuándo abramos en Nicaragua,
              deja tu nombre y tu correo. La especialidad, la ciudad y el teléfono son
              opcionales. No pedimos documentos ni datos de pacientes.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-ink">
              <li>Un solo propósito: avisarte de la apertura.</li>
              <li>Sin fecha confirmada y sin pedido asociado.</li>
              <li>Si el almacén no está configurado, el formulario lo dice y no guarda nada.</li>
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
