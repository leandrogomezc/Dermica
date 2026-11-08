import { readFileSync } from "node:fs";
import path from "node:path";
import { Pool, type QueryResult } from "pg";
import type { NormalizedWaitlist } from "./waitlist-validation";

export const WAITLIST_CONSENT_VERSION = "apertura-nicaragua-v1";

export const WAITLIST_STORE_ERROR =
  "No guardamos tu registro. La base no pudo escribir el dato y no lo conservamos en el navegador.";

const MIGRATION_PATH = path.join(process.cwd(), "db/migrations/001_dermica_waitlist.sql");

const pools = new Map<string, Pool>();
const schemaReady = new Set<string>();
const schemaLocks = new Map<string, Promise<void>>();

export function dermicaWaitlistMigrationSql(): string {
  return readFileSync(MIGRATION_PATH, "utf8");
}

export async function saveWaitlistToPostgres(
  entry: NormalizedWaitlist,
  connectionString: string,
): Promise<
  | { ok: true; status: "created" | "duplicate" }
  | { ok: false; code: "store_error"; message: string }
> {
  const pool = poolFor(connectionString);
  try {
    await ensureSchema(pool, connectionString);
    const inserted: QueryResult = await pool.query(
      `INSERT INTO dermica_waitlist
         (email, name, specialty, city, phone, consent, consent_version)
       VALUES ($1, $2, $3, $4, $5, TRUE, $6)
       ON CONFLICT (email) DO NOTHING`,
      [entry.email, entry.name, entry.specialty, entry.city, entry.phone, WAITLIST_CONSENT_VERSION],
    );
    if (inserted.rowCount === 1) return { ok: true, status: "created" };
    if (inserted.rowCount === 0) return { ok: true, status: "duplicate" };
    return { ok: false, code: "store_error", message: WAITLIST_STORE_ERROR };
  } catch (error) {
    if (postgresCode(error) === "23505" && postgresConstraint(error) === "dermica_waitlist_pkey") {
      return { ok: true, status: "duplicate" };
    }
    schemaReady.delete(connectionString);
    return { ok: false, code: "store_error", message: WAITLIST_STORE_ERROR };
  }
}

async function ensureSchema(pool: Pool, connectionString: string): Promise<void> {
  if (schemaReady.has(connectionString)) return;
  const existing = schemaLocks.get(connectionString);
  if (existing) {
    await existing;
    return;
  }
  const pending = pool
    .query(dermicaWaitlistMigrationSql())
    .then(() => {
      schemaReady.add(connectionString);
    })
    .finally(() => {
      schemaLocks.delete(connectionString);
    });
  schemaLocks.set(connectionString, pending);
  await pending;
}

export async function closeWaitlistPools(): Promise<void> {
  const open = [...pools.values()];
  pools.clear();
  schemaReady.clear();
  schemaLocks.clear();
  await Promise.all(open.map((pool) => pool.end()));
}

function poolFor(connectionString: string): Pool {
  const existing = pools.get(connectionString);
  if (existing) return existing;
  const pool = new Pool({
    connectionString,
    max: 5,
    connectionTimeoutMillis: 8000,
    statement_timeout: 8000,
    ssl: sslFor(connectionString),
  });
  pool.on("error", () => {
    // Idle client failures must not crash the process or print the connection string.
  });
  pools.set(connectionString, pool);
  return pool;
}

function sslFor(connectionString: string): false | { rejectUnauthorized: false } {
  try {
    const host = new URL(connectionString).hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "::1") return false;
  } catch {
    return { rejectUnauthorized: false };
  }
  return { rejectUnauthorized: false };
}

function postgresCode(error: unknown): string | undefined {
  return postgresField(error, "code");
}

function postgresConstraint(error: unknown): string | undefined {
  return postgresField(error, "constraint");
}

function postgresField(error: unknown, field: "code" | "constraint"): string | undefined {
  if (typeof error === "object" && error !== null && field in error) {
    const value = (error as Record<string, unknown>)[field];
    return typeof value === "string" ? value : undefined;
  }
  return undefined;
}
