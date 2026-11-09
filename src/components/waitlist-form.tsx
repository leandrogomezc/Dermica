"use client";

import { cloneElement, useEffect, useId, useRef, useState, type FormEvent, type ReactElement } from "react";
import {
  validateWaitlist,
  type WaitlistField,
  type WaitlistFields,
} from "@/lib/waitlist-validation";

type StoreStatus = {
  configured: boolean;
  storageNote: string;
};

type FieldErrors = Partial<Record<WaitlistField, string>>;

const emptyFields: WaitlistFields = {
  name: "",
  email: "",
  specialty: "",
  city: "",
  phone: "",
  consent: false,
};

const fieldOrder: WaitlistField[] = [
  "email",
  "consent",
  "name",
  "specialty",
  "city",
  "phone",
];

const optionalFields: WaitlistField[] = ["name", "specialty", "city", "phone"];

export function WaitlistForm() {
  const formId = useId();
  const startedAt = useRef(0);
  const inFlight = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState<WaitlistFields>(emptyFields);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [store, setStore] = useState<StoreStatus | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    startedAt.current = Date.now();
    const controller = new AbortController();
    fetch("/api/lista-espera", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("status");
        return (await response.json()) as StoreStatus;
      })
      .then(setStore)
      .catch(() => {
        if (controller.signal.aborted) return;
        setStore({
          configured: false,
          storageNote:
            "No pudimos confirmar si la lista puede guardar registros. Si enviás el formulario y no ves una confirmación, el correo no quedó anotado.",
        });
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (window.location.hash !== "#lista-espera") return;
    document.getElementById("waitlist-email")?.focus();
  }, []);

  function update<K extends WaitlistField>(key: K, value: WaitlistFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const validated = validateWaitlist(fields);
    if (!validated.ok) {
      setErrors(validated.fieldErrors);
      setStatus("error");
      setMessage("Revisá los campos marcados. Todavía no enviamos el formulario.");
      if (optionalFields.some((field) => validated.fieldErrors[field])) {
        setDetailsOpen(true);
      }
      window.setTimeout(() => focusField(validated.fieldErrors), 0);
      return;
    }

    inFlight.current = true;
    setStatus("loading");
    setErrors({});
    setMessage("");

    try {
      const response = await fetch("/api/lista-espera", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...fields,
          companyWebsite: honeypot,
          startedAt: startedAt.current,
        }),
      });
      const body = (await response.json()) as {
        ok?: boolean;
        message?: string;
        fieldErrors?: FieldErrors;
      };
      if (!response.ok || body.ok !== true) {
        setStatus("error");
        setMessage(body.message || "No pudimos anotarte. Tu correo no quedó registrado.");
        setErrors(body.fieldErrors ?? {});
        if (body.fieldErrors) focusField(body.fieldErrors);
        else statusRef.current?.focus();
        return;
      }
      setStatus("success");
      setMessage(body.message || "Guardamos tu registro.");
      setFields(emptyFields);
      statusRef.current?.focus();
    } catch {
      setStatus("error");
      setMessage(
        "No hubo respuesta del servidor. No podemos confirmar que el registro se haya guardado.",
      );
      statusRef.current?.focus();
    } finally {
      inFlight.current = false;
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-plum focus-visible:ring-4 focus-visible:ring-plum/15 aria-[invalid=true]:border-plum-700";

  return (
    <form
      id={`${formId}-form`}
      onSubmit={onSubmit}
      noValidate
      aria-busy={status === "loading"}
      className="relative space-y-5"
    >
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="waitlist-website">Sitio web</label>
        <input
          id="waitlist-website"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div
        ref={statusRef}
        tabIndex={-1}
        role={status === "error" ? "alert" : "status"}
        aria-live={status === "idle" ? "off" : "polite"}
        className={
          status === "idle"
            ? "sr-only"
            : `rounded-2xl px-4 py-3 text-sm outline-none ${
                status === "success"
                  ? "bg-cream-200 text-plum"
                  : status === "error"
                    ? "bg-white text-plum ring-1 ring-plum/20"
                    : "bg-cream-200 text-ink"
              }`
        }
      >
        {status === "loading" ? "Guardando tu registro…" : message}
      </div>

      {store ? (
        <p className="text-sm leading-relaxed text-muted">{store.storageNote}</p>
      ) : (
        <p className="text-sm text-muted">Comprobando si la lista puede guardar registros…</p>
      )}

      <Field
        id="waitlist-email"
        label="Correo"
        required
        error={errors.email}
        hint="Ahí te vamos a escribir para avisarte de la apertura."
      >
        <input
          id="waitlist-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={errors.email ? true : undefined}
          value={fields.email}
          onChange={(event) => update("email", event.target.value)}
          className={inputClass}
        />
      </Field>

      <details
        className="rounded-xl border border-line px-4 py-3"
        open={detailsOpen}
        onToggle={(event) => setDetailsOpen(event.currentTarget.open)}
      >
        <summary className="cursor-pointer text-sm font-medium text-plum">
          Agregar nombre, ciudad o teléfono (opcional)
        </summary>
        <div className="mt-4 space-y-5">
          <Field
            id="waitlist-nombre"
            label="Nombre"
            error={errors.name}
            hint="Opcional. Nombre y apellido, como querés que te identifiquemos."
          >
            <input
              id="waitlist-nombre"
              name="name"
              type="text"
              autoComplete="name"
              aria-invalid={errors.name ? true : undefined}
              value={fields.name}
              onChange={(event) => update("name", event.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="waitlist-especialidad"
              label="Especialidad"
              error={errors.specialty}
              hint="Opcional. Por ejemplo, dermatología. No escribás datos de pacientes."
            >
              <input
                id="waitlist-especialidad"
                name="specialty"
                type="text"
                autoComplete="off"
                aria-invalid={errors.specialty ? true : undefined}
                value={fields.specialty}
                onChange={(event) => update("specialty", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field
              id="waitlist-ciudad"
              label="Ciudad"
              error={errors.city}
              hint="Opcional. La ciudad de Nicaragua donde ejercés."
            >
              <input
                id="waitlist-ciudad"
                name="city"
                type="text"
                autoComplete="address-level2"
                aria-invalid={errors.city ? true : undefined}
                value={fields.city}
                onChange={(event) => update("city", event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field
            id="waitlist-telefono"
            label="Teléfono"
            error={errors.phone}
            hint="Opcional. Solo para el aviso de apertura."
          >
            <input
              id="waitlist-telefono"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              aria-invalid={errors.phone ? true : undefined}
              value={fields.phone}
              onChange={(event) => update("phone", event.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </details>

      <div>
        <label htmlFor="waitlist-consent" className="flex items-start gap-3 text-sm text-ink">
          <input
            id="waitlist-consent"
            name="consent"
            type="checkbox"
            required
            aria-required="true"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={
            errors.consent
              ? "waitlist-consent-hint waitlist-privacy waitlist-consent-error"
              : "waitlist-consent-hint waitlist-privacy"
          }
            checked={fields.consent}
            onChange={(event) => update("consent", event.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-line text-plum focus-visible:ring-4 focus-visible:ring-plum/20"
          />
          <span>
            <span className="font-medium text-plum">Quiero enterarme de la apertura.</span>{" "}
            Acepto que Dérmica guarde estos datos solo para avisarme cuando abra en Nicaragua.
          </span>
        </label>
        <p id="waitlist-consent-hint" className="mt-2 pl-8 text-xs leading-relaxed text-muted">
          La casilla viene desmarcada. No es una suscripción de mercadeo ni autoriza correos o
          WhatsApp automáticos.
        </p>
        {errors.consent ? (
          <p id="waitlist-consent-error" className="mt-2 pl-8 text-sm text-plum-700">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <p id="waitlist-privacy" className="text-xs leading-relaxed text-muted">
        Guardamos el correo y esta aceptación, y, si los escribís, el nombre, la especialidad,
        la ciudad y el teléfono, junto con la fecha. Sirven solo para el aviso de apertura.
        No pedimos datos de pacientes ni documentos. No sale un correo ni un WhatsApp
        automático.
      </p>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-full bg-plum px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-plum-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-plum/30 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {status === "loading" ? "Guardando…" : "Avisame cuando abran"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint: string;
  children: ReactElement<{ id?: string; "aria-describedby"?: string }>;
}) {
  const labelClass = "block text-sm font-medium text-plum";
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? `${hintId} ${errorId}` : hintId;

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}{" "}
        <span className="font-normal text-muted">{required ? "(obligatorio)" : "(opcional)"}</span>
      </label>
      <Described fieldId={id} describedBy={describedBy}>
        {children}
      </Described>
      <p id={hintId} className="mt-1.5 text-xs leading-relaxed text-muted">
        {hint}
      </p>
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-plum-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Described({
  fieldId,
  describedBy,
  children,
}: {
  fieldId: string;
  describedBy: string;
  children: ReactElement<{ id?: string; "aria-describedby"?: string }>;
}) {
  return cloneElement(children, { id: fieldId, "aria-describedby": describedBy });
}

function focusField(errors: FieldErrors) {
  const field = fieldOrder.find((key) => errors[key]);
  if (!field) return;
  const id = field === "consent" ? "waitlist-consent" : `waitlist-${fieldId(field)}`;
  document.getElementById(id)?.focus();
}

function fieldId(field: WaitlistField): string {
  switch (field) {
    case "name":
      return "nombre";
    case "email":
      return "email";
    case "specialty":
      return "especialidad";
    case "city":
      return "ciudad";
    case "phone":
      return "telefono";
    case "consent":
      return "consent";
  }
}
