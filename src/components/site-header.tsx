"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { nav, waitlistHref } from "@/lib/site";
import { Container, ButtonLink } from "@/components/ui";
import { MenuIcon, CloseIcon } from "@/components/icons";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  function focusWaitlist(event: MouseEvent<HTMLAnchorElement>) {
    const section = document.getElementById("lista-espera");
    if (!section) return;
    event.preventDefault();
    setOpen(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    document.getElementById("waitlist-email")?.focus({ preventScroll: true });
    const next = `${pathname}#lista-espera`;
    window.history.replaceState(null, "", next);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-white/85 backdrop-blur-md">
      <Container className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Logo variant="horizontal" />
          <span className="hidden h-5 w-px bg-mist sm:block" aria-hidden="true" />
          <span className="hidden pl-3 text-xs font-medium text-clinical sm:block">
            Nicaragua
          </span>
        </Link>

        <nav className="hidden items-center gap-4 xl:gap-6 lg:flex" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`text-sm transition-colors hover:text-clinical ${
                isActive(item.href) ? "font-semibold text-clinical" : "font-medium text-clinical"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href={waitlistHref} onClick={focusWaitlist} metric="cta">
            Avisame cuando abran
          </ButtonLink>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-clinical hover:bg-sky-100 lg:hidden"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </Container>

      {open ? (
        <div id="menu-movil" className="border-t border-mist bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-sky-100 text-clinical"
                    : "text-clinical hover:bg-sky-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3">
              <ButtonLink href={waitlistHref} onClick={focusWaitlist} metric="cta" full>
                Avisame cuando abran
              </ButtonLink>
            </div>
            <p className="mt-3 px-4 text-sm text-clinical">Próximamente en Nicaragua</p>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
