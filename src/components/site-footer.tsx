import Link from "next/link";
import { nav, site, waitlistHref } from "@/lib/site";
import { categories } from "@/lib/data";
import { Container } from "@/components/ui";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-clinical text-white/80">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo variant="reverse" decorative />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Dérmica prepara insumos de medicina estética para médicos en Nicaragua. Abrimos en marzo de 2027.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Privacidad y datos:{" "}
            <a href={`mailto:${site.email}`} className="text-white underline-offset-4 hover:underline">
              {site.email}
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">
            Navegación
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/preguntas-frecuentes" className="transition-colors hover:text-white">
                Preguntas frecuentes
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className="transition-colors hover:text-white">
                Privacidad
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">
            Categorías previstas
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/catalogo/${category.slug}`}
                  className="transition-colors hover:text-white"
                >
                  {category.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">
            Apertura
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Anotate y te avisamos primero, antes de marzo de 2027, en {site.country}.
          </p>
          <Link
            href={waitlistHref}
            data-metric="cta"
            className="mt-4 inline-flex text-sm font-semibold text-white underline-offset-4 hover:underline"
          >
            Avisame cuando abran
          </Link>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/80 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}.
          </p>
          <p>Próximamente en Nicaragua, para profesionales médicos.</p>
        </Container>
      </div>
    </footer>
  );
}
