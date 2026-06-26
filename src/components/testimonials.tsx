import { testimonials } from "@/lib/data";
import { Container, SectionHeading } from "@/components/ui";
import { StarIcon } from "@/components/icons";

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Lo que dicen nuestros clientes"
          title="Negocios de belleza que confían en Dérmica"
          description="Clínicas, spas y profesionales en todo el país nos eligen por la calidad de nuestros productos y el respaldo que ofrecemos."
          align="center"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="flex flex-col rounded-2xl border border-line bg-white p-7"
            >
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <p className="font-semibold text-plum">{t.author}</p>
                <p className="text-sm text-muted">
                  {t.role} · {t.city}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
