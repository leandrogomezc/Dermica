"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Container, ButtonLink } from "@/components/ui";
import { ArrowRightIcon } from "@/components/icons";
import { focusPoints } from "@/lib/data";
import { waitlistHref } from "@/lib/site";

const headline = [
  "Insumos",
  "de",
  "medicina",
  "estética",
  "para",
  "médicos",
  "de",
  "Nicaragua",
];

const stats = [
  { value: "3", label: "Categorías para la práctica médica" },
  { value: "30", label: "Cupos para médicos fundadores" },
  { value: "2027", label: "Apertura en marzo" },
];

export function HeroScan() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.04, delayChildren: reduce ? 0 : 0.05 },
    },
  };

  const word: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.35, ease: "easeOut" },
    },
  };

  const fade: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.35, ease: "easeOut" } },
  };

  return (
    <section>
      <Container className="grid items-center gap-8 py-8 sm:gap-10 sm:py-12 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="order-1 min-w-0 lg:col-span-5"
        >
          <motion.div variants={fade}>
            <TrustBadge />
          </motion.div>

          <h1 className="font-display mt-4 max-w-full text-4xl font-semibold leading-[1.05] text-clinical sm:mt-5 sm:text-5xl">
            {headline.map((wordText, index) => (
              <motion.span key={`${wordText}-${index}`} variants={word} className="mr-[0.25em] inline-block!">
                {wordText}
              </motion.span>
            ))}
          </h1>

          <motion.p variants={fade} className="mt-5 max-w-md text-base leading-relaxed text-clinical">
            Anotate y enterate primero. En marzo de 2027 abrimos en Nicaragua: un cupo
            de 30 médicos fundadores, con acceso anticipado y precio de apertura,
            para tu consulta.
          </motion.p>

          <motion.div variants={fade} className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row lg:flex-col xl:flex-row">
            <ButtonLink href={waitlistHref} metric="cta" className="shrink-0 whitespace-nowrap">
              Avisame cuando abran
            </ButtonLink>
            <ButtonLink href="/catalogo" variant="outline" className="shrink-0 whitespace-nowrap">
              Ver categorías
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
          </motion.div>
          <motion.p variants={fade} className="mt-4 max-w-md text-sm text-clinical">
            Todavía no vendemos ni atendemos pacientes. Anotarte no te garantiza el cupo: te avisamos primero.
          </motion.p>
        </motion.div>

        <div className="order-2 min-w-0 lg:col-span-4">
          <FaceScan reduce={!!reduce} />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="order-3 min-w-0 lg:col-span-3 lg:pl-2"
        >
          <div className="grid grid-cols-1 gap-3 min-[36rem]:grid-cols-3 min-[36rem]:gap-4 lg:grid-cols-1 lg:gap-6">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fade}
                className="min-w-0 rounded-2xl border border-mist bg-white p-4 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-4 lg:border-0 lg:bg-transparent lg:p-0"
              >
                <p className="whitespace-nowrap font-display text-[clamp(1.75rem,2.4vw,2.25rem)] font-semibold leading-none text-clinical">
                  {stat.value}
                </p>
                <p className="mt-1 min-w-0 text-xs leading-snug text-clinical lg:mt-0 lg:text-sm">
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
    <div className="mx-auto w-full max-w-[220px] sm:max-w-sm">
      <div className="relative aspect-[4/5] w-full sm:aspect-[3/4]">
        <div className="relative h-full w-full overflow-hidden rounded-2xl ring-1 ring-clinical">
          <Image
            src="/hero-rostro.webp"
            alt="Retrato ilustrativo de piel. Dérmica no realiza tratamientos."
            fill
            priority
            sizes="(max-width: 1024px) 80vw, 28rem"
            className="object-cover object-top"
          />
          <span className="pointer-events-none absolute inset-0 bg-clinical/20 mix-blend-multiply" />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-sky-100/50 to-transparent" />
        </div>

        {focusPoints.map((item, index) => (
          <ScanBox key={item.slug} item={item} index={index} reduce={reduce} />
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-clinical">Imagen ilustrativa.</p>
      <ul className="mt-4 space-y-2 sm:hidden">
        {focusPoints.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/catalogo/${item.slug}`}
              className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-mist bg-white px-4 py-2.5"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-clinical">{item.label}</span>
                <span className="block text-xs text-clinical">{item.note}</span>
              </span>
              <ArrowRightIcon className="h-4 w-4 shrink-0 text-clinical" />
            </Link>
          </li>
        ))}
      </ul>
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
      initial={{ opacity: reduce ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: reduce ? 0 : 0.2 + index * 0.12, duration: reduce ? 0 : 0.35, ease: "easeOut" }}
      className="absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
      style={{ left: `${item.x}%`, top: `${item.y}%` }}
    >
      <div className="relative">
        <div className="h-14 w-14 rounded-md border-2 border-white shadow-[0_0_0_1px_rgba(30,58,95,0.45)]" />
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        <Link
          href={`/catalogo/${item.slug}`}
          className="absolute left-[calc(100%+0.5rem)] top-1/2 hidden w-[9.5rem] -translate-y-1/2 rounded-lg bg-clinical px-2.5 py-1.5 text-left transition-colors hover:bg-clinical/90 sm:block"
        >
          <span className="block text-[11px] font-semibold leading-tight text-white">{item.label}</span>
          <span className="block text-[10px] leading-tight text-white/80">{item.note}</span>
        </Link>
      </div>
    </motion.div>
  );
}

function TrustBadge() {
  return (
    <div className="inline-flex items-center rounded-lg border border-mist bg-white px-3 py-1.5">
      <span className="text-xs font-medium text-clinical">Para profesionales médicos</span>
    </div>
  );
}
