import { buildPartialLeadPayload, isValidPartialLead, parseLeadEngagement } from "@/lib/demo-lead";
import { buildDashboardPartialLeadRequest } from "@/lib/demo-crm";
import { forwardLeadToCrm } from "@/lib/crm-forward";

/**
 * Step 1 of the demo form (name + WhatsApp). Saved before the visitor sees
 * step 2 so a drop-off can still be followed up. The full submit to
 * /api/demo-lead later updates the same CRM contact, matched by phone.
 * No Meta Lead event fires here; that stays on the completed form.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidPartialLead(body)) {
    return Response.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const payload = buildPartialLeadPayload(
    body,
    parseLeadEngagement((body as { engagement?: unknown }).engagement)
  );
  const forwarded = await forwardLeadToCrm(
    "demo-lead-partial",
    (companyId) => buildDashboardPartialLeadRequest(payload, companyId),
    { ...payload, formStatus: "partial" }
  );
  if (!forwarded.ok) {
    return Response.json({ ok: false, error: forwarded.error }, { status: forwarded.status });
  }

  return Response.json({
    ok: true,
    ...(forwarded.receipt ? { leadId: forwarded.receipt.id, duplicate: forwarded.receipt.duplicate } : {}),
  });
}
