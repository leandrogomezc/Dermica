import Link from "next/link";
import { nav, site, waitlistHref } from "@/lib/site";
import { categories } from "@/lib/data";
import { Container } from "@/components/ui";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-plum-900 text-cream/80">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-2xl font-semibold text-cream">Dérmica</span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            Dérmica prepara insumos de medicina estética para profesionales médicos en Nicaragua. Estamos en prelanzamiento.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-cream/70">
            Privacidad y datos:{" "}
            <a href={`mailto:${site.email}`} className="text-cream underline-offset-4 hover:underline">
              {site.email}
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cream">
            Navegación
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacidad" className="transition-colors hover:text-cream">
                Privacidad
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cream">
            Categorías previstas
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/catalogo/${category.slug}`}
                  className="transition-colors hover:text-cream"
                >
                  {category.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cream">
            Apertura
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/70">
            La lista de espera es el canal para saber cuándo abramos en {site.country}.
          </p>
          <Link
            href={waitlistHref}
            data-metric="cta"
            className="mt-4 inline-flex text-sm font-semibold text-cream underline-offset-4 hover:underline"
          >
            Avisame cuando abran
          </Link>
        </div>
      </Container>

      <div className="border-t border-cream/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-cream/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}.
          </p>
          <p>Próximamente en Nicaragua, para profesionales médicos.</p>
        </Container>
      </div>
    </footer>
  );
}
