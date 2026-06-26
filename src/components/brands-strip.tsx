import { brands } from "@/lib/data";
import { Container, Eyebrow } from "@/components/ui";

export function BrandsStrip() {
  const loop = [...brands, ...brands];
  return (
    <section className="border-y border-line bg-white py-12">
      <Container>
        <div className="text-center">
          <Eyebrow>Marcas aliadas</Eyebrow>
          <p className="mt-3 text-sm text-muted">
            Distribuidor autorizado de marcas líderes en estética profesional
          </p>
        </div>
      </Container>
      <div className="relative mt-8 overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 px-6">
          {loop.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex shrink-0 items-center gap-3"
            >
              <span className="font-display text-2xl font-semibold text-plum/70">
                {brand.name}
              </span>
              <span className="text-xs uppercase tracking-wider text-muted">
                {brand.origin}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
