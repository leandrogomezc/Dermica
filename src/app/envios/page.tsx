import type { Metadata } from "next";
import { Container, SectionHeading, Eyebrow, ButtonLink } from "@/components/ui";
import {
  TruckIcon,
  MapPinIcon,
  CheckIcon,
  WhatsAppIcon,
  ClockIcon,
} from "@/components/icons";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Envíos y Cobertura",
  description:
    "Enviamos a todo Honduras con Cargo Expreso y CAEX. Conoce nuestro proceso de envío, tiempos de entrega por región y opciones de retiro en sede.",
};

const steps = [
  {
    title: "Cotiza y confirma",
    text: "Escríbenos por WhatsApp con los productos que necesitas. Te enviamos la cotización y los datos para tu transferencia.",
  },
  {
    title: "Preparamos tu pedido",
    text: "Una vez confirmado el pago, preparamos y empacamos tu pedido con cuidado el mismo día o el siguiente día hábil.",
  },
  {
    title: "Despachamos a tu ciudad",
    text: `Enviamos con ${site.couriers.join(" o ")} a la agencia más cercana o a tu dirección, según tu preferencia.`,
  },
  {
    title: "Recibe y a trabajar",
    text: "Te compartimos el número de guía para que des seguimiento a tu envío hasta que llegue a tus manos.",
  },
];

const zones = [
  { zone: "Tegucigalpa y San Pedro Sula", time: "1 a 2 días hábiles" },
  { zone: "Cabeceras departamentales", time: "2 a 3 días hábiles" },
  { zone: "Resto del país", time: "3 a 5 días hábiles" },
];

export default function ShippingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-white">
        <span className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full bg-blush/20 blur-3xl" />
        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Envíos y cobertura</Eyebrow>
            <h1 className="font-display mt-4 text-4xl font-medium leading-tight text-plum sm:text-5xl">
              Te llevamos tus productos a todo Honduras
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Estés donde estés, recibes tus insumos y equipos sin
              complicaciones. Trabajamos con {site.couriers.join(" y ")} para
              garantizar entregas seguras en todo el país.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Cómo funciona"
            title="Tu pedido en 4 pasos sencillos"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-line bg-white p-7"
              >
                <span className="font-display flex h-11 w-11 items-center justify-center rounded-full bg-plum text-lg font-semibold text-cream">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-semibold text-plum">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-white py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Tiempos de entrega"
              title="Cobertura en los 18 departamentos"
              description="Los tiempos pueden variar según la agencia de destino y la temporada. Te confirmamos el tiempo exacto al momento de cotizar."
            />
            <div className="mt-8 overflow-hidden rounded-2xl border border-line">
              {zones.map((z, i) => (
                <div
                  key={z.zone}
                  className={`flex items-center justify-between gap-4 p-5 ${
                    i % 2 === 0 ? "bg-cream" : "bg-cream-200"
                  }`}
                >
                  <span className="flex items-center gap-3 text-sm font-medium text-ink">
                    <MapPinIcon className="h-5 w-5 text-plum" />
                    {z.zone}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-muted">
                    <ClockIcon className="h-4 w-4" />
                    {z.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-line bg-cream p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-plum text-cream">
                <TruckIcon className="h-6 w-6" />
              </span>
              <h3 className="font-display mt-5 text-xl font-medium text-plum">
                Envío a agencia o a domicilio
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  `Retiro en agencia ${site.couriers.join(" / ")} de tu ciudad`,
                  "Entrega a domicilio en ciudades principales",
                  "Empaque seguro para equipos y aparatología",
                  "Número de guía para rastrear tu pedido",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-ink"
                  >
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-plum-900 p-8 text-cream">
              <h3 className="font-display text-xl font-medium">
                ¿Prefieres retirar en sede?
              </h3>
              <p className="mt-2 text-sm text-cream/80">
                Puedes recoger tu pedido sin costo de envío en nuestras sedes:
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {site.locations.map((loc) => (
                  <li key={loc.city} className="flex items-start gap-3">
                    <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-blush" />
                    <span>
                      <strong className="text-cream">{loc.city}.</strong>{" "}
                      {loc.address}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 text-center">
        <Container>
          <h2 className="font-display text-2xl font-medium text-plum sm:text-3xl">
            ¿Dudas con tu envío? Escríbenos
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Te ayudamos a calcular el costo y tiempo de envío a tu ciudad antes
            de confirmar tu pedido.
          </p>
          <div className="mt-6 flex justify-center">
            <ButtonLink href={whatsappLink()} variant="whatsapp" external>
              <WhatsAppIcon className="h-4 w-4" />
              Consultar envío por WhatsApp
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
