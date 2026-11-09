import { Container, ButtonLink } from "@/components/ui";
import { pageMetadata } from "@/lib/page-metadata";
import { waitlistHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Página no encontrada",
  description: "No encontramos esta página de Dérmica.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="text-xs font-semibold text-clinical">404</p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-clinical">No encontramos esta página</h1>
      <p className="mt-4 max-w-xl text-clinical">
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
