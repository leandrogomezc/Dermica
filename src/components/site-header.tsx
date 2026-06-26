"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { Container, ButtonLink } from "@/components/ui";
import { MenuIcon, CloseIcon, WhatsAppIcon } from "@/components/icons";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl font-semibold tracking-tight text-plum">
            Dérmica
          </span>
          <span className="hidden h-5 w-px bg-line sm:block" />
          <span className="hidden text-[11px] font-medium uppercase tracking-[0.2em] text-muted sm:block">
            Honduras
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-plum ${
                isActive(item.href) ? "text-plum" : "text-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href={whatsappLink()} variant="whatsapp" external>
            <WhatsAppIcon className="h-4 w-4" />
            Cotizar ahora
          </ButtonLink>
        </div>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-plum hover:bg-cream-200 lg:hidden"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </Container>

      {open ? (
        <div className="border-t border-line bg-cream lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
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
              <ButtonLink href={whatsappLink()} variant="whatsapp" external full>
                <WhatsAppIcon className="h-4 w-4" />
                Cotizar por WhatsApp
              </ButtonLink>
            </div>
            <p className="mt-3 px-4 text-sm text-muted">{site.phoneDisplay}</p>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
