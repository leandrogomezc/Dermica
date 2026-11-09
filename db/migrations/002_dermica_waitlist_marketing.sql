-- Dérmica: consentimiento opcional de marketing, solo por correo.
--
-- PENDIENTE. La aplicación no ejecuta este archivo. No aplicarlo a producción.
-- Aplicarlo en la base de la rama preview, después de 001, con la URL de esa rama
-- y sin pegar la URL en el repositorio:
--
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/002_dermica_waitlist_marketing.sql
--
-- Idempotente. Las filas que ya existen quedan con marketing_consent = false,
-- sin fecha y sin versión. Eso no es una autorización. El alta pública usa
-- ON CONFLICT (email) DO NOTHING, así que un reenvío no concede ni retira
-- este consentimiento.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'dermica_waitlist'
      AND column_name = 'marketing_consent'
  ) THEN
    ALTER TABLE dermica_waitlist
      ADD COLUMN marketing_consent boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'dermica_waitlist'
      AND column_name = 'marketing_consent_at'
  ) THEN
    ALTER TABLE dermica_waitlist ADD COLUMN marketing_consent_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'dermica_waitlist'
      AND column_name = 'marketing_consent_version'
  ) THEN
    ALTER TABLE dermica_waitlist ADD COLUMN marketing_consent_version text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'dermica_waitlist'
      AND column_name = 'marketing_withdraw_token_hash'
  ) THEN
    ALTER TABLE dermica_waitlist ADD COLUMN marketing_withdraw_token_hash text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'dermica_waitlist'
      AND column_name = 'marketing_withdrawn_at'
  ) THEN
    ALTER TABLE dermica_waitlist ADD COLUMN marketing_withdrawn_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'dermica_waitlist_marketing_pair'
  ) THEN
    ALTER TABLE dermica_waitlist
      ADD CONSTRAINT dermica_waitlist_marketing_pair
      CHECK (
        (
          marketing_consent = false
          AND marketing_consent_at IS NULL
          AND marketing_consent_version IS NULL
          AND marketing_withdraw_token_hash IS NULL
        )
        OR
        (
          marketing_consent = true
          AND marketing_consent_at IS NOT NULL
          AND marketing_consent_version IS NOT NULL
          AND char_length(marketing_consent_version) BETWEEN 1 AND 80
          AND marketing_withdraw_token_hash IS NOT NULL
          AND marketing_withdrawn_at IS NULL
        )
      );
  END IF;
END $$;
