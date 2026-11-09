import fs from "node:fs";
import path from "node:path";
import { resolveWaitlistBackend, type WaitlistBackend } from "./waitlist-backend";
import { saveWaitlistToPostgres, WAITLIST_CONSENT_VERSION, WAITLIST_STORE_ERROR } from "./waitlist-postgres";
import { WAITLIST_NAME_WHEN_OMITTED, type NormalizedWaitlist } from "./waitlist-validation";

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
  | { ok: true; status: "created" | "duplicate" }
  | { ok: false; code: "not_configured" | "store_error"; message: string };

type SqliteDatabase = {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...params: Array<string | number | null>): { changes: number };
  };
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

async function saveSqlite(entry: NormalizedWaitlist, sqlitePath: string): Promise<WaitlistSaveResult> {
  let database: SqliteDatabase | undefined;
  try {
    fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
    const { DatabaseSync } = await import("node:sqlite");
    database = new DatabaseSync(sqlitePath);
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
      new Date().toISOString(),
    );
    return { ok: true, status: "created" };
  } catch (error) {
    if (error instanceof Error && /UNIQUE/i.test(error.message)) {
      return { ok: true, status: "duplicate" };
    }
    return { ok: false, code: "store_error", message: WAITLIST_STORE_ERROR };
  } finally {
    database?.close();
  }
}
