import { buildDemoLeadPayload, isValidDemoFormData, parseLeadEngagement } from "@/lib/demo-lead";
import { buildDashboardTimeRequest } from "@/lib/demo-crm";
import { forwardLeadToCrm } from "@/lib/crm-forward";

/**
 * The visitor couldn't use any offered slot and typed a time that suits them.
 * Saved to the same CRM lead (matched by phone) as a task for the team to confirm on WhatsApp.
 */
export async function POST(request: Request) {
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }
  let body: { details?: unknown; requestedTime?: unknown; engagement?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const requestedTime = typeof body.requestedTime === "string" ? body.requestedTime.trim() : "";
  if (!isValidDemoFormData(body.details) || requestedTime.length < 2 || requestedTime.length > 200) {
    return Response.json({ ok: false, error: "Please tell us a day and time that suits you." }, { status: 400 });
  }

  const payload = buildDemoLeadPayload(body.details, parseLeadEngagement(body.engagement));
  const forwarded = await forwardLeadToCrm(
    "demo-time-request",
    (companyId) => buildDashboardTimeRequest(payload, requestedTime, companyId),
    { ...payload, requestedTime, formStatus: "time-request" }
  );
  if (!forwarded.ok) {
    return Response.json({ ok: false, error: forwarded.error }, { status: forwarded.status });
  }
  return Response.json({ ok: true });
}
