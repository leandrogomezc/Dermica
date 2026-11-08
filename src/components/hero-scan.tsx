"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Container, ButtonLink } from "@/components/ui";
import { ArrowRightIcon } from "@/components/icons";
import { focusPoints } from "@/lib/data";
import { waitlistHref } from "@/lib/site";

const headline = ["Próximamente", "en", "Nicaragua"];

const stats = [
  { value: "NI", label: "Preparamos la llegada a Nicaragua" },
  { value: "3", label: "Categorías previstas para médicos" },
  { value: "Aviso", label: "Te escribimos cuando abramos" },
];

export function HeroScan() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.1 },
    },
  };

  const word: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16, filter: reduce ? "blur(0px)" : "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fade: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute left-1/2 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-blush/20 blur-3xl" />
        <span className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <Container className="relative grid items-center gap-10 py-12 lg:grid-cols-12 lg:gap-6 lg:py-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="order-2 lg:order-1 lg:col-span-4"
        >
          <motion.div variants={fade}>
            <TrustBadge />
          </motion.div>

          <h1 className="font-display mt-5 text-4xl font-medium leading-[1.05] text-plum sm:text-5xl">
            {headline.map((wordText) => (
              <motion.span key={wordText} variants={word} className="mr-[0.25em] inline-block">
                {wordText}
              </motion.span>
            ))}
          </h1>

          <motion.p variants={fade} className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Somos Dérmica. Preparamos una oferta para profesionales médicos: rellenos
            dérmicos de ácido hialurónico, revitalización inyectable y dermocosmética
            profesional. Todavía no vendemos ni atendemos pacientes.
          </motion.p>

          <motion.div variants={fade} className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <ButtonLink href={waitlistHref}>Unirme a la lista de espera</ButtonLink>
            <ButtonLink href="/catalogo" variant="outline">
              Ver categorías
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
          </motion.div>
        </motion.div>

        <div className="order-1 lg:order-2 lg:col-span-4">
          <FaceScan reduce={!!reduce} />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="order-3 lg:col-span-4 lg:pl-6"
        >
          <div className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-6">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fade}
                className="rounded-2xl border border-line bg-white/70 p-4 backdrop-blur-sm lg:flex lg:items-center lg:gap-4 lg:border-0 lg:bg-transparent lg:p-0"
              >
                <p className="font-display text-3xl font-semibold text-plum lg:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs leading-snug text-muted lg:mt-0 lg:max-w-[12rem] lg:text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function FaceScan({ reduce }: { reduce: boolean }) {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative aspect-[3/4] w-full">
        <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
          <Image
            src="/hero-rostro.png"
            alt="Retrato ilustrativo. Dérmica no realiza tratamientos ni agenda citas."
            fill
            priority
            sizes="(max-width: 1024px) 80vw, 28rem"
            className="object-cover object-top"
          />
          {!reduce ? (
            <span className="animate-scan-sweep pointer-events-none absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-blush/30 to-transparent" />
          ) : null}
        </div>

        {focusPoints.map((item, index) => (
          <ScanBox key={item.slug} item={item} index={index} reduce={reduce} />
        ))}
      </div>
      <ul className="mt-4 space-y-2 sm:hidden">
        {focusPoints.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/catalogo/${item.slug}`}
              className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-sm"
            >
              <span className="font-medium text-plum">{item.label}</span>
              <span className="text-muted">{item.note}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-xs text-muted">
        Imagen ilustrativa de las categorías previstas, no de un tratamiento.
      </p>
    </div>
  );
}

function ScanBox({
  item,
  index,
  reduce,
}: {
  item: (typeof focusPoints)[number];
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: reduce ? 0 : 1.1 + index * 0.5,
        duration: 0.5,
        ease: "easeOut",
      }}
      className="absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
      style={{ left: `${item.x}%`, top: `${item.y}%` }}
    >
      <div className="relative">
        <div className="h-14 w-14 rounded-md border-2 border-white shadow-[0_0_0_1px_rgba(74,44,58,0.15)]" />
        {!reduce ? (
          <span className="animate-pulse-ring absolute inset-0 rounded-md border-2 border-white" />
        ) : null}
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        <Link
          href={`/catalogo/${item.slug}`}
          className="absolute left-[calc(100%+0.5rem)] top-1/2 hidden w-[9.5rem] -translate-y-1/2 rounded-lg bg-plum/90 px-2.5 py-1.5 text-left shadow-lg backdrop-blur-sm transition-colors hover:bg-plum sm:block"
        >
          <span className="block text-[11px] font-semibold leading-tight text-cream">
            {item.label}
          </span>
          <span className="block text-[10px] leading-tight text-cream/70">{item.note}</span>
        </Link>
      </div>
    </motion.div>
  );
}

function TrustBadge() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-line bg-white/70 py-1.5 pl-1.5 pr-4 backdrop-blur-sm">
      <span className="rounded-full bg-plum px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-cream">
        Pronto
      </span>
      <span className="text-xs font-medium text-ink">Para profesionales médicos</span>
    </div>
  );
}
