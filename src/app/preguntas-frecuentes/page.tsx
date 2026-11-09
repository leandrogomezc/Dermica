import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHero } from "@/components/ui";
import { faq } from "@/lib/faq";
import { pageMetadata } from "@/lib/page-metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Preguntas frecuentes",
  description:
    "Respuestas sobre la apertura de Dérmica en marzo de 2027, el cupo de 30 médicos fundadores, las categorías y cómo pedir el retiro de datos.",
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
    <section className="border-b border-mist bg-white">
      <Container className="max-w-3xl py-16 sm:py-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <PageHero eyebrow="Preguntas frecuentes" title="Preguntas frecuentes sobre Dérmica">
          <p className="mt-6 text-base leading-relaxed text-clinical">
            Estas respuestas usan solo lo que el sitio ya dice. {site.name} está en
            prelanzamiento en Nicaragua y no es una clínica.
          </p>
        </PageHero>
        <div className="mt-10 space-y-8">
          {faq.map((item) => (
            <article key={item.question}>
              <h2 className="font-display text-2xl font-semibold text-clinical">{item.question}</h2>
              <p className="mt-3 text-base leading-relaxed text-clinical">{item.answer}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 text-sm leading-relaxed text-clinical">
          El detalle de los datos está en{" "}
          <Link href="/privacidad" className="font-semibold text-clinical underline-offset-4 hover:underline">
            Privacidad
          </Link>
          . El formulario está en{" "}
          <Link href="/contacto" className="font-semibold text-clinical underline-offset-4 hover:underline">
            Contacto
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
