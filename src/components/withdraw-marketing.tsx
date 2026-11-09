"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function WithdrawMarketing() {
  const params = useSearchParams();
  const token = params.get("token")?.trim() ?? "";
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function withdraw() {
    if (!token || status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/lista-espera/retirar", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ token }),
      });
      const body = (await response.json()) as { message?: string };
      setMessage(body.message || "No pudimos completar el pedido.");
      setStatus(response.ok ? "done" : "error");
    } catch {
      setMessage("No hubo respuesta del servidor. No podemos confirmar el cambio.");
      setStatus("error");
    }
  }

  return (
    <div className="mt-8">
      {token ? (
        <button
          type="button"
          onClick={withdraw}
          disabled={status === "loading" || status === "done"}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-clinical px-6 py-3 text-sm font-semibold text-white hover:bg-clinical/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-clinical/30 disabled:opacity-70"
        >
          {status === "loading" ? "Retirando…" : "Retirar novedades por correo"}
        </button>
      ) : (
        <p className="text-sm text-clinical">Este enlace no incluye la clave. No cambiamos ninguna preferencia.</p>
      )}
      <div role={status === "error" ? "alert" : "status"} aria-live="polite" className="mt-4 text-sm text-clinical">
        {message}
      </div>
    </div>
  );
}
