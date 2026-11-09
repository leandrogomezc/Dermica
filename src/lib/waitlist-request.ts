import {
  describeWaitlistStore,
  saveWaitlistEntry,
  type WaitlistStoreInfo,
} from "./waitlist-store";
import { validateWaitlist, type WaitlistFields } from "./waitlist-validation";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MIN_FILL_MS = 800;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;

const attempts = new Map<string, number[]>();

export function resetWaitlistRateLimit(): void {
  attempts.clear();
}

export function getWaitlistStatus(): WaitlistStoreInfo {
  return describeWaitlistStore();
}

export async function submitWaitlist(
  payload: unknown,
  context: { ip: string; now?: number },
): Promise<{ status: number; body: Record<string, unknown> }> {
  const now = context.now ?? Date.now();

  if (!takeAttempt(context.ip || "unknown", now)) {
    return {
      status: 429,
      body: {
        ok: false,
        code: "rate_limited",
        message: "Demasiados intentos seguidos. Espera unos minutos y vuelve a probar.",
      },
    };
  }

  if (!isRecord(payload)) {
    return {
      status: 400,
      body: {
        ok: false,
        code: "invalid_body",
        message: "No pudimos leer el formulario. Vuelve a cargarlo e inténtalo otra vez.",
      },
    };
  }

  if (typeof payload.companyWebsite === "string" && payload.companyWebsite.trim() !== "") {
    return {
      status: 400,
      body: {
        ok: false,
        code: "rejected",
        message: "No pudimos confirmar el envío. Espera un momento y vuelve a intentarlo.",
      },
    };
  }

  const startedAt = payload.startedAt;
  if (
    typeof startedAt !== "number" ||
    !Number.isFinite(startedAt) ||
    now - startedAt < MIN_FILL_MS ||
    now - startedAt > MAX_FILL_MS
  ) {
    return {
      status: 400,
      body: {
        ok: false,
        code: "rejected",
        message: "No pudimos confirmar el envío. Espera un momento y vuelve a intentarlo.",
      },
    };
  }

  const fields: WaitlistFields = {
    name: asString(payload.name),
    email: asString(payload.email),
    specialty: asString(payload.specialty),
    city: asString(payload.city),
    phone: asString(payload.phone),
    consent: payload.consent === true,
  };

  const validated = validateWaitlist(fields);
  if (!validated.ok) {
    return {
      status: 400,
      body: {
        ok: false,
        code: "validation",
        message: "Revisá los campos marcados. No guardamos el registro.",
        fieldErrors: validated.fieldErrors,
      },
    };
  }

  const saved = await saveWaitlistEntry(validated.value);
  if (!saved.ok) {
    return {
      status: saved.code === "not_configured" ? 503 : 500,
      body: {
        ok: false,
        code: saved.code,
        message: saved.message,
      },
    };
  }

  if (saved.status === "duplicate") {
    return {
      status: 200,
      body: {
        ok: true,
        code: "duplicate",
        message:
          "Este correo ya está en la lista. No creamos otro registro ni enviamos un mensaje.",
      },
    };
  }

  return {
    status: 201,
    body: {
      ok: true,
      code: "created",
      message:
        "Listo, ya estás en la lista. Cuando abramos en Nicaragua te escribimos al correo que nos dejaste.",
    },
  };
}

function takeAttempt(ip: string, now: number): boolean {
  const recent = (attempts.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(ip, recent);
    return false;
  }
  recent.push(now);
  attempts.set(ip, recent);
  return true;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}
