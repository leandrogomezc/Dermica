-- Dérmica: lista de espera de apertura.
-- Idempotent: running this file again does not drop or rewrite existing rows.
-- PostgreSQL 14 or newer.
--
-- Server-only env: DATABASE_URL=postgres://... or postgresql://...
-- For Neon, the URL should include sslmode=require.
-- Do not use a NEXT_PUBLIC_ name. Do not put the URL in client code.
-- WAITLIST_SQLITE_PATH is local/test only and is ignored when VERCEL or VERCEL_ENV is set.
--
-- Columns match the public form: name, email, optional specialty, city and phone,
-- plus the opening-notice consent, its version, and the insert time.
-- email is stored trimmed and lowercased. One row per email.

CREATE TABLE IF NOT EXISTS dermica_waitlist (
  email text PRIMARY KEY,
  name text NOT NULL,
  specialty text,
  city text,
  phone text,
  consent boolean NOT NULL,
  consent_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT dermica_waitlist_email_normalized
    CHECK (
      email = lower(trim(email))
      AND char_length(email) BETWEEN 5 AND 120
    ),
  CONSTRAINT dermica_waitlist_name_length
    CHECK (char_length(name) BETWEEN 2 AND 80),
  CONSTRAINT dermica_waitlist_specialty_length
    CHECK (specialty IS NULL OR char_length(specialty) BETWEEN 1 AND 80),
  CONSTRAINT dermica_waitlist_city_length
    CHECK (city IS NULL OR char_length(city) BETWEEN 1 AND 80),
  CONSTRAINT dermica_waitlist_phone_length
    CHECK (phone IS NULL OR char_length(phone) BETWEEN 1 AND 20),
  CONSTRAINT dermica_waitlist_consent_accepted
    CHECK (consent),
  CONSTRAINT dermica_waitlist_consent_version_present
    CHECK (char_length(consent_version) BETWEEN 1 AND 80)
);
