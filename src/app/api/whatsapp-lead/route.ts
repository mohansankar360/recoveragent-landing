import { buildWhatsAppLead, isValidWhatsAppLead } from "@/lib/whatsapp-lead";
import { buildDashboardLeadRequest, isDashboardLeadEndpoint, readDashboardLeadReceipt } from "@/lib/demo-crm";
import { sendMetaServerEvent } from "@/lib/meta-conversions-api";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ ok: false, error: "Invalid request origin" }, { status: 403 });
  }
  let body: unknown;
  try { body = await request.json(); }
  catch { return Response.json({ ok: false, error: "Invalid request" }, { status: 400 }); }
  if (!isValidWhatsAppLead(body)) {
    return Response.json({ ok: false, error: "Please check your name, mobile number, email and store URL." }, { status: 400 });
  }
  const webhook = process.env.CRM_WEBHOOK_URL;
  const secret = process.env.CRM_WEBHOOK_SECRET?.trim();
  const companyId = process.env.CRM_COMPANY_ID?.trim();
  const dashboard = webhook ? isDashboardLeadEndpoint(webhook) : false;
  if (!webhook || (dashboard && (!companyId || !secret))) {
    return Response.json({ ok: false, error: "Onboarding requests are temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
  const lead = buildWhatsAppLead(body);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (secret) {
    if (dashboard) {
      headers["x-api-key"] = secret;
      const gateway = process.env.CRM_GATEWAY_KEY?.trim();
      if (gateway) headers.Authorization = `Bearer ${gateway}`;
    } else headers.Authorization = `Bearer ${secret}`;
  }
  const payload = dashboard ? buildDashboardLeadRequest(lead, companyId!) : { ...lead, product: "WhatsApp", plan: "WhatsApp — ₹999/month" };
  if (dashboard && "lead" in payload) {
    payload.lead.contact.product = "WhatsApp — ₹999/month";
    payload.lead.attribution.form = "whatsapp-onboarding";
  }
  try {
    const response = await fetch(webhook, { method: "POST", headers, body: JSON.stringify(payload), signal: AbortSignal.timeout(10_000) });
    if (!response.ok || (dashboard && !readDashboardLeadReceipt(await response.json().catch(() => null)))) {
      return Response.json({ ok: false, error: "We couldn't save your request. Please try again." }, { status: 502 });
    }
  } catch {
    return Response.json({ ok: false, error: "We couldn't connect. Please try again shortly." }, { status: 502 });
  }
  const eventId = "metaEventId" in body && typeof body.metaEventId === "string" ? body.metaEventId.slice(0, 200) : crypto.randomUUID();
  // A tracking outage must not turn a saved lead into a failed submission.
  await sendMetaServerEvent({
    eventName: "Lead", eventId,
    eventSourceUrl: request.headers.get("referer") ?? undefined,
    clientIpAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    clientUserAgent: request.headers.get("user-agent") ?? undefined,
    phone: lead.phone, email: lead.email, firstName: lead.name.split(/\s+/)[0],
    customData: { content_name: "whatsapp_onboarding", value: 999, currency: "INR" },
  }).catch(() => undefined);
  return Response.json({ ok: true });
}
