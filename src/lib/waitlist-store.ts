import fs from "node:fs";
import path from "node:path";
import { categories } from "./data";
import { resolveWaitlistBackend, type WaitlistBackend } from "./waitlist-backend";
import {
  hashWithdrawToken,
  newWithdrawToken,
  saveWaitlistToPostgres,
  WAITLIST_CONSENT_VERSION,
  WAITLIST_MARKETING_PENDING,
  WAITLIST_STORE_ERROR,
  withdrawMarketingInPostgres,
  writePostgresMetric,
} from "./waitlist-postgres";
import {
  WAITLIST_MARKETING_VERSION,
  WAITLIST_NAME_WHEN_OMITTED,
  type NormalizedWaitlist,
} from "./waitlist-validation";

export const WAITLIST_PUBLIC_UNAVAILABLE =
  "No pudimos anotarte. Esta página todavía no tiene dónde guardar la lista, así que tu correo no quedó registrado. Cuando la lista esté activa, el mismo formulario lo va a decir antes de que envíes.";

const SQLITE_NOTE =
  "En este entorno el registro se guarda en un archivo SQLite del servidor. No se guarda en tu navegador y no genera un correo ni un WhatsApp automático.";

const POSTGRES_NOTE =
  "El registro se guarda en la base de datos de este sitio. No se guarda en tu navegador y no genera un correo ni un WhatsApp automático.";

const UNAVAILABLE_NOTE =
  "Esta página todavía no puede guardar la lista. Si enviás el formulario, tu correo no queda registrado.";

export type WaitlistStoreInfo = {
  configured: boolean;
  storageNote: string;
};

export type WaitlistSaveResult =
  | { ok: true; status: "created"; marketingRecorded: boolean; withdrawToken: string | null }
  | { ok: true; status: "duplicate" }
  | { ok: false; code: "not_configured" | "store_error" | "marketing_pending"; message: string };

export type MetricEvent = "page_view" | "cta_click" | "form_start" | "form_attempt" | "form_result";

type SqliteStatement = {
  run(...params: Array<string | number | null>): { changes: number };
  get(...params: Array<string | number | null>): unknown;
  all(...params: Array<string | number | null>): unknown[];
};

type SqliteDatabase = {
  exec(sql: string): void;
  prepare(sql: string): SqliteStatement;
  close(): void;
};

export function describeWaitlistStore(backend: WaitlistBackend = resolveWaitlistBackend()): WaitlistStoreInfo {
  if (backend.kind === "postgres") return { configured: true, storageNote: POSTGRES_NOTE };
  if (backend.kind === "sqlite") return { configured: true, storageNote: SQLITE_NOTE };
  return { configured: false, storageNote: UNAVAILABLE_NOTE };
}

export async function saveWaitlistEntry(
  entry: NormalizedWaitlist,
  backend?: WaitlistBackend | null,
): Promise<WaitlistSaveResult> {
  const resolved = backend === undefined ? resolveWaitlistBackend() : backend;
  if (resolved === null || resolved.kind === "unavailable") {
    return { ok: false, code: "not_configured", message: WAITLIST_PUBLIC_UNAVAILABLE };
  }
  if (resolved.kind === "sqlite") return saveSqlite(entry, resolved.path);
  return saveWaitlistToPostgres(entry, resolved.connectionString);
}

export async function withdrawMarketingConsent(
  token: string,
  backend?: WaitlistBackend | null,
): Promise<
  | { ok: true; status: "withdrawn" | "not_found" }
  | { ok: false; code: "not_configured" | "store_error" | "marketing_pending"; message: string }
> {
  const resolved = backend === undefined ? resolveWaitlistBackend() : backend;
  if (resolved === null || resolved.kind === "unavailable") {
    return { ok: false, code: "not_configured", message: WAITLIST_PUBLIC_UNAVAILABLE };
  }
  if (resolved.kind === "postgres") return withdrawMarketingInPostgres(token, resolved.connectionString);
  return withdrawSqlite(token, resolved.path);
}

const metricResultCodes = new Set([
  "created",
  "duplicate",
  "validation",
  "unavailable",
  "error",
  "marketing_pending",
]);

const metricPathAllowlist = new Set<string>([
  "/",
  "/catalogo",
  "/quienes-somos",
  "/apertura",
  "/contacto",
  "/privacidad",
  "/preguntas-frecuentes",
  "/retirar-marketing",
  ...categories.map((category) => `/catalogo/${category.slug}`),
]);

export async function recordMetric(
  eventName: MetricEvent,
  detail: { path?: string; result?: string } = {},
  backend?: WaitlistBackend | null,
): Promise<void> {
  const metricPath = detail.path ?? "";
  const resultCode = detail.result ?? "";
  if (metricPath !== "" && !metricPathAllowlist.has(metricPath)) return;
  if (eventName === "form_result" && !metricResultCodes.has(resultCode)) return;
  if (eventName !== "form_result" && resultCode !== "") return;
  try {
    const resolved = backend === undefined ? resolveWaitlistBackend() : backend;
    if (resolved === null || resolved.kind === "unavailable") return;
    if (resolved.kind === "postgres") {
      await writePostgresMetric(resolved.connectionString, eventName, metricPath, resultCode);
      return;
    }
    await writeSqliteMetric(resolved.path, eventName, metricPath, resultCode);
  } catch {
    // Un conteo que falla no puede tumbar el alta ni la página.
  }
}

export async function applySqliteAdditiveMigrations(sqlitePath: string): Promise<void> {
  const database = await openSqlite(sqlitePath);
  try {
    ensureSqliteBase(database);
    addSqliteColumn(database, "marketing_consent INTEGER NOT NULL DEFAULT 0");
    addSqliteColumn(database, "marketing_consent_at TEXT");
    addSqliteColumn(database, "marketing_consent_version TEXT");
    addSqliteColumn(database, "marketing_withdraw_token_hash TEXT");
    addSqliteColumn(database, "marketing_withdrawn_at TEXT");
    database.exec(`
      CREATE TABLE IF NOT EXISTS dermica_metrics (
        event_name TEXT NOT NULL,
        event_day TEXT NOT NULL,
        path TEXT NOT NULL DEFAULT '',
        result_code TEXT NOT NULL DEFAULT '',
        count INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (event_name, event_day, path, result_code)
      )
    `);
  } finally {
    database.close();
  }
}

async function saveSqlite(entry: NormalizedWaitlist, sqlitePath: string): Promise<WaitlistSaveResult> {
  let database: SqliteDatabase | undefined;
  try {
    database = await openSqlite(sqlitePath);
    ensureSqliteBase(database);
    const ready = sqliteHasColumn(database, "marketing_withdrawn_at");
    if (entry.marketingConsent && !ready) {
      return { ok: false, code: "marketing_pending", message: WAITLIST_MARKETING_PENDING };
    }
    const token = entry.marketingConsent ? newWithdrawToken() : null;
    const now = new Date().toISOString();
    if (ready) {
      database.prepare(
        `INSERT INTO waitlist (
           email, name, specialty, city, phone, consent_version, created_at,
           marketing_consent, marketing_consent_at, marketing_consent_version,
           marketing_withdraw_token_hash
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        entry.email,
        entry.name ?? WAITLIST_NAME_WHEN_OMITTED,
        entry.specialty,
        entry.city,
        entry.phone,
        WAITLIST_CONSENT_VERSION,
        now,
        entry.marketingConsent ? 1 : 0,
        entry.marketingConsent ? now : null,
        entry.marketingConsent ? WAITLIST_MARKETING_VERSION : null,
        token?.hash ?? null,
      );
    } else {
      database.prepare(
        `INSERT INTO waitlist (email, name, specialty, city, phone, consent_version, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        entry.email,
        entry.name ?? WAITLIST_NAME_WHEN_OMITTED,
        entry.specialty,
        entry.city,
        entry.phone,
        WAITLIST_CONSENT_VERSION,
        now,
      );
    }
    return {
      ok: true,
      status: "created",
      marketingRecorded: entry.marketingConsent && ready,
      withdrawToken: token?.token ?? null,
    };
  } catch (error) {
    if (error instanceof Error && /UNIQUE/i.test(error.message)) {
      return { ok: true, status: "duplicate" };
    }
    return { ok: false, code: "store_error", message: WAITLIST_STORE_ERROR };
  } finally {
    database?.close();
  }
}

async function withdrawSqlite(
  token: string,
  sqlitePath: string,
): Promise<
  | { ok: true; status: "withdrawn" | "not_found" }
  | { ok: false; code: "store_error" | "marketing_pending"; message: string }
> {
  let database: SqliteDatabase | undefined;
  try {
    database = await openSqlite(sqlitePath);
    ensureSqliteBase(database);
    if (!sqliteHasColumn(database, "marketing_withdrawn_at")) {
      return { ok: false, code: "marketing_pending", message: WAITLIST_MARKETING_PENDING };
    }
    const updated = database.prepare(
      `UPDATE waitlist
         SET marketing_consent = 0,
             marketing_consent_at = NULL,
             marketing_consent_version = NULL,
             marketing_withdraw_token_hash = NULL,
             marketing_withdrawn_at = ?
       WHERE marketing_withdraw_token_hash = ?
         AND marketing_consent = 1`,
    ).run(new Date().toISOString(), hashWithdrawToken(token));
    return { ok: true, status: updated.changes === 1 ? "withdrawn" : "not_found" };
  } catch {
    return { ok: false, code: "store_error", message: WAITLIST_STORE_ERROR };
  } finally {
    database?.close();
  }
}

async function writeSqliteMetric(sqlitePath: string, eventName: string, metricPath: string, resultCode: string): Promise<void> {
  const database = await openSqlite(sqlitePath);
  try {
    const tables = database.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'dermica_metrics'",
    ).get() as { name?: string } | undefined;
    if (!tables?.name) return;
    const day = new Date().toISOString().slice(0, 10);
    database.prepare(
      `INSERT INTO dermica_metrics (event_name, event_day, path, result_code, count)
       VALUES (?, ?, ?, ?, 1)
       ON CONFLICT (event_name, event_day, path, result_code)
       DO UPDATE SET count = count + 1`,
    ).run(eventName, day, metricPath, resultCode);
  } finally {
    database.close();
  }
}

async function openSqlite(sqlitePath: string): Promise<SqliteDatabase> {
  fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
  const { DatabaseSync } = await import("node:sqlite");
  return new DatabaseSync(sqlitePath);
}

function ensureSqliteBase(database: SqliteDatabase): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS waitlist (
      email TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      specialty TEXT,
      city TEXT,
      phone TEXT,
      consent_version TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
}

function sqliteHasColumn(database: SqliteDatabase, column: string): boolean {
  const rows = database.prepare("PRAGMA table_info(waitlist)").all() as Array<{ name: string }>;
  return rows.some((row) => row.name === column);
}

function addSqliteColumn(database: SqliteDatabase, definition: string): void {
  try {
    database.exec(`ALTER TABLE waitlist ADD COLUMN ${definition}`);
  } catch (error) {
    if (error instanceof Error && /duplicate column/i.test(error.message)) return;
    throw error;
  }
}
