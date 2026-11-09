import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "pg";
import { dermicaWaitlistMigrationSql, closeWaitlistPools, WAITLIST_STORE_ERROR } from "../src/lib/waitlist-postgres.ts";
import { saveWaitlistEntry } from "../src/lib/waitlist-store.ts";
import { WAITLIST_NAME_WHEN_OMITTED, type NormalizedWaitlist } from "../src/lib/waitlist-validation.ts";

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
    assert.deepEqual(created, { ok: true, status: "created" });
    const again = await saveWaitlistEntry(entry(solo), backend);
    assert.deepEqual(again, { ok: true, status: "duplicate" });
    const withoutName = await saveWaitlistEntry({ ...entry(omitted), name: null }, backend);
    assert.deepEqual(withoutName, { ok: true, status: "created" });

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

function entry(email: string): NormalizedWaitlist {
  return {
    name: "Ana Solís",
    email,
    specialty: "Dermatología",
    city: "León",
    phone: "+505 8888 0000",
    consent: true,
  };
}
