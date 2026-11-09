import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui";
import { faq } from "@/lib/faq";
import { pageMetadata } from "@/lib/page-metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Preguntas frecuentes",
  description:
    "Respuestas sobre la apertura de Dérmica en marzo 2027, el cupo de 30 médicos fundadores, las categorías y cómo pedir el retiro de datos.",
  path: "/preguntas-frecuentes",
});

export default function FaqPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="border-b border-line bg-white">
      <Container className="max-w-3xl py-16 sm:py-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Eyebrow>Preguntas frecuentes</Eyebrow>
        <h1 className="font-display mt-4 text-4xl font-medium leading-tight text-plum sm:text-5xl">
          Preguntas frecuentes sobre Dérmica
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted">
          Estas respuestas usan solo lo que el sitio ya dice. {site.name} está en
          prelanzamiento en Nicaragua y no es una clínica.
        </p>
        <div className="mt-10 space-y-8">
          {faq.map((item) => (
            <article key={item.question}>
              <h2 className="font-display text-2xl font-medium text-plum">{item.question}</h2>
              <p className="mt-3 text-base leading-relaxed text-ink">{item.answer}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 text-sm leading-relaxed text-muted">
          El detalle de los datos está en{" "}
          <Link href="/privacidad" className="font-semibold text-plum underline-offset-4 hover:underline">
            Privacidad
          </Link>
          . El formulario está en{" "}
          <Link href="/contacto" className="font-semibold text-plum underline-offset-4 hover:underline">
            Contacto
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
