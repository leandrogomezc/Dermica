"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const sentPages = new Set<string>();

export function SiteMetrics() {
  const pathname = usePathname();

  useEffect(() => {
    if (sentPages.has(pathname)) return;
    sentPages.add(pathname);
    void sendMetric("page_view", pathname);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest("[data-metric='cta']")) return;
      void sendMetric("cta_click", pathname);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  return null;
}

function sendMetric(event: "page_view" | "cta_click", path: string) {
  return fetch("/api/medicion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, path }),
    keepalive: true,
  }).catch(() => undefined);
}
