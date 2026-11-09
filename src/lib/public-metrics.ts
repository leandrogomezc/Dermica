import { categories } from "./data";
import { recordMetric, type MetricEvent } from "./waitlist-store";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 40;

const clientEvents = new Set<MetricEvent>(["page_view", "cta_click", "form_start"]);

export const metricPaths = new Set<string>([
  "/",
  "/catalogo",
  "/quienes-somos",
  "/apertura",
  "/contacto",
  "/privacidad",
  "/retirar-marketing",
  ...categories.map((category) => `/catalogo/${category.slug}`),
]);

const attempts = new Map<string, number[]>();

export function resetPublicMetricLimit(): void {
  attempts.clear();
}

export async function submitPublicMetric(
  payload: unknown,
  context: { ip: string; now?: number },
): Promise<{ status: number }> {
  const now = context.now ?? Date.now();
  if (!takeAttempt(context.ip || "unknown", now)) return { status: 429 };
  if (!isRecord(payload)) return { status: 400 };
  const event = payload.event;
  const metricPath = payload.path;
  if (typeof event !== "string" || !clientEvents.has(event as MetricEvent)) return { status: 400 };
  if (typeof metricPath !== "string" || !metricPaths.has(metricPath)) return { status: 400 };
  if ("email" in payload || "phone" in payload || "ip" in payload) return { status: 400 };
  await recordMetric(event as MetricEvent, { path: metricPath });
  return { status: 204 };
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
