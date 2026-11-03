import { buildDemoLeadPayload, isValidDemoFormData, parseLeadEngagement } from "@/lib/demo-lead";
import { readMetaBrowserIds, sendMetaServerEvent } from "@/lib/meta-conversions-api";
import { buildDashboardLeadRequest } from "@/lib/demo-crm";
import { forwardLeadToCrm } from "@/lib/crm-forward";

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

  const payload = buildDemoLeadPayload(
    body,
    parseLeadEngagement((body as { engagement?: unknown }).engagement)
  );
  const forwarded = await forwardLeadToCrm(
    "demo-lead",
    (companyId) => buildDashboardLeadRequest(payload, companyId),
    payload
  );
  if (!forwarded.ok) {
    return Response.json({ ok: false, error: forwarded.error }, { status: forwarded.status });
  }
  const leadReceipt = forwarded.receipt;

  // Only stores that qualify for the calendar count as a Lead, so ads optimised
  // for Lead don't learn to find stores that do not qualify for a demo.
  await sendMetaServerEvent({
    eventName: payload.qualifiesForCalendar ? "Lead" : "LowVolumeLead",
    eventId: metaEventId ?? crypto.randomUUID(),
    eventSourceUrl: request.headers.get("referer") ?? undefined,
    clientIpAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      undefined,
    clientUserAgent: request.headers.get("user-agent") ?? undefined,
    phone: payload.phone,
    email: payload.email,
    firstName: payload.name.split(/\s+/)[0],
    ...readMetaBrowserIds(request, body),
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
