import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui";
import { WaitlistSection } from "@/components/waitlist-section";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contacto",
  description: "Dejanos tu correo para el aviso de apertura o escribinos a gerencia@dermica.lat.",
  path: "/contacto",
});

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Contacto</Eyebrow>
            <h1 className="font-display mt-4 text-4xl font-medium leading-tight text-plum sm:text-5xl">
              Dejanos tu correo y te avisamos cuando abramos
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Si preferís escribirnos directo, el correo es{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-plum underline-offset-4 hover:underline">
                {site.email}
              </a>
              . No tenemos un teléfono ni una dirección que mostrar. El formulario de abajo
              es el canal del aviso de apertura. Las novedades de marketing son una casilla
              aparte y no incluyen WhatsApp ni SMS. No abre un chat ni un pedido. Para
              privacidad, acceso, eliminación o retiro de novedades, usá el mismo correo. El
              detalle está en{" "}
              <Link href="/privacidad" className="font-semibold text-plum underline-offset-4 hover:underline">
                Privacidad
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>
      <WaitlistSection />
    </>
  );
}
