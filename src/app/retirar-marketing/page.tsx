import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, Eyebrow } from "@/components/ui";
import { WithdrawMarketing } from "@/components/withdraw-marketing";

export const metadata: Metadata = {
  title: "Retirar novedades",
  robots: { index: false, follow: false },
};

export default function WithdrawPage() {
  return (
    <section className="border-b border-line bg-white">
      <Container className="max-w-3xl py-16 sm:py-20">
        <Eyebrow>Marketing</Eyebrow>
        <h1 className="font-display mt-4 text-4xl font-medium leading-tight text-plum sm:text-5xl">
          Retirar novedades por correo
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted">
          Este enlace solo retira el consentimiento de novedades y comunicaciones de
          marketing. No borra el aviso de apertura y no muestra tus datos. Si el enlace
          no es el que te dimos al anotarte, no cambia nada.
        </p>
        <Suspense fallback={<p className="mt-8 text-sm text-muted">Cargando el enlace…</p>}>
          <WithdrawMarketing />
        </Suspense>
      </Container>
    </section>
  );
}
