"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { nav, waitlistHref } from "@/lib/site";
import { Container, ButtonLink } from "@/components/ui";
import { MenuIcon, CloseIcon } from "@/components/icons";

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
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl font-semibold tracking-tight text-plum">
            Dérmica
          </span>
          <span className="hidden h-5 w-px bg-line sm:block" />
          <span className="hidden text-[11px] font-medium uppercase tracking-[0.2em] text-muted sm:block">
            Nicaragua
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`text-sm font-medium transition-colors hover:text-plum ${
                isActive(item.href) ? "text-plum" : "text-muted"
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-plum hover:bg-cream-200 lg:hidden"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </Container>

      {open ? (
        <div id="menu-movil" className="border-t border-line bg-cream lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-cream-200 text-plum"
                    : "text-ink hover:bg-cream-200"
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
            <p className="mt-3 px-4 text-sm text-muted">Próximamente en Nicaragua</p>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
