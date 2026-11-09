import { Container, ButtonLink } from "@/components/ui";
import { waitlistHref } from "@/lib/site";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">404</p>
      <h1 className="font-display mt-3 text-4xl font-medium text-plum">No encontramos esta página</h1>
      <p className="mt-4 max-w-xl text-muted">
        El enlace no corresponde a una sección de Dérmica. Podés volver al inicio o dejar tu correo para el aviso de apertura.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Ir al inicio</ButtonLink>
        <ButtonLink href={waitlistHref} variant="outline" metric="cta">
          Avisame cuando abran
        </ButtonLink>
      </div>
    </Container>
  );
}
