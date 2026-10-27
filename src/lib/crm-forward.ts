import { isDashboardLeadEndpoint, readDashboardLeadReceipt } from "./demo-crm";

export type CrmForwardResult =
  | { ok: true; receipt: { id: string; duplicate: boolean } | null }
  | { ok: false; status: number; error: string };

/**
 * Server-only: posts one lead to CRM_WEBHOOK_URL. The RecoverAgent dashboard
 * gets the company-scoped command body; any other webhook gets the raw payload.
 */
export async function forwardLeadToCrm(
  tag: string,
  buildDashboardBody: (companyId: string) => unknown,
  genericBody: unknown
): Promise<CrmForwardResult> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error(`[${tag}] CRM_WEBHOOK_URL is not configured`);
    return { ok: false, status: 503, error: "Lead capture is not configured yet" };
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.CRM_WEBHOOK_SECRET?.trim();
  const dashboardSync = isDashboardLeadEndpoint(webhookUrl);
  const companyId = process.env.CRM_COMPANY_ID?.trim();
  if (dashboardSync && (!companyId || !secret)) {
    console.error(`[${tag}] Dashboard sync requires CRM_COMPANY_ID and CRM_WEBHOOK_SECRET`);
    return { ok: false, status: 503, error: "Lead capture is not configured yet" };
  }
  if (secret) {
    if (dashboardSync) {
      headers["x-api-key"] = secret;
      const gatewayKey = process.env.CRM_GATEWAY_KEY?.trim();
      if (gatewayKey) headers.Authorization = `Bearer ${gatewayKey}`;
    } else headers.Authorization = `Bearer ${secret}`;
  }

  try {
    const crmResponse = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(dashboardSync ? buildDashboardBody(companyId!) : genericBody),
      signal: AbortSignal.timeout(10_000),
    });
    if (!crmResponse.ok) {
      console.error(`[${tag}] CRM webhook failed`, crmResponse.status);
      return { ok: false, status: 502, error: "Could not save to CRM" };
    }
    if (!dashboardSync) return { ok: true, receipt: null };
    const receipt = readDashboardLeadReceipt(await crmResponse.json().catch(() => null));
    if (!receipt) {
      console.error(`[${tag}] Dashboard did not confirm lead creation`);
      return { ok: false, status: 502, error: "Could not save your details. Please try again." };
    }
    return { ok: true, receipt };
  } catch (error) {
    console.error(`[${tag}] CRM webhook error`, error);
    return { ok: false, status: 502, error: "Could not reach CRM" };
  }
}
