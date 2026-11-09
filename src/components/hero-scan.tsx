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
          <LayerPanel />
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

function LayerPanel() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative overflow-hidden rounded-2xl bg-sky-100 px-6 py-10">
        <SkinLayers />
        <div className="relative mx-auto w-fit rounded-2xl bg-sky-100 p-4">
          <Image
            src="/brand/dermica-isotipo-color.svg"
            alt=""
            width={88}
            height={108}
            unoptimized
            className="h-auto w-28"
          />
        </div>
      </div>
      <ul className="mt-4 space-y-2">
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

function SkinLayers() {
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <path d="M-10 52 C 50 32, 110 72, 170 52 S 290 32, 410 52" fill="none" stroke="#8BBDEF" strokeWidth="10" strokeLinecap="round" />
      <path d="M-10 100 C 60 80, 120 120, 180 100 S 300 80, 410 100" fill="none" stroke="#8BBDEF" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
      <path d="M-10 148 C 40 128, 130 168, 190 148 S 310 128, 410 148" fill="none" stroke="#8BBDEF" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M-10 192 C 70 172, 140 212, 200 192 S 320 172, 410 192" fill="none" stroke="#8BBDEF" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function TrustBadge() {
  return (
    <div className="inline-flex items-center rounded-lg border border-mist bg-white px-3 py-1.5">
      <span className="text-xs font-medium text-clinical">Para profesionales médicos</span>
    </div>
  );
}
