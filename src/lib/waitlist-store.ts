import fs from "node:fs";
import path from "node:path";
import type { NormalizedWaitlist } from "./waitlist-validation";

export const WAITLIST_SETUP_MESSAGE =
  "Falta configurar un almacén durable. Define la variable de entorno WAITLIST_SQLITE_PATH con la ruta absoluta de un archivo SQLite en un disco que sí persista. No uses /tmp en un hosting de disco efímero: el registro se perdería. Este repositorio no tiene Postgres, Neon, Supabase, Blob ni variables en el proyecto de Vercel, y esta tarea no crea ninguno. Sin esa variable el formulario responde error y no guarda los datos, tampoco en el navegador.";

const CONSENT_VERSION = "apertura-nicaragua-v1";

export type WaitlistStoreInfo = {
  configured: boolean;
  storageNote: string;
  setup: string | null;
};

export type WaitlistSaveResult =
  | { ok: true; status: "created" | "duplicate" }
  | {
      ok: false;
      code: "not_configured" | "store_error";
      message: string;
      setup: string;
    };

type SqliteDatabase = {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...params: Array<string | number | null>): { changes: number };
  };
  close(): void;
};

export function readSqlitePathFromEnv(): string | undefined {
  const value = process.env["WAITLIST_SQLITE_PATH"];
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function describeWaitlistStore(sqlitePath = readSqlitePathFromEnv()): WaitlistStoreInfo {
  if (!sqlitePath) {
    return {
      configured: false,
      storageNote:
        "En este entorno todavía no hay almacén. Si envías el formulario, no guardaremos los datos.",
      setup: WAITLIST_SETUP_MESSAGE,
    };
  }

  if (sqlitePath.includes("://")) {
    return {
      configured: false,
      storageNote:
        "La variable de almacén no apunta a un archivo. No guardaremos el formulario.",
      setup:
        "WAITLIST_SQLITE_PATH debe ser una ruta de archivo SQLite, no una URL. Este proyecto no incluye un cliente de base de datos.",
    };
  }

  return {
    configured: true,
    storageNote:
      "En este entorno el registro se guarda en un archivo SQLite del servidor. No se guarda en tu navegador y no genera un correo ni un WhatsApp automático.",
    setup: null,
  };
}

export async function saveWaitlistEntry(
  entry: NormalizedWaitlist,
  sqlitePath?: string | null,
): Promise<WaitlistSaveResult> {
  const resolved =
    sqlitePath === undefined ? readSqlitePathFromEnv() : sqlitePath?.trim() || undefined;
  const info = describeWaitlistStore(resolved);
  if (!info.configured || !resolved) {
    return {
      ok: false,
      code: "not_configured",
      message:
        "No guardamos tu registro. La lista de espera no tiene un almacén configurado, así que no quedó anotado en ningún sitio.",
      setup: info.setup ?? WAITLIST_SETUP_MESSAGE,
    };
  }

  let database: SqliteDatabase | undefined;
  try {
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    const { DatabaseSync } = await import("node:sqlite");
    database = new DatabaseSync(resolved);
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
      entry.name,
      entry.specialty,
      entry.city,
      entry.phone,
      CONSENT_VERSION,
      new Date().toISOString(),
    );
    return { ok: true, status: "created" };
  } catch (error) {
    if (isUniqueConstraint(error)) {
      return { ok: true, status: "duplicate" };
    }
    return {
      ok: false,
      code: "store_error",
      message:
        "No guardamos tu registro. El almacén configurado no pudo escribir el dato y no lo conservamos en el navegador.",
      setup:
        "Revisa que WAITLIST_SQLITE_PATH sea un archivo escribible en un disco persistente. No se muestra la ruta ni el detalle interno.",
    };
  } finally {
    database?.close();
  }
}

function isUniqueConstraint(error: unknown): boolean {
  return error instanceof Error && /UNIQUE/i.test(error.message);
}
