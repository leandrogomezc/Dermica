"use client";

import { cloneElement, useEffect, useId, useRef, useState, type FormEvent, type ReactElement } from "react";
import { site } from "@/lib/site";
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
  marketingConsent: false,
};

const fieldOrder: WaitlistField[] = [
  "email",
  "consent",
  "marketingConsent",
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
  const [withdrawPath, setWithdrawPath] = useState("");
  const notedStart = useRef(false);

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
    setWithdrawPath("");

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
        withdrawPath?: string;
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
      setWithdrawPath(typeof body.withdrawPath === "string" ? body.withdrawPath : "");
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

  function noteFormStart() {
    if (notedStart.current) return;
    notedStart.current = true;
    void fetch("/api/medicion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "form_start", path: window.location.pathname }),
      keepalive: true,
    }).catch(() => undefined);
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-clinical bg-white px-4 py-3 text-sm text-clinical outline-none transition-colors placeholder:text-clinical focus:border-clinical focus-visible:ring-4 focus-visible:ring-clinical/15 aria-[invalid=true]:border-clinical";

  return (
    <form
      id={`${formId}-form`}
      onSubmit={onSubmit}
      onFocus={noteFormStart}
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
                  ? "bg-sky-100 text-clinical"
                  : status === "error"
                    ? "bg-white text-clinical ring-1 ring-clinical/20"
                    : "bg-sky-100 text-clinical"
              }`
        }
      >
        {status === "loading" ? "Guardando tu registro…" : message}
        {status === "success" && withdrawPath ? (
          <>
            <span className="mt-2 block">
              Guardá este enlace. Si lo perdés, pedí el retiro de las novedades a {site.email}.
            </span>
            <a href={withdrawPath} className="mt-2 block font-semibold text-clinical underline-offset-4 hover:underline">
              Retirar el consentimiento de novedades
            </a>
          </>
        ) : null}
      </div>

      {store ? (
        <p className="text-sm leading-relaxed text-clinical">{store.storageNote}</p>
      ) : (
        <p className="text-sm text-clinical">Comprobando si la lista puede guardar registros…</p>
      )}

      <Field
        id="waitlist-email"
        label="Correo"
        required
        error={errors.email}
        hint="Ahí te escribimos primero, antes de marzo de 2027."
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
        className="rounded-lg border border-clinical px-4 py-3"
        open={detailsOpen}
        onToggle={(event) => setDetailsOpen(event.currentTarget.open)}
      >
        <summary className="cursor-pointer text-sm font-medium text-clinical">
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
        <label htmlFor="waitlist-consent" className="flex items-start gap-3 text-sm text-clinical">
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
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-clinical accent-clinical focus-visible:ring-4 focus-visible:ring-clinical/20"
          />
          <span>
            <span className="font-medium text-clinical">Quiero enterarme primero.</span>{" "}
            Acepto que Dérmica guarde estos datos solo para avisarme de la apertura.
          </span>
        </label>
        <p id="waitlist-consent-hint" className="mt-2 pl-8 text-xs leading-relaxed text-clinical">
          La casilla viene desmarcada. No es una suscripción de marketing ni autoriza correos o
          WhatsApp automáticos.
        </p>
        {errors.consent ? (
          <p id="waitlist-consent-error" className="mt-2 pl-8 text-sm text-clinical">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="waitlist-marketing" className="flex items-start gap-3 text-sm text-clinical">
          <input
            id="waitlist-marketing"
            name="marketingConsent"
            type="checkbox"
            aria-describedby={
              errors.marketingConsent
                ? "waitlist-marketing-hint waitlist-marketing-error"
                : "waitlist-marketing-hint"
            }
            aria-invalid={errors.marketingConsent ? true : undefined}
            checked={fields.marketingConsent}
            onChange={(event) => update("marketingConsent", event.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-clinical accent-clinical focus-visible:ring-4 focus-visible:ring-clinical/20"
          />
          <span>
            Quiero recibir por correo novedades y comunicaciones de marketing de Dérmica.
            Puedo retirar mi consentimiento con el enlace que se muestra al guardar o escribiendo a {site.email}.
          </span>
        </label>
        <p id="waitlist-marketing-hint" className="mt-2 pl-8 text-xs leading-relaxed text-clinical">
          Opcional y desmarcada. No frena el aviso de apertura. Es solo por correo: no autoriza
          WhatsApp, SMS ni compartir tus datos con terceros.
        </p>
        {errors.marketingConsent ? (
          <p id="waitlist-marketing-error" className="mt-2 pl-8 text-sm text-clinical">
            {errors.marketingConsent}
          </p>
        ) : null}
      </div>

      <p id="waitlist-privacy" className="text-xs leading-relaxed text-clinical">
        Guardamos tu correo para avisarte de la apertura. Si los escribís, también el nombre,
        la especialidad, la ciudad y el teléfono. Las novedades, si las marcás, son aparte y
        solo por correo. No pedimos datos de pacientes.{" "}
        <a href="/privacidad" className="font-semibold text-clinical underline-offset-4 hover:underline">
          Privacidad
        </a>
      </p>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-clinical px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-clinical/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-clinical/30 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
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
  const labelClass = "block text-sm font-medium text-clinical";
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? `${hintId} ${errorId}` : hintId;

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}{" "}
        <span className="font-normal text-clinical">{required ? "(obligatorio)" : "(opcional)"}</span>
      </label>
      <Described fieldId={id} describedBy={describedBy}>
        {children}
      </Described>
      <p id={hintId} className="mt-1.5 text-xs leading-relaxed text-clinical">
        {hint}
      </p>
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-clinical">
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
  const id =
    field === "consent"
      ? "waitlist-consent"
      : field === "marketingConsent"
        ? "waitlist-marketing"
        : `waitlist-${fieldId(field)}`;
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
    case "marketingConsent":
      return "marketing";
    case "consent":
      return "consent";
  }
}
