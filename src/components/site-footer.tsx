import Link from "next/link";
import { nav, site } from "@/lib/site";
import { categories } from "@/lib/data";
import { Container } from "@/components/ui";
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
} from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-plum-900 text-cream/80">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-2xl font-semibold text-cream">
            Dérmica
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            Distribuidores autorizados de productos estéticos profesionales.
            Apoyamos el crecimiento de los negocios de belleza en toda Honduras.
          </p>
          <div className="mt-6 flex gap-3">
            <SocialLink href={site.social.instagram} label="Instagram">
              <InstagramIcon className="h-5 w-5" />
            </SocialLink>
            <SocialLink href={site.social.facebook} label="Facebook">
              <FacebookIcon className="h-5 w-5" />
            </SocialLink>
            <SocialLink href={site.social.tiktok} label="TikTok">
              <TikTokIcon className="h-5 w-5" />
            </SocialLink>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cream">
            Navegación
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cream">
            Categorías
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/catalogo?categoria=${c.slug}`}
                  className="transition-colors hover:text-cream"
                >
                  {c.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cream">
            Contacto
          </h3>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3">
              <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-blush" />
              <span>{site.phoneDisplay}</span>
            </li>
            <li className="flex gap-3">
              <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-blush" />
              <span>{site.email}</span>
            </li>
            {site.locations.map((loc) => (
              <li key={loc.city} className="flex gap-3">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-blush" />
                <span>
                  <strong className="font-medium text-cream">{loc.city}.</strong>{" "}
                  {loc.address}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-cream/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-cream/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Todos los derechos
            reservados.
          </p>
          <p>Hecho en Honduras para profesionales de la belleza.</p>
        </Container>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/80 transition-colors hover:border-blush hover:text-blush"
    >
      {children}
    </a>
  );
}
