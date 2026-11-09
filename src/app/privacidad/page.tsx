import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/ui";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacidad",
  description:
    "Qué datos pide Dérmica en la lista de espera, para qué, y cómo retirar el consentimiento de novedades por correo.",
  path: "/privacidad",
});

export default function PrivacyPage() {
  return (
    <section className="border-b border-mist bg-white">
      <Container className="max-w-3xl py-16 sm:py-20">
        <PageHero eyebrow="Privacidad" title="Qué guardamos y para qué" />
        <div className="mt-8 space-y-5 text-base leading-relaxed text-clinical">
          <p>
            Dérmica está en prelanzamiento en Nicaragua. Esta página describe el formulario
            del sitio. Dérmica es quien trata estos datos. Todavía no publicamos una razón
            social, una dirección ni un RUC.
          </p>
          <p>
            Para el aviso de apertura pedimos el correo y una casilla que viene desmarcada.
            Si querés, podés agregar nombre, especialidad, ciudad y teléfono. No pedimos datos
            de pacientes ni documentos profesionales.
          </p>
          <p>
            Hay una segunda casilla, también desmarcada, para novedades y comunicaciones de
            marketing por correo. Si no la marcás, igual podés anotarte al aviso de apertura.
            No incluye WhatsApp, SMS ni compartir tus datos con terceros. Los registros
            anteriores a esta casilla no quedan autorizados para marketing.
          </p>
          <p>
            Si la marcás y el registro se guarda, la página te muestra un enlace para retirar
            ese consentimiento. Conservalo. Si lo perdés, escribinos a{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-clinical underline-offset-4 hover:underline">
              {site.email}
            </a>
            . Ese mismo correo sirve para pedir acceso, corrección o eliminación de tus datos.
            Volver a enviar el formulario no cambia la preferencia de un correo que ya está
            en la lista: no podemos comprobar que seas vos.
          </p>
          <p>
            El sitio también cuenta visitas, clics en «Avisame cuando abran» y el recorrido
            del formulario. Esos conteos no guardan correo, teléfono, IP, navegador ni la
            dirección de la que viniste. No identifican personas ni prometen usuarios únicos.
            No hay un listado público de esos conteos.
          </p>
          <p>
            Esto no es un dictamen de cumplimiento legal. Para el aviso de apertura, el acceso
            o la eliminación, el canal es{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-clinical underline-offset-4 hover:underline">
              {site.email}
            </a>
            .
          </p>
          <p>
            <Link href="/contacto" className="font-semibold text-clinical underline-offset-4 hover:underline">
              Volver al formulario
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
