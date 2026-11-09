import {
  describeWaitlistStore,
  recordMetric,
  saveWaitlistEntry,
  withdrawMarketingConsent,
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
        message: "Demasiados intentos seguidos. Esperá unos minutos y volvé a probar.",
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

  const marketingConsent = readMarketing(payload.marketingConsent);
  if (marketingConsent === "invalid") {
    await recordMetric("form_attempt");
    await recordMetric("form_result", { result: "validation" });
    return {
      status: 400,
      body: {
        ok: false,
        code: "validation",
        message: "La preferencia de marketing tiene que ser sí o no. No guardamos el registro.",
        fieldErrors: {
          marketingConsent: "Marcá la casilla o dejala vacía. No aceptamos otro valor.",
        },
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
    marketingConsent,
  };

  const validated = validateWaitlist(fields);
  if (!validated.ok) {
    await recordMetric("form_attempt");
    await recordMetric("form_result", { result: "validation" });
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

  await recordMetric("form_attempt");
  const saved = await saveWaitlistEntry(validated.value);
  if (!saved.ok) {
    await recordMetric("form_result", {
      result: saved.code === "not_configured" ? "unavailable" : saved.code === "marketing_pending" ? "marketing_pending" : "error",
    });
    return {
      status: saved.code === "not_configured" || saved.code === "marketing_pending" ? 503 : 500,
      body: {
        ok: false,
        code: saved.code,
        message: saved.message,
      },
    };
  }

  if (saved.status === "duplicate") {
    await recordMetric("form_result", { result: "duplicate" });
    return {
      status: 200,
      body: {
        ok: true,
        code: "duplicate",
        message:
          "Este correo ya está en la lista. No creamos otro registro, no enviamos un mensaje y no cambiamos la preferencia de marketing.",
      },
    };
  }

  await recordMetric("form_result", { result: "created" });
  const body: Record<string, unknown> = {
    ok: true,
    code: "created",
    marketing: saved.marketingRecorded,
    message: saved.marketingRecorded
      ? "Listo, ya estás en la lista. Cuando abramos en Nicaragua te escribimos al correo que nos dejaste. También anotamos que querés novedades por correo."
      : "Listo, ya estás en la lista. Cuando abramos en Nicaragua te escribimos al correo que nos dejaste.",
  };
  if (saved.withdrawToken) {
    body.withdrawPath = `/retirar-marketing?token=${encodeURIComponent(saved.withdrawToken)}`;
  }
  return { status: 201, body };
}

const withdrawAttempts = new Map<string, number[]>();

export function resetWithdrawRateLimit(): void {
  withdrawAttempts.clear();
}

export async function submitMarketingWithdrawal(
  payload: unknown,
  context: { ip: string; now?: number },
): Promise<{ status: number; body: Record<string, unknown> }> {
  const now = context.now ?? Date.now();
  const recent = (withdrawAttempts.get(context.ip || "unknown") ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) {
    withdrawAttempts.set(context.ip || "unknown", recent);
    return {
      status: 429,
      body: {
        ok: false,
        code: "rate_limited",
        message: "Demasiados intentos seguidos. Esperá unos minutos y volvé a probar.",
      },
    };
  }
  recent.push(now);
  withdrawAttempts.set(context.ip || "unknown", recent);

  const token = isRecord(payload) && typeof payload.token === "string" ? payload.token.trim() : "";
  if (token.length < 20 || token.length > 200) {
    return {
      status: 400,
      body: {
        ok: false,
        code: "not_found",
        message: "Ese enlace no sirve. No cambiamos ninguna preferencia.",
      },
    };
  }
  const result = await withdrawMarketingConsent(token);
  if (!result.ok) {
    return {
      status: result.code === "not_configured" || result.code === "marketing_pending" ? 503 : 500,
      body: { ok: false, code: result.code, message: result.message },
    };
  }
  if (result.status === "not_found") {
    return {
      status: 404,
      body: {
        ok: false,
        code: "not_found",
        message: "Ese enlace no sirve. No cambiamos ninguna preferencia.",
      },
    };
  }
  return {
    status: 200,
    body: {
      ok: true,
      code: "withdrawn",
      message: "Listo. Retiramos el consentimiento de novedades por correo. El aviso de apertura no cambia.",
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

function readMarketing(value: unknown): boolean | "invalid" {
  if (value === undefined || value === null || value === false) return false;
  if (value === true) return true;
  return "invalid";
}
