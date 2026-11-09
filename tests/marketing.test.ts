import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { readMigration } from "../src/lib/migrations.ts";
import { resetPublicMetricLimit, submitPublicMetric } from "../src/lib/public-metrics.ts";
import { applySqliteAdditiveMigrations, saveWaitlistEntry, withdrawMarketingConsent } from "../src/lib/waitlist-store.ts";
import { resetWaitlistRateLimit, submitWaitlist } from "../src/lib/waitlist-request.ts";
import { WAITLIST_MARKETING_VERSION, type NormalizedWaitlist } from "../src/lib/waitlist-validation.ts";

test("la migración de marketing no autoriza filas viejas y es idempotente en el texto", () => {
  const sql = readMigration("002_dermica_waitlist_marketing.sql");
  assert.match(sql, /DEFAULT false/);
  assert.doesNotMatch(sql, /DROP TABLE/i);
  assert.doesNotMatch(sql, /UPDATE\s+dermica_waitlist/i);
  const metrics = readMigration("003_dermica_metrics.sql");
  assert.match(metrics, /CREATE TABLE IF NOT EXISTS dermica_metrics/);
  assert.doesNotMatch(metrics.slice(metrics.indexOf("CREATE TABLE")), /ip|user_agent|email|referrer/i);
});

test("sin columnas de marketing el alta sigue y el opt-in no se finge", async () => {
  const file = tempFile();
  const sqlite = { kind: "sqlite" as const, path: file };
  try {
    const plain = await saveWaitlistEntry(entry("sin-columnas@example.com"), sqlite);
    assert.equal(plain.ok && plain.status, "created");
    const opted = await saveWaitlistEntry(
      { ...entry("opta-antes@example.com"), marketingConsent: true },
      sqlite,
    );
    assert.equal(opted.ok, false);
    if (!opted.ok) assert.equal(opted.code, "marketing_pending");
    const database = new DatabaseSync(file);
    const count = database.prepare("SELECT count(*) AS n FROM waitlist").get() as { n: number };
    assert.equal(count.n, 1);
    database.close();
  } finally {
    fs.rmSync(file, { force: true });
  }
});

test("opt-in, default, duplicado y baja no se pisan entre sí", async () => {
  const file = tempFile();
  const sqlite = { kind: "sqlite" as const, path: file };
  const previous = process.env.WAITLIST_SQLITE_PATH;
  process.env.WAITLIST_SQLITE_PATH = file;
  try {
    const legacy = await saveWaitlistEntry(entry("legacy@example.com"), sqlite);
    assert.equal(legacy.ok && legacy.status, "created");
    await applySqliteAdditiveMigrations(file);

    const database = new DatabaseSync(file);
    const oldRow = database.prepare(
      "SELECT marketing_consent, marketing_consent_at FROM waitlist WHERE email = ?",
    ).get("legacy@example.com") as { marketing_consent: number; marketing_consent_at: string | null };
    assert.equal(oldRow.marketing_consent, 0);
    assert.equal(oldRow.marketing_consent_at, null);
    database.close();

    const kept = await saveWaitlistEntry(
      { ...entry("legacy@example.com"), marketingConsent: true },
      sqlite,
    );
    assert.deepEqual(kept, { ok: true, status: "duplicate" });

    resetWaitlistRateLimit();
    const created = await submitWaitlist(body("nueva@example.com", { marketingConsent: true }), {
      ip: "203.0.113.90",
      now: 100_000,
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.marketing, true);
    assert.match(String(created.body.withdrawPath), /^\/retirar-marketing\?token=/);

    const duplicate = await submitWaitlist(body("nueva@example.com", { marketingConsent: false }), {
      ip: "203.0.113.91",
      now: 110_000,
    });
    assert.equal(duplicate.status, 200);
    assert.equal(duplicate.body.code, "duplicate");
    assert.equal("withdrawPath" in duplicate.body, false);

    const check = new DatabaseSync(file);
    const row = check.prepare(
      "SELECT marketing_consent, marketing_consent_version FROM waitlist WHERE email = ?",
    ).get("nueva@example.com") as { marketing_consent: number; marketing_consent_version: string };
    assert.equal(row.marketing_consent, 1);
    assert.equal(row.marketing_consent_version, WAITLIST_MARKETING_VERSION);
    const legacyStill = check.prepare(
      "SELECT marketing_consent FROM waitlist WHERE email = ?",
    ).get("legacy@example.com") as { marketing_consent: number };
    assert.equal(legacyStill.marketing_consent, 0);
    check.close();

    const token = new URL(`http://local${created.body.withdrawPath}`).searchParams.get("token") || "";
    const withdrawn = await withdrawMarketingConsent(token, sqlite);
    assert.deepEqual(withdrawn, { ok: true, status: "withdrawn" });
    const second = await withdrawMarketingConsent(token, sqlite);
    assert.deepEqual(second, { ok: true, status: "not_found" });
    const after = new DatabaseSync(file);
    const closed = after.prepare(
      "SELECT marketing_consent, consent_version FROM waitlist WHERE email = ?",
    ).get("nueva@example.com") as { marketing_consent: number; consent_version: string };
    assert.equal(closed.marketing_consent, 0);
    assert.equal(closed.consent_version, "apertura-nicaragua-v1");
    after.close();

    const invalid = await submitWaitlist(body("otra@example.com", { marketingConsent: "si" }), {
      ip: "203.0.113.92",
      now: 120_000,
    });
    assert.equal(invalid.status, 400);
    assert.equal(invalid.body.code, "validation");

    const omitted = await submitWaitlist(body("default@example.com"), {
      ip: "203.0.113.93",
      now: 130_000,
    });
    assert.equal(omitted.status, 201);
    assert.equal(omitted.body.marketing, false);
    assert.equal("withdrawPath" in omitted.body, false);
  } finally {
    if (previous === undefined) delete process.env.WAITLIST_SQLITE_PATH;
    else process.env.WAITLIST_SQLITE_PATH = previous;
    fs.rmSync(file, { force: true });
  }
});

test("la medición pública solo acepta eventos de la lista y no guarda datos personales", async () => {
  const file = tempFile();
  const previous = process.env.WAITLIST_SQLITE_PATH;
  process.env.WAITLIST_SQLITE_PATH = file;
  resetPublicMetricLimit();
  try {
    await applySqliteAdditiveMigrations(file);
    const ok = await submitPublicMetric({ event: "page_view", path: "/" }, { ip: "203.0.113.100", now: 1_000 });
    assert.equal(ok.status, 204);
    const forged = await submitPublicMetric(
      { event: "form_result", path: "/", email: "persona@example.com" },
      { ip: "203.0.113.101", now: 2_000 },
    );
    assert.equal(forged.status, 400);
    const query = await submitPublicMetric(
      { event: "page_view", path: "/?email=persona@example.com" },
      { ip: "203.0.113.102", now: 3_000 },
    );
    assert.equal(query.status, 400);
    const database = new DatabaseSync(file);
    const rows = database.prepare("SELECT event_name, path, count FROM dermica_metrics").all() as Array<{
      event_name: string;
      path: string;
      count: number;
    }>;
    assert.equal(rows.length, 1);
    assert.equal(rows[0]?.event_name, "page_view");
    assert.equal(rows[0]?.path, "/");
    assert.equal(rows[0]?.count, 1);
    const columns = database.prepare("PRAGMA table_info(dermica_metrics)").all() as Array<{ name: string }>;
    assert.equal(columns.some((column) => /ip|email|agent|referrer/i.test(column.name)), false);
    database.close();
  } finally {
    if (previous === undefined) delete process.env.WAITLIST_SQLITE_PATH;
    else process.env.WAITLIST_SQLITE_PATH = previous;
    fs.rmSync(file, { force: true });
  }
});

function entry(email: string): NormalizedWaitlist {
  return {
    name: "Ana Solís",
    email,
    specialty: null,
    city: null,
    phone: null,
    consent: true,
    marketingConsent: false,
  };
}

function body(email: string, overrides: Record<string, unknown> = {}) {
  return {
    name: "Ana Solís",
    email,
    specialty: "",
    city: "",
    phone: "",
    consent: true,
    companyWebsite: "",
    startedAt: 1_000,
    ...overrides,
  };
}

function tempFile(): string {
  return path.join(os.tmpdir(), `dermica-marketing-${process.pid}-${Date.now()}-${Math.random()}.sqlite`);
}
