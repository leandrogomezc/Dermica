import { submitMarketingWithdrawal } from "@/lib/waitlist-request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { ok: false, code: "invalid_json", message: "No pudimos leer el pedido." },
      { status: 400, headers: noStore },
    );
  }
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim() || "unknown";
  const result = await submitMarketingWithdrawal(payload, { ip });
  return Response.json(result.body, { status: result.status, headers: noStore });
}
