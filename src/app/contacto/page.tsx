import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/ui";
import { WaitlistSection } from "@/components/waitlist-section";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contacto",
  description: "Anotate para enterarte primero de la apertura en marzo de 2027, o escribinos a gerencia@dermica.lat.",
  path: "/contacto",
});

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-mist bg-white">
        <Container className="py-16 sm:py-20">
          <PageHero eyebrow="Contacto" title="Dejanos tu correo y te avisamos cuando abramos">
            <p className="mt-6 text-lg leading-relaxed text-clinical">
              Si preferís escribirnos directo, el correo es{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-clinical underline-offset-4 hover:underline">
                {site.email}
              </a>
              . No tenemos un teléfono ni una dirección que mostrar. El formulario de abajo
              es el canal del aviso de apertura. Las novedades de marketing son una casilla
              aparte y no incluyen WhatsApp ni SMS. No abre un chat ni un pedido. Para
              privacidad, acceso, eliminación o retiro de novedades, usá el mismo correo. El
              detalle está en{" "}
              <Link href="/privacidad" className="font-semibold text-clinical underline-offset-4 hover:underline">
                Privacidad
              </Link>
              .
            </p>
          </PageHero>
        </Container>
      </section>
      <WaitlistSection />
    </>
  );
}
