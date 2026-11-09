-- Dérmica: conteos diarios, sin datos personales.
--
-- PENDIENTE. La aplicación no crea esta tabla sola. No aplicarla a producción.
-- En la base de la rama preview, después de 001:
--
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/003_dermica_metrics.sql
--
-- Semántica. Cada fila es un conteo del día en UTC, no de personas distintas.
-- Recargar la página suma otra visita. No se puede informar usuarios únicos.
-- No se guarda correo, teléfono, IP, user agent, referrer ni query string.
--
-- event_name
--   page_view     carga de una ruta conocida; lo avisa el navegador, una vez por carga
--   cta_click     clic en «Avisame cuando abran»
--   form_start    primera interacción con el formulario en esa carga
--   form_attempt  envío que llegó a validarse; lo anota solo el servidor
--   form_result   resultado de ese envío; lo anota solo el servidor
-- result_code, solo en form_result:
--   created, duplicate, validation, unavailable, error, marketing_pending
-- path va vacío en los eventos del formulario: el servidor no distingue
-- si el envío salió de inicio o de contacto.
--
-- Consulta:
--   SELECT event_day, event_name, path, result_code, count
--   FROM dermica_metrics
--   ORDER BY event_day, event_name, path, result_code;

CREATE TABLE IF NOT EXISTS dermica_metrics (
  event_name text NOT NULL,
  event_day date NOT NULL,
  path text NOT NULL DEFAULT '',
  result_code text NOT NULL DEFAULT '',
  count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (event_name, event_day, path, result_code),
  CONSTRAINT dermica_metrics_event_name CHECK (
    event_name IN ('page_view', 'cta_click', 'form_start', 'form_attempt', 'form_result')
  ),
  CONSTRAINT dermica_metrics_count_nonnegative CHECK (count >= 0),
  CONSTRAINT dermica_metrics_path_length CHECK (char_length(path) <= 80),
  CONSTRAINT dermica_metrics_result_length CHECK (char_length(result_code) <= 40)
);
