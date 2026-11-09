import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, PageHero } from "@/components/ui";
import { WithdrawMarketing } from "@/components/withdraw-marketing";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Retirar novedades",
  description:
    "Retira solo el consentimiento de novedades por correo de Dérmica. No borra el aviso de apertura.",
  path: "/retirar-marketing",
  noIndex: true,
});

export default function WithdrawPage() {
  return (
    <section className="border-b border-mist bg-white">
      <Container className="max-w-3xl py-16 sm:py-20">
        <PageHero eyebrow="Marketing" title="Retirar novedades por correo">
          <p className="mt-6 text-base leading-relaxed text-clinical">
            Este enlace solo retira el consentimiento de novedades y comunicaciones de
            marketing. No borra el aviso de apertura y no muestra tus datos. Si el enlace
            no es el que te dimos al anotarte, no cambia nada. Para retirar las novedades
            o pedir acceso o eliminación de tus datos, escribinos a{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-clinical underline-offset-4 hover:underline">
              {site.email}
            </a>
            . El responsable es Dérmica.
          </p>
        </PageHero>
        <Suspense fallback={<p className="mt-8 text-sm text-clinical">Cargando el enlace…</p>}>
          <WithdrawMarketing />
        </Suspense>
      </Container>
    </section>
  );
}
