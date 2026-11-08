import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { WaitlistSection } from "@/components/waitlist-section";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Por ahora, el contacto con Dérmica es la lista de aviso de apertura.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Contacto</Eyebrow>
            <h1 className="font-display mt-4 text-4xl font-medium leading-tight text-plum sm:text-5xl">
              El aviso de apertura es el mensaje que enviaremos
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              No tenemos un teléfono, un correo público ni una dirección que mostrar.
              Si querés que te escribamos cuando abramos en Nicaragua, el formulario
              de abajo es el canal. No abre un chat ni un pedido.
            </p>
          </div>
        </Container>
      </section>
      <WaitlistSection />
    </>
  );
}
