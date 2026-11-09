import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "pg";
import { readMigration } from "../src/lib/migrations.ts";
import { resetPublicMetricLimit, submitPublicMetric } from "../src/lib/public-metrics.ts";
import { dermicaWaitlistMigrationSql, closeWaitlistPools, WAITLIST_STORE_ERROR } from "../src/lib/waitlist-postgres.ts";
import { saveWaitlistEntry, withdrawMarketingConsent } from "../src/lib/waitlist-store.ts";
import { resetWaitlistRateLimit, submitWaitlist } from "../src/lib/waitlist-request.ts";
import { WAITLIST_MARKETING_VERSION, WAITLIST_NAME_WHEN_OMITTED, type NormalizedWaitlist } from "../src/lib/waitlist-validation.ts";

const databaseUrl = process.env.DERMICA_TEST_DATABASE_URL?.trim();

test("la migración declara la tabla dermica_waitlist y es idempotente en el texto", () => {
  const sql = dermicaWaitlistMigrationSql();
  assert.match(sql, /CREATE TABLE IF NOT EXISTS dermica_waitlist/);
  assert.match(sql, /email text PRIMARY KEY/i);
  assert.match(sql, /CONSTRAINT dermica_waitlist_consent_accepted/);
  assert.doesNotMatch(sql, /DROP TABLE/i);
  assert.equal(sql.includes("WAITLIST_SQLITE_PATH"), true);
});

test("un Postgres inalcanzable no confirma el alta ni devuelve la URL", async () => {
  const password = "not-a-real-secret";
  const saved = await saveWaitlistEntry(entry("caido@example.com"), {
    kind: "postgres",
    connectionString: `postgresql://dermica:${password}@127.0.0.1:1/dermica_waitlist_test`,
  });
  assert.equal(saved.ok, false);
  if (!saved.ok) {
    assert.equal(saved.code, "store_error");
    assert.equal(saved.message, WAITLIST_STORE_ERROR);
    assert.doesNotMatch(saved.message, new RegExp(password));
    assert.doesNotMatch(saved.message, /127\.0\.0\.1/);
  }
  await closeWaitlistPools();
});

test("Postgres local guarda, no duplica y absorbe altas simultáneas", { skip: databaseUrl ? false : "sin DERMICA_TEST_DATABASE_URL" }, async () => {
  if (!databaseUrl) return;
  const backend = { kind: "postgres" as const, connectionString: databaseUrl };
  const solo = `sola-${Date.now()}@example.com`;
  const race = `carrera-${Date.now()}@example.com`;
  const omitted = `omitido-${Date.now()}@example.com`;
  try {
    const created = await saveWaitlistEntry(entry(solo), backend);
    assert.equal(created.ok, true);
    if (created.ok) assert.equal(created.status, "created");
    const again = await saveWaitlistEntry(entry(solo), backend);
    assert.deepEqual(again, { ok: true, status: "duplicate" });
    const withoutName = await saveWaitlistEntry({ ...entry(omitted), name: null }, backend);
    assert.equal(withoutName.ok, true);
    if (withoutName.ok) assert.equal(withoutName.status, "created");

    const results = await Promise.all(
      Array.from({ length: 12 }, () => saveWaitlistEntry(entry(race), backend)),
    );
    assert.equal(results.filter((result) => result.ok && result.status === "created").length, 1);
    assert.equal(results.filter((result) => result.ok && result.status === "duplicate").length, 11);
    assert.equal(results.some((result) => !result.ok), false);

    const client = new Client({ connectionString: databaseUrl, ssl: false });
    await client.connect();
    try {
      const count = await client.query<{ n: string }>(
        "SELECT count(*)::text AS n FROM dermica_waitlist WHERE email = $1",
        [race],
      );
      assert.equal(count.rows[0]?.n, "1");
      const row = await client.query<{
        name: string;
        specialty: string;
        city: string;
        phone: string;
        consent: boolean;
        consent_version: string;
      }>(
        `SELECT name, specialty, city, phone, consent, consent_version
         FROM dermica_waitlist WHERE email = $1`,
        [solo],
      );
      assert.equal(row.rows[0]?.name, "Ana Solís");
      assert.equal(row.rows[0]?.specialty, "Dermatología");
      assert.equal(row.rows[0]?.city, "León");
      assert.equal(row.rows[0]?.phone, "+505 8888 0000");
      assert.equal(row.rows[0]?.consent, true);
      assert.equal(row.rows[0]?.consent_version, "apertura-nicaragua-v1");
      const omittedRow = await client.query<{ name: string }>(
        "SELECT name FROM dermica_waitlist WHERE email = $1",
        [omitted],
      );
      assert.equal(omittedRow.rows[0]?.name, WAITLIST_NAME_WHEN_OMITTED);
      const repeated = await client.query(dermicaWaitlistMigrationSql());
      assert.ok(repeated);
    } finally {
      await client.end();
    }
  } finally {
    const client = new Client({ connectionString: databaseUrl, ssl: false });
    await client.connect();
    try {
      await client.query("DELETE FROM dermica_waitlist WHERE email = ANY($1::text[])", [
        [solo, race, omitted],
      ]);
    } finally {
      await client.end();
    }
    await closeWaitlistPools();
  }
});

test("Postgres: esquema viejo, marketing, duplicado, baja y conteos", { skip: databaseUrl ? false : "sin DERMICA_TEST_DATABASE_URL" }, async () => {
  if (!databaseUrl) return;
  const backend = { kind: "postgres" as const, connectionString: databaseUrl };
  const legacy = `viejo-${Date.now()}@example.com`;
  const opted = `opta-${Date.now()}@example.com`;
  const plain = `plano-${Date.now()}@example.com`;
  const flow = `flujo-${Date.now()}@example.com`;
  const previousDatabase = process.env.DATABASE_URL;
  process.env.DATABASE_URL = databaseUrl;
  const client = new Client({ connectionString: databaseUrl, ssl: false });
  await client.connect();
  try {
    const column = await client.query(
      `SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'dermica_waitlist' AND column_name = 'marketing_withdrawn_at'`,
    );
    if ((column.rowCount ?? 0) === 0) {
      const blocked = await saveWaitlistEntry({ ...entry(opted), marketingConsent: true }, backend);
      assert.equal(blocked.ok, false);
      if (!blocked.ok) assert.equal(blocked.code, "marketing_pending");
      const absent = await client.query("SELECT 1 FROM dermica_waitlist WHERE email = $1", [opted]);
      assert.equal(absent.rowCount, 0);
    }

    const old = await saveWaitlistEntry(entry(legacy), backend);
    assert.equal(old.ok && old.status, "created");

    await client.query(readMigration("002_dermica_waitlist_marketing.sql"));
    const legacyRow = await client.query<{ marketing_consent: boolean; marketing_consent_at: Date | null }>(
      "SELECT marketing_consent, marketing_consent_at FROM dermica_waitlist WHERE email = $1",
      [legacy],
    );
    assert.equal(legacyRow.rows[0]?.marketing_consent, false);
    assert.equal(legacyRow.rows[0]?.marketing_consent_at, null);

    const flip = await saveWaitlistEntry({ ...entry(legacy), marketingConsent: true }, backend);
    assert.deepEqual(flip, { ok: true, status: "duplicate" });
    const still = await client.query<{ marketing_consent: boolean }>(
      "SELECT marketing_consent FROM dermica_waitlist WHERE email = $1",
      [legacy],
    );
    assert.equal(still.rows[0]?.marketing_consent, false);

    const created = await saveWaitlistEntry({ ...entry(opted), marketingConsent: true }, backend);
    assert.equal(created.ok && created.status, "created");
    assert.equal(created.ok && created.status === "created" && Boolean(created.withdrawToken), true);
    const token = created.ok && created.status === "created" ? created.withdrawToken : null;
    const optedRow = await client.query<{
      marketing_consent: boolean;
      marketing_consent_version: string;
      marketing_consent_at: Date | null;
      marketing_withdraw_token_hash: string | null;
    }>(
      `SELECT marketing_consent, marketing_consent_version, marketing_consent_at, marketing_withdraw_token_hash
       FROM dermica_waitlist WHERE email = $1`,
      [opted],
    );
    assert.equal(optedRow.rows[0]?.marketing_consent, true);
    assert.equal(optedRow.rows[0]?.marketing_consent_version, WAITLIST_MARKETING_VERSION);
    assert.ok(optedRow.rows[0]?.marketing_consent_at);
    assert.equal(optedRow.rows[0]?.marketing_withdraw_token_hash?.length, 64);

    const revoke = await saveWaitlistEntry(entry(opted), backend);
    assert.deepEqual(revoke, { ok: true, status: "duplicate" });
    const kept = await client.query<{ marketing_consent: boolean }>(
      "SELECT marketing_consent FROM dermica_waitlist WHERE email = $1",
      [opted],
    );
    assert.equal(kept.rows[0]?.marketing_consent, true);

    const withdrawn = await withdrawMarketingConsent(token || "", backend);
    assert.deepEqual(withdrawn, { ok: true, status: "withdrawn" });
    const after = await client.query<{
      marketing_consent: boolean;
      consent: boolean;
      marketing_withdraw_token_hash: string | null;
      marketing_withdrawn_at: Date | null;
    }>(
      `SELECT marketing_consent, consent, marketing_withdraw_token_hash, marketing_withdrawn_at
       FROM dermica_waitlist WHERE email = $1`,
      [opted],
    );
    assert.equal(after.rows[0]?.marketing_consent, false);
    assert.equal(after.rows[0]?.consent, true);
    assert.equal(after.rows[0]?.marketing_withdraw_token_hash, null);
    assert.ok(after.rows[0]?.marketing_withdrawn_at);
    const again = await withdrawMarketingConsent(token || "", backend);
    assert.deepEqual(again, { ok: true, status: "not_found" });

    const regrant = await saveWaitlistEntry({ ...entry(opted), marketingConsent: true }, backend);
    assert.deepEqual(regrant, { ok: true, status: "duplicate" });
    const noRegrant = await client.query<{ marketing_consent: boolean }>(
      "SELECT marketing_consent FROM dermica_waitlist WHERE email = $1",
      [opted],
    );
    assert.equal(noRegrant.rows[0]?.marketing_consent, false);

    const quiet = await saveWaitlistEntry(entry(plain), backend);
    assert.equal(quiet.ok && quiet.status, "created");
    if (quiet.ok && quiet.status === "created") assert.equal(quiet.withdrawToken, null);

    await client.query(readMigration("003_dermica_metrics.sql"));
    resetWaitlistRateLimit();
    resetPublicMetricLimit();
    const http = await submitWaitlist(
      {
        ...entry(flow),
        companyWebsite: "",
        startedAt: 1_000,
        marketingConsent: false,
      },
      { ip: "203.0.113.80", now: 90_000 },
    );
    assert.equal(http.status, 201);
    assert.equal("withdrawPath" in http.body, false);
    const counts = await client.query<{ event_name: string; result_code: string; count: string }>(
      `SELECT event_name, result_code, count::text AS count
       FROM dermica_metrics
       WHERE event_day = (now() AT TIME ZONE 'utc')::date
         AND event_name IN ('form_attempt', 'form_result')
         AND result_code IN ('', 'created')`,
    );
    assert.ok(counts.rows.some((row) => row.event_name === "form_attempt" && Number(row.count) >= 1));
    assert.ok(counts.rows.some((row) => row.result_code === "created" && Number(row.count) >= 1));

    const rejected = await submitPublicMetric(
      { event: "form_result", path: "/", result: "created", email: "persona@example.com" },
      { ip: "203.0.113.81", now: 91_000 },
    );
    assert.equal(rejected.status, 400);
  } finally {
    await client.query("DELETE FROM dermica_waitlist WHERE email = ANY($1::text[])", [
      [legacy, opted, plain, flow],
    ]);
    await client.end();
    await closeWaitlistPools();
    if (previousDatabase === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabase;
  }
});

function entry(email: string): NormalizedWaitlist {
  return {
    name: "Ana Solís",
    email,
    specialty: "Dermatología",
    city: "León",
    phone: "+505 8888 0000",
    consent: true,
    marketingConsent: false,
  };
}
