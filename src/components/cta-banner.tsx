import { Container, ButtonLink } from "@/components/ui";
import { WhatsAppIcon, ArrowRightIcon } from "@/components/icons";
import { whatsappLink } from "@/lib/whatsapp";

export function CtaBanner() {
  return (
    <section className="py-8">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-plum px-8 py-14 text-center sm:px-16 sm:py-20">
          <span className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blush/20" />
          <span className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-gold/10" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-medium leading-tight text-cream sm:text-4xl">
              ¿Lista para abastecer tu clínica o spa?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-cream/80">
              Habla directamente con un asesor, recibe una cotización
              personalizada en lempiras o dólares y descubre por qué cientos de
              profesionales en Honduras confían en Dérmica.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href={whatsappLink()} variant="whatsapp" external>
                <WhatsAppIcon className="h-4 w-4" />
                Hablar con un asesor
              </ButtonLink>
              <ButtonLink
                href="/catalogo"
                variant="outline"
                className="border-cream/40 text-cream hover:bg-cream hover:text-plum"
              >
                Ver catálogo
                <ArrowRightIcon className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
