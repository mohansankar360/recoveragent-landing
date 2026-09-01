import { buildDemoLeadPayload, isValidDemoFormData } from "@/lib/demo-lead";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidDemoFormData(body)) {
    return Response.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const payload = buildDemoLeadPayload(body);
  const webhookUrl = process.env.CRM_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("[demo-lead] CRM_WEBHOOK_URL is not configured");
    return Response.json(
      { ok: false, error: "Lead capture is not configured yet" },
      { status: 503 }
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const secret = process.env.CRM_WEBHOOK_SECRET;
  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
  }

  try {
    const crmResponse = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!crmResponse.ok) {
      const detail = await crmResponse.text().catch(() => "");
      console.error("[demo-lead] CRM webhook failed", crmResponse.status, detail);
      return Response.json(
        { ok: false, error: "Could not save to CRM" },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("[demo-lead] CRM webhook error", error);
    return Response.json(
      { ok: false, error: "Could not reach CRM" },
      { status: 502 }
    );
  }

  return Response.json({
    ok: true,
    calBookingUrl: payload.calBookingUrl,
  });
}
