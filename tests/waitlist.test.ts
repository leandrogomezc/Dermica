import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { saveWaitlistEntry } from "../src/lib/waitlist-store.ts";
import { resetWaitlistRateLimit, submitWaitlist } from "../src/lib/waitlist-request.ts";
import { validateWaitlist } from "../src/lib/waitlist-validation.ts";
import type { NormalizedWaitlist } from "../src/lib/waitlist-validation.ts";

const validFields = {
  name: "Ana Solís",
  email: "ana.solis@example.com",
  specialty: "Dermatología",
  city: "León",
  phone: "+505 8888 0000",
  consent: true,
};

function entry(email = "ana.solis@example.com"): NormalizedWaitlist {
  return {
    name: "Ana Solís",
    email,
    specialty: "Dermatología",
    city: "León",
    phone: "+505 8888 0000",
    consent: true,
  };
}

test("valida nombre y correo obligatorios, y deja vacíos los opcionales", () => {
  const missing = validateWaitlist({
    name: " ",
    email: "no-es-correo",
    specialty: "",
    city: "",
    phone: "",
    consent: false,
  });
  assert.equal(missing.ok, false);
  if (!missing.ok) {
    assert.ok(missing.fieldErrors.name);
    assert.ok(missing.fieldErrors.email);
    assert.ok(missing.fieldErrors.consent);
    assert.equal(missing.fieldErrors.phone, undefined);
  }

  const accepted = validateWaitlist({ ...validFields, specialty: "", city: "", phone: "" });
  assert.equal(accepted.ok, true);
  if (accepted.ok) {
    assert.equal(accepted.value.email, "ana.solis@example.com");
    assert.equal(accepted.value.specialty, null);
    assert.equal(accepted.value.phone, null);
  }
});

test("rechaza un teléfono incompleto y acepta uno con código de país", () => {
  const bad = validateWaitlist({ ...validFields, phone: "123" });
  assert.equal(bad.ok, false);
  const good = validateWaitlist(validFields);
  assert.equal(good.ok, true);
});

test("sin ruta de almacén no guarda y lo dice", async () => {
  const saved = await saveWaitlistEntry(entry(), null);
  assert.equal(saved.ok, false);
  if (!saved.ok) {
    assert.equal(saved.code, "not_configured");
    assert.match(saved.setup, /WAITLIST_SQLITE_PATH/);
    assert.doesNotMatch(saved.message, /localStorage/i);
  }
});

test("con SQLite local persiste y no duplica el correo", async () => {
  const file = path.join(os.tmpdir(), `dermica-waitlist-${process.pid}-${Date.now()}.sqlite`);
  try {
    const created = await saveWaitlistEntry(entry("primera@example.com"), file);
    assert.deepEqual(created, { ok: true, status: "created" });
    const duplicate = await saveWaitlistEntry(entry("primera@example.com"), file);
    assert.deepEqual(duplicate, { ok: true, status: "duplicate" });

    const database = new DatabaseSync(file);
    const row = database
      .prepare("SELECT email, name, specialty, city, phone, consent_version FROM waitlist WHERE email = ?")
      .get("primera@example.com") as Record<string, unknown>;
    database.close();
    assert.equal(row.email, "primera@example.com");
    assert.equal(row.name, "Ana Solís");
    assert.equal(row.specialty, "Dermatología");
    assert.equal(row.city, "León");
    assert.equal(row.phone, "+505 8888 0000");
    assert.equal(row.consent_version, "apertura-nicaragua-v1");
  } finally {
    fs.rmSync(file, { force: true });
  }
});

test("el envío sin almacén responde 503 y no afirma éxito", async () => {
  resetWaitlistRateLimit();
  const previous = process.env.WAITLIST_SQLITE_PATH;
  delete process.env.WAITLIST_SQLITE_PATH;
  try {
    const result = await submitWaitlist(body(), { ip: "203.0.113.10", now: 10_000 });
    assert.equal(result.status, 503);
    assert.equal(result.body.ok, false);
    assert.equal(result.body.code, "not_configured");
    assert.match(String(result.body.setup), /WAITLIST_SQLITE_PATH/);
  } finally {
    if (previous === undefined) delete process.env.WAITLIST_SQLITE_PATH;
    else process.env.WAITLIST_SQLITE_PATH = previous;
  }
});

test("el envío configurado crea, evita el duplicado y rechaza prisa o casilla vacía", async () => {
  resetWaitlistRateLimit();
  const file = path.join(os.tmpdir(), `dermica-waitlist-http-${process.pid}.sqlite`);
  const previous = process.env.WAITLIST_SQLITE_PATH;
  process.env.WAITLIST_SQLITE_PATH = file;
  try {
    const created = await submitWaitlist(body(), { ip: "203.0.113.20", now: 20_000 });
    assert.equal(created.status, 201);
    assert.equal(created.body.code, "created");

    const again = await submitWaitlist(body(), { ip: "203.0.113.21", now: 30_000 });
    assert.equal(again.status, 200);
    assert.equal(again.body.code, "duplicate");

    const fast = await submitWaitlist(body({ startedAt: 40_000 }), {
      ip: "203.0.113.22",
      now: 40_100,
    });
    assert.equal(fast.status, 400);
    assert.equal(fast.body.code, "rejected");

    const noConsent = await submitWaitlist(body({ consent: false }), {
      ip: "203.0.113.23",
      now: 50_000,
    });
    assert.equal(noConsent.status, 400);
    assert.equal(noConsent.body.code, "validation");
  } finally {
    if (previous === undefined) delete process.env.WAITLIST_SQLITE_PATH;
    else process.env.WAITLIST_SQLITE_PATH = previous;
    fs.rmSync(file, { force: true });
  }
});

test("limita intentos repetidos desde la misma dirección", async () => {
  resetWaitlistRateLimit();
  const ip = "203.0.113.40";
  for (let i = 0; i < 5; i += 1) {
    const result = await submitWaitlist(body({ companyWebsite: "spam" }), {
      ip,
      now: 60_000 + i,
    });
    assert.equal(result.status, 400);
  }
  const blocked = await submitWaitlist(body(), { ip, now: 70_000 });
  assert.equal(blocked.status, 429);
  assert.equal(blocked.body.code, "rate_limited");
});

function body(overrides: Record<string, unknown> = {}) {
  return {
    ...validFields,
    companyWebsite: "",
    startedAt: 1_000,
    ...overrides,
  };
}
