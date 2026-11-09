import { getWaitlistStatus, submitWaitlist } from "@/lib/waitlist-request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  return Response.json(getWaitlistStatus(), { headers: noStore });
}

export async function POST(request: Request) {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  if (origin && !sameHost(origin, host)) {
    return Response.json(
      {
        ok: false,
        code: "rejected",
        message: "No pudimos aceptar el envío desde ese origen.",
      },
      { status: 403, headers: noStore },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      {
        ok: false,
        code: "invalid_json",
        message: "No pudimos leer el formulario. Vuelve a cargarlo e inténtalo otra vez.",
      },
      { status: 400, headers: noStore },
    );
  }

  const ip = clientIp(request);
  const result = await submitWaitlist(payload, { ip });
  return Response.json(result.body, { status: result.status, headers: noStore });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function sameHost(origin: string, host: string | null): boolean {
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
