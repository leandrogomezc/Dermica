"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons";

const categories = [
  "Aparatología estética",
  "Cuidado de la piel",
  "Insumos para pestañas y uñas",
  "Consumibles de spa",
  "Asesoría general",
];

export function ContactForm() {
  const [form, setForm] = useState({
    nombre: "",
    negocio: "",
    ciudad: "",
    interes: categories[0],
    mensaje: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = [
      "¡Hola Dérmica! Quiero más información:",
      `• Nombre: ${form.nombre || "—"}`,
      `• Negocio: ${form.negocio || "—"}`,
      `• Ciudad: ${form.ciudad || "—"}`,
      `• Interés: ${form.interes}`,
      form.mensaje ? `• Mensaje: ${form.mensaje}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-plum";
  const label = "block text-sm font-medium text-plum";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className={label}>
            Nombre
          </label>
          <input
            id="nombre"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Tu nombre"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="negocio" className={label}>
            Nombre del negocio
          </label>
          <input
            id="negocio"
            value={form.negocio}
            onChange={(e) => setForm({ ...form, negocio: e.target.value })}
            placeholder="Clínica, spa o salón"
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ciudad" className={label}>
            Ciudad
          </label>
          <input
            id="ciudad"
            value={form.ciudad}
            onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
            placeholder="Ej. Tegucigalpa"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="interes" className={label}>
            Me interesa
          </label>
          <select
            id="interes"
            value={form.interes}
            onChange={(e) => setForm({ ...form, interes: e.target.value })}
            className={field}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className={label}>
          Mensaje
        </label>
        <textarea
          id="mensaje"
          rows={4}
          value={form.mensaje}
          onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
          placeholder="Cuéntanos qué productos buscas o en qué te podemos ayudar…"
          className={`${field} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1eb558] sm:w-auto"
      >
        <WhatsAppIcon className="h-4 w-4" />
        Enviar por WhatsApp
      </button>
      <p className="text-xs text-muted">
        Al enviar, abriremos WhatsApp con tu mensaje listo para que solo
        presiones &ldquo;Enviar&rdquo;.
      </p>
    </form>
  );
}
