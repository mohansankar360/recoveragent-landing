/** Server-only adapter for RecoverAgent's company-scoped Lead Followup API. */
export interface WebsiteDemoLead {
  source: string;
  name: string;
  phone: string;
  email: string;
  storeUrl: string;
  storePlatform: string;
  storePlatformValue: string;
  monthlyOrders: string;
  monthlyOrdersValue: string;
  preferredLanguage: string;
  preferredLanguageValue: string;
  qualifiesForCalendar: boolean;
  calBookingUrl: string;
  submittedAt: string;
}

export function buildDashboardLeadRequest(payload: WebsiteDemoLead, companyId: string) {
  return {
    company_id: companyId,
    action: "create",
    lead: {
      full_name: payload.name,
      phone: payload.phone,
      email: payload.email,
      source: "Website",
      received_at: payload.submittedAt,
      contact: {
        whatsapp: payload.phone,
        store_url: payload.storeUrl,
        store_platform: payload.storePlatform,
        monthly_orders: payload.monthlyOrders,
        preferred_language: payload.preferredLanguage,
        product: payload.qualifiesForCalendar ? "Product demo" : "WhatsApp API onboarding",
        calendar_eligible: payload.qualifiesForCalendar ? "Yes" : "No",
        booking_url: payload.calBookingUrl,
      },
      attribution: { form: "book-demo", website: payload.source },
      // Retained in original_payload by the dashboard's transactional create command.
      landing_form: payload,
    },
  };
}

export function isDashboardLeadEndpoint(value: string): boolean {
  try {
    return new URL(value).pathname.replace(/\/$/, "") === "/functions/v1/lead-followup-api";
  } catch {
    return false;
  }
}

/** A 207 response can contain a failed row; HTTP success alone is insufficient. */
export function readDashboardLeadReceipt(value: unknown): { id: string; duplicate: boolean } | null {
  if (!value || typeof value !== "object" || !("results" in value)) return null;
  const results = (value as { results?: unknown }).results;
  if (!Array.isArray(results) || results.length !== 1) return null;
  const result = results[0];
  if (!result || typeof result !== "object" || result.error || typeof result.id !== "string" || !result.id.trim()) return null;
  return { id: result.id, duplicate: result.duplicate === true };
}
