export type WaitlistBackend =
  | { kind: "postgres"; connectionString: string }
  | { kind: "sqlite"; path: string }
  | { kind: "unavailable" };

export type WaitlistEnv = {
  databaseUrl?: string | null;
  sqlitePath?: string | null;
  vercel?: string | null;
  vercelEnv?: string | null;
};

const POSTGRES_URL = /^postgres(?:ql)?:\/\//i;

export function resolveWaitlistBackend(overrides?: WaitlistEnv): WaitlistBackend {
  const databaseUrl = setting(overrides?.databaseUrl, "DATABASE_URL");
  const sqlitePath = setting(overrides?.sqlitePath, "WAITLIST_SQLITE_PATH");
  const vercel = setting(overrides?.vercel, "VERCEL");
  const vercelEnv = setting(overrides?.vercelEnv, "VERCEL_ENV");
  const hosted = vercel === "1" || Boolean(vercelEnv);

  if (databaseUrl) {
    if (!POSTGRES_URL.test(databaseUrl)) return { kind: "unavailable" };
    return { kind: "postgres", connectionString: databaseUrl };
  }

  if (hosted) return { kind: "unavailable" };
  if (sqlitePath && !sqlitePath.includes("://")) return { kind: "sqlite", path: sqlitePath };
  return { kind: "unavailable" };
}

function setting(override: string | null | undefined, key: string): string | undefined {
  const value = override === undefined ? process.env[key] : override ?? undefined;
  const trimmed = value?.trim();
  return trimmed || undefined;
}
