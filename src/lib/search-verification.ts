type VerificationEnv = {
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  NEXT_PUBLIC_BING_SITE_VERIFICATION?: string;
};

export type SearchEngineVerification = {
  google?: string;
  other?: { "msvalidate.01": string };
};

function token(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function searchEngineVerification(
  env: VerificationEnv = {
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    NEXT_PUBLIC_BING_SITE_VERIFICATION: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
  },
): SearchEngineVerification | undefined {
  const google = token(env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION);
  const bing = token(env.NEXT_PUBLIC_BING_SITE_VERIFICATION);
  if (!google && !bing) return undefined;
  return {
    ...(google ? { google } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}
