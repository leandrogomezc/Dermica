import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para cotizaciones y asesoría. Escríbenos por WhatsApp, llámanos o visítanos en Tegucigalpa y San Pedro Sula.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Contacto</Eyebrow>
            <h1 className="font-display mt-4 text-4xl font-medium leading-tight text-plum sm:text-5xl">
              Hablemos de tu próximo pedido
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Cotizaciones personalizadas, asesoría y atención cercana. Elige el
              canal que más te convenga; respondemos rápido.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl bg-plum p-8 text-cream">
              <h2 className="font-display text-2xl font-medium">
                Cotiza por WhatsApp
              </h2>
              <p className="mt-2 text-sm text-cream/80">
                La forma más rápida de recibir precios y disponibilidad.
              </p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1eb558]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Abrir WhatsApp
              </a>
            </div>

            <ul className="space-y-5 rounded-2xl border border-line bg-white p-8">
              <ContactItem icon={<PhoneIcon className="h-5 w-5" />} label="Teléfono">
                {site.phoneDisplay}
              </ContactItem>
              <ContactItem icon={<MailIcon className="h-5 w-5" />} label="Correo">
                {site.email}
              </ContactItem>
              <ContactItem icon={<ClockIcon className="h-5 w-5" />} label="Horario">
                {site.hours}
              </ContactItem>
              {site.locations.map((loc) => (
                <ContactItem
                  key={loc.city}
                  icon={<MapPinIcon className="h-5 w-5" />}
                  label={`Sede ${loc.city}`}
                >
                  {loc.address}
                </ContactItem>
              ))}
            </ul>

            <div className="rounded-2xl border border-line bg-white p-8">
              <h3 className="text-sm font-semibold text-plum">Síguenos</h3>
              <div className="mt-4 flex gap-3">
                <Social href={site.social.instagram} label="Instagram">
                  <InstagramIcon className="h-5 w-5" />
                </Social>
                <Social href={site.social.facebook} label="Facebook">
                  <FacebookIcon className="h-5 w-5" />
                </Social>
                <Social href={site.social.tiktok} label="TikTok">
                  <TikTokIcon className="h-5 w-5" />
                </Social>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-line bg-white p-8">
              <h2 className="font-display text-2xl font-medium text-plum">
                Escríbenos
              </h2>
              <p className="mt-2 text-sm text-muted">
                Completa el formulario y te contactaremos por WhatsApp con tu
                cotización.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </Container>

      <section className="pb-16">
        <Container>
          <div className="overflow-hidden rounded-3xl border border-line">
            <iframe
              title="Ubicación de Dérmica"
              src={site.mapEmbed}
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full"
            />
          </div>
        </Container>
      </section>
    </>
  );
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream-200 text-plum">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-ink">{children}</p>
      </div>
    </li>
  );
}

function Social({
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
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-plum transition-colors hover:border-plum hover:bg-plum hover:text-cream"
    >
      {children}
    </a>
  );
}
