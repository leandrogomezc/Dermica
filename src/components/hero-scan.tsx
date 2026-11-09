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
        <span className="absolute left-1/2 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-sky/20 blur-3xl" />
        <span className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-sky/10 blur-3xl" />
      </div>

      <Container className="relative grid items-center gap-8 py-8 sm:gap-10 sm:py-12 lg:grid-cols-12 lg:gap-6 lg:py-20">
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

        <div className="order-2 min-w-0 lg:order-2 lg:col-span-4">
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
                className="min-w-0 rounded-2xl border border-mist bg-white/70 p-4 backdrop-blur-sm lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-4 lg:border-0 lg:bg-transparent lg:p-0"
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
        <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
          <Image
            src="/hero-rostro.webp"
            alt="Retrato ilustrativo de piel. Dérmica no realiza tratamientos."
            fill
            priority
            sizes="(max-width: 1024px) 80vw, 28rem"
            className="object-cover object-top"
          />
          {!reduce ? (
            <span className="animate-scan-sweep pointer-events-none absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-sky/30 to-transparent" />
          ) : null}
        </div>

        {focusPoints.map((item, index) => (
          <ScanBox key={item.slug} item={item} index={index} reduce={reduce} />
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-clinical">Imagen ilustrativa.</p>
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
          className="absolute left-[calc(100%+0.5rem)] top-1/2 hidden w-[9.5rem] -translate-y-1/2 rounded-lg bg-clinical/90 px-2.5 py-1.5 text-left shadow-lg backdrop-blur-sm transition-colors hover:bg-clinical sm:block"
        >
          <span className="block text-[11px] font-semibold leading-tight text-white">
            {item.label}
          </span>
          <span className="block text-[10px] leading-tight text-white/70">{item.note}</span>
        </Link>
      </div>
    </motion.div>
  );
}

function TrustBadge() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-mist bg-white/70 py-1.5 pl-1.5 pr-4 backdrop-blur-sm">
      <span className="text-xs font-medium text-clinical">Para profesionales médicos</span>
    </div>
  );
}
