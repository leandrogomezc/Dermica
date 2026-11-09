import { Container, ButtonLink } from "@/components/ui";
import { ArrowRightIcon } from "@/components/icons";
import { waitlistHref } from "@/lib/site";

export function CtaBanner() {
  return (
    <section className="py-8" aria-labelledby="cierre-lista">
      <Container>
        <div className="rounded-3xl bg-clinical px-8 py-14 text-center sm:px-16 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <h2
              id="cierre-lista"
              className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl"
            >
              ¿Ejercés medicina estética? Enterate primero.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Apertura en marzo de 2027. Cupo de 30 médicos fundadores, con acceso anticipado y precio de apertura.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href={waitlistHref}
                metric="cta"
                className="bg-white! text-clinical! hover:bg-sky-100!"
              >
                Avisame cuando abran
              </ButtonLink>
              <ButtonLink
                href="/catalogo"
                variant="outline"
                className="border-white! bg-transparent! text-white! hover:bg-white! hover:text-clinical!"
              >
                Ver categorías
                <ArrowRightIcon className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
