import { buildDemoLeadPayload, isValidDemoFormData } from "@/lib/demo-lead";
import { sendMetaServerEvent } from "@/lib/meta-conversions-api";
import { buildDashboardLeadRequest, isDashboardLeadEndpoint, readDashboardLeadReceipt } from "@/lib/demo-crm";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const metaEventId = getMetaEventId(body);

  if (!isValidDemoFormData(body)) {
    return Response.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  // Unsupported-platform leads are intentionally not forwarded to the CRM.
  // Keep this server-side guard even though the UI blocks these submissions.
  if (body.storePlatform === "other") {
    return Response.json({ ok: true, skipped: true });
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

  const secret = process.env.CRM_WEBHOOK_SECRET?.trim();
  const dashboardSync = isDashboardLeadEndpoint(webhookUrl);
  const companyId = process.env.CRM_COMPANY_ID?.trim();
  if (dashboardSync && (!companyId || !secret)) {
    console.error("[demo-lead] Dashboard sync requires CRM_COMPANY_ID and CRM_WEBHOOK_SECRET");
    return Response.json({ ok: false, error: "Lead capture is not configured yet" }, { status: 503 });
  }
  const crmPayload = dashboardSync ? buildDashboardLeadRequest(payload, companyId!) : payload;
  if (secret) {
    if (dashboardSync) {
      headers["x-api-key"] = secret;
      const gatewayKey = process.env.CRM_GATEWAY_KEY?.trim();
      if (gatewayKey) headers.Authorization = `Bearer ${gatewayKey}`;
    } else headers.Authorization = `Bearer ${secret}`;
  }

  let leadReceipt: { id: string; duplicate: boolean } | null = null;
  try {
    const crmResponse = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(crmPayload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!crmResponse.ok) {

      console.error("[demo-lead] CRM webhook failed", crmResponse.status);
      return Response.json(
        { ok: false, error: "Could not save to CRM" },
        { status: 502 }
      );
    }
    if (dashboardSync) {
      leadReceipt = readDashboardLeadReceipt(await crmResponse.json().catch(() => null));
      if (!leadReceipt) {
        console.error("[demo-lead] Dashboard did not confirm lead creation");
        return Response.json({ ok: false, error: "Could not save your details. Please try again." }, { status: 502 });
      }
    }
  } catch (error) {
    console.error("[demo-lead] CRM webhook error", error);
    return Response.json(
      { ok: false, error: "Could not reach CRM" },
      { status: 502 }
    );
  }

  await sendMetaServerEvent({
    eventName: "Lead",
    eventId: metaEventId ?? crypto.randomUUID(),
    eventSourceUrl: request.headers.get("referer") ?? undefined,
    clientIpAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      undefined,
    clientUserAgent: request.headers.get("user-agent") ?? undefined,
    phone: payload.phone,
    email: payload.email,
    firstName: payload.name.split(/\s+/)[0],
    customData: {
      content_name: "demo_booking",
      monthly_orders: payload.monthlyOrders,
      store_platform: payload.storePlatform,
      qualifies_for_calendar: payload.qualifiesForCalendar ? 1 : 0,
    },
  });

  return Response.json({
    ok: true,
    calBookingUrl: payload.calBookingUrl,
    ...(leadReceipt ? { leadId: leadReceipt.id, duplicate: leadReceipt.duplicate } : {}),
  });
}

function getMetaEventId(body: unknown): string | undefined {
  if (!body || typeof body !== "object" || !("metaEventId" in body)) {
    return undefined;
  }

  const metaEventId = (body as { metaEventId?: unknown }).metaEventId;
  return typeof metaEventId === "string" && metaEventId.trim().length > 0
    ? metaEventId.trim()
    : undefined;
}
