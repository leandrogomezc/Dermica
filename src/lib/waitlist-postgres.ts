import { createHash, randomBytes } from "node:crypto";
import { Pool, type QueryResult } from "pg";
import { readMigration } from "./migrations";
import {
  WAITLIST_MARKETING_VERSION,
  WAITLIST_NAME_WHEN_OMITTED,
  type NormalizedWaitlist,
} from "./waitlist-validation";

export const WAITLIST_CONSENT_VERSION = "apertura-nicaragua-v1";

export const WAITLIST_STORE_ERROR =
  "No guardamos tu registro. La base no pudo escribir el dato y no lo conservamos en el navegador.";

const pools = new Map<string, Pool>();
const schemaReady = new Set<string>();
const schemaLocks = new Map<string, Promise<void>>();
const marketingReady = new Set<string>();
const metricsReady = new Set<string>();

export const WAITLIST_MARKETING_PENDING =
  "No guardamos el registro. Todavía no podemos anotar la preferencia de marketing y no queremos guardar el alta sin esa respuesta. Podés enviarlo de nuevo sin marcar novedades.";

export function dermicaWaitlistMigrationSql(): string {
  return readMigration("001_dermica_waitlist.sql");
}

export type WaitlistWriteResult =
  | { ok: true; status: "created"; marketingRecorded: boolean; withdrawToken: string | null }
  | { ok: true; status: "duplicate" }
  | { ok: false; code: "store_error" | "marketing_pending"; message: string };

export async function saveWaitlistToPostgres(
  entry: NormalizedWaitlist,
  connectionString: string,
): Promise<WaitlistWriteResult> {
  const pool = poolFor(connectionString);
  try {
    await ensureSchema(pool, connectionString);
    const ready = await marketingColumnsReady(pool, connectionString);
    if (entry.marketingConsent && !ready) {
      return { ok: false, code: "marketing_pending", message: WAITLIST_MARKETING_PENDING };
    }
    const written = ready
      ? await insertWithMarketing(pool, entry)
      : {
          result: await pool.query(
            `INSERT INTO dermica_waitlist
               (email, name, specialty, city, phone, consent, consent_version)
             VALUES ($1, $2, $3, $4, $5, TRUE, $6)
             ON CONFLICT (email) DO NOTHING`,
            [
              entry.email,
              entry.name ?? WAITLIST_NAME_WHEN_OMITTED,
              entry.specialty,
              entry.city,
              entry.phone,
              WAITLIST_CONSENT_VERSION,
            ],
          ),
          withdrawToken: null as string | null,
        };
    const inserted = written.result;
    if (inserted.rowCount === 1) {
      return {
        ok: true,
        status: "created",
        marketingRecorded: entry.marketingConsent && ready,
        withdrawToken: written.withdrawToken,
      };
    }
    if (inserted.rowCount === 0) return { ok: true, status: "duplicate" };
    return { ok: false, code: "store_error", message: WAITLIST_STORE_ERROR };
  } catch (error) {
    if (postgresCode(error) === "23505" && postgresConstraint(error) === "dermica_waitlist_pkey") {
      return { ok: true, status: "duplicate" };
    }
    schemaReady.delete(connectionString);
    marketingReady.delete(connectionString);
    return { ok: false, code: "store_error", message: WAITLIST_STORE_ERROR };
  }
}

export async function withdrawMarketingInPostgres(
  token: string,
  connectionString: string,
): Promise<{ ok: true; status: "withdrawn" | "not_found" } | { ok: false; code: "store_error" | "marketing_pending"; message: string }> {
  const pool = poolFor(connectionString);
  try {
    await ensureSchema(pool, connectionString);
    if (!(await marketingColumnsReady(pool, connectionString))) {
      return { ok: false, code: "marketing_pending", message: WAITLIST_MARKETING_PENDING };
    }
    const updated = await pool.query(
      `UPDATE dermica_waitlist
         SET marketing_consent = false,
             marketing_consent_at = NULL,
             marketing_consent_version = NULL,
             marketing_withdraw_token_hash = NULL,
             marketing_withdrawn_at = now()
       WHERE marketing_withdraw_token_hash = $1
         AND marketing_consent = true`,
      [hashWithdrawToken(token)],
    );
    return { ok: true, status: (updated.rowCount ?? 0) === 1 ? "withdrawn" : "not_found" };
  } catch {
    return { ok: false, code: "store_error", message: WAITLIST_STORE_ERROR };
  }
}

export async function writePostgresMetric(
  connectionString: string,
  eventName: string,
  metricPath: string,
  resultCode: string,
): Promise<boolean> {
  const pool = poolFor(connectionString);
  if (!(await metricsTableReady(pool, connectionString))) return false;
  await pool.query(
    `INSERT INTO dermica_metrics (event_name, event_day, path, result_code, count)
     VALUES ($1, (now() AT TIME ZONE 'utc')::date, $2, $3, 1)
     ON CONFLICT (event_name, event_day, path, result_code)
     DO UPDATE SET count = dermica_metrics.count + 1`,
    [eventName, metricPath, resultCode],
  );
  return true;
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
  marketingReady.clear();
  metricsReady.clear();
  await Promise.all(open.map((pool) => pool.end()));
}

async function insertWithMarketing(
  pool: Pool,
  entry: NormalizedWaitlist,
): Promise<{ result: QueryResult; withdrawToken: string | null }> {
  const token = entry.marketingConsent ? newWithdrawToken() : null;
  const result = await pool.query(
    `INSERT INTO dermica_waitlist
       (email, name, specialty, city, phone, consent, consent_version,
        marketing_consent, marketing_consent_at, marketing_consent_version,
        marketing_withdraw_token_hash)
     VALUES (
       $1, $2, $3, $4, $5, TRUE, $6,
       $7,
       CASE WHEN $7 THEN now() ELSE NULL END,
       CASE WHEN $7 THEN $8 ELSE NULL END,
       CASE WHEN $7 THEN $9 ELSE NULL END
     )
     ON CONFLICT (email) DO NOTHING`,
    [
      entry.email,
      entry.name ?? WAITLIST_NAME_WHEN_OMITTED,
      entry.specialty,
      entry.city,
      entry.phone,
      WAITLIST_CONSENT_VERSION,
      entry.marketingConsent,
      WAITLIST_MARKETING_VERSION,
      token?.hash ?? null,
    ],
  );
  return { result, withdrawToken: result.rowCount === 1 ? (token?.token ?? null) : null };
}

async function marketingColumnsReady(pool: Pool, connectionString: string): Promise<boolean> {
  if (marketingReady.has(connectionString)) return true;
  const found = await pool.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'dermica_waitlist'
       AND column_name = 'marketing_withdrawn_at'`,
  );
  if ((found.rowCount ?? 0) > 0) {
    marketingReady.add(connectionString);
    return true;
  }
  return false;
}

async function metricsTableReady(pool: Pool, connectionString: string): Promise<boolean> {
  if (metricsReady.has(connectionString)) return true;
  const found = await pool.query(
    `SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'dermica_metrics'`,
  );
  if ((found.rowCount ?? 0) > 0) {
    metricsReady.add(connectionString);
    return true;
  }
  return false;
}

export function newWithdrawToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashWithdrawToken(token) };
}

export function hashWithdrawToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
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
