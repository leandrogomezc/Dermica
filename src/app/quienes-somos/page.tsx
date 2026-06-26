import type { Metadata } from "next";
import { Container, SectionHeading, Eyebrow } from "@/components/ui";
import { CtaBanner } from "@/components/cta-banner";
import { ShieldIcon, TruckIcon, CheckIcon, StarIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Quiénes Somos",
  description:
    "Dérmica es una distribuidora hondureña de productos estéticos profesionales. Distribuidores autorizados que apoyan el crecimiento de los negocios de belleza en todo el país.",
};

const values = [
  {
    icon: ShieldIcon,
    title: "Productos con respaldo",
    text: "Trabajamos solo con marcas originales y distribuidores autorizados. Lo que llega a tu cabina es de calidad comprobada.",
  },
  {
    icon: StarIcon,
    title: "Asesoría especializada",
    text: "Más que vender, te acompañamos: te ayudamos a elegir el equipo o producto correcto para tus protocolos.",
  },
  {
    icon: TruckIcon,
    title: "Cobertura nacional",
    text: "Llegamos a Tegucigalpa, San Pedro Sula y todo Honduras con envíos confiables y tiempos claros.",
  },
];

const stats = [
  { value: "+500", label: "Profesionales abastecidos" },
  { value: "8+", label: "Marcas representadas" },
  { value: "18", label: "Departamentos con cobertura" },
  { value: "2", label: "Sedes en Honduras" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-white">
        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Quiénes somos</Eyebrow>
            <h1 className="font-display mt-4 text-4xl font-medium leading-tight text-plum sm:text-5xl">
              Impulsamos el crecimiento de la belleza profesional en Honduras
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Dérmica nació con un propósito claro: que los profesionales de la
              estética en Honduras tengan acceso a productos y equipos de
              primer nivel, sin complicaciones y con el respaldo que merecen.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5 text-base leading-relaxed text-ink">
            <SectionHeading
              eyebrow="Nuestra historia"
              title="De una necesidad real a un aliado de confianza"
            />
            <p>
              Sabemos lo frustrante que es quedarse sin insumos a mitad de mes o
              invertir en un equipo sin respaldo técnico. Por eso construimos
              Dérmica: una distribuidora que entiende el día a día de las
              clínicas, spas y salones de belleza hondureños.
            </p>
            <p>
              Como <strong>distribuidores autorizados</strong>, seleccionamos
              cuidadosamente cada marca que representamos para garantizar
              originalidad, calidad y respaldo. Hoy abastecemos a cientos de
              profesionales en todo el país, desde esteticistas independientes
              hasta clínicas dermatológicas.
            </p>
            <p>
              Nuestro compromiso va más allá de la venta: queremos que tu
              negocio crezca. Por eso ofrecemos asesoría personalizada, precios
              en lempiras y dólares, y la comodidad de cotizar por WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-line bg-cream-200 p-7 text-center"
              >
                <p className="font-display text-4xl font-semibold text-plum">
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Nuestros valores"
            title="Lo que nos hace tu mejor aliado"
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-line bg-cream p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-plum text-cream">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="font-display mt-5 text-xl font-medium text-plum">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 rounded-3xl bg-plum-900 p-10 text-cream sm:p-14 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>Nuestra promesa</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-medium leading-tight text-cream">
                Productos originales, asesoría real y entregas a tiempo
              </h2>
            </div>
            <ul className="space-y-4">
              {[
                "Distribuidores autorizados de marcas líderes",
                "Atención personalizada por WhatsApp",
                "Precios claros en lempiras y dólares",
                "Envíos a todo el país y retiro en sede",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-cream/90">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-blush" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
