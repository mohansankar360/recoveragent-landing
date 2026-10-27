import type { LeadEngagement } from "./visitor-engagement";

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
  engagement?: LeadEngagement;
}

export interface WebsitePartialLead {
  source: string;
  name: string;
  phone: string;
  submittedAt: string;
  engagement?: LeadEngagement;
}

// The dashboard keys partial-vs-complete handling off these exact strings.
export const FORM_STATUS_PARTIAL = "Partial - step 1 of 2";
export const FORM_STATUS_COMPLETED = "Completed";

function formatActiveTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}

function engagementContact(engagement?: LeadEngagement) {
  if (!engagement) return {};
  return {
    scroll_depth: `${engagement.scrollDepthPercent}%`,
    active_time: formatActiveTime(engagement.activeTimeSeconds),
    visitor_type: engagement.visitCount > 1 ? `Returning (visit ${engagement.visitCount})` : "New visitor",
    pages_viewed: String(engagement.pagesViewed),
    landing_page: engagement.landingPage,
    ...(engagement.referrer ? { referrer: engagement.referrer } : {}),
    visitor_id: engagement.visitorId,
    ...(engagement.clarityUserId ? { clarity_user_id: engagement.clarityUserId } : {}),
  };
}

export function buildDashboardLeadRequest(payload: WebsiteDemoLead, companyId: string) {
  const engagement = payload.engagement;
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
        form_status: FORM_STATUS_COMPLETED,
        ...engagementContact(engagement),
      },
      attribution: {
        form: "book-demo",
        website: payload.source,
        ...(engagement?.utmSource ? { utm_source: engagement.utmSource } : {}),
        ...(engagement?.utmMedium ? { utm_medium: engagement.utmMedium } : {}),
        ...(engagement?.utmCampaign ? { utm_campaign: engagement.utmCampaign } : {}),
        ...(engagement?.claritySessionId ? { clarity_session_id: engagement.claritySessionId } : {}),
      },
      // Retained in original_payload by the dashboard's transactional create command.
      landing_form: payload,
    },
  };
}

/**
 * Step 1 of the demo form: name + WhatsApp only. The dashboard creates the lead
 * now (deduped by phone), and the step-2 "book-demo" submit later fills the same row.
 */
export function buildDashboardPartialLeadRequest(payload: WebsitePartialLead, companyId: string) {
  const engagement = payload.engagement;
  return {
    company_id: companyId,
    action: "create",
    lead: {
      full_name: payload.name,
      phone: payload.phone,
      source: "Website",
      received_at: payload.submittedAt,
      contact: {
        whatsapp: payload.phone,
        form_status: FORM_STATUS_PARTIAL,
        ...engagementContact(engagement),
      },
      attribution: {
        form: "book-demo-partial",
        website: payload.source,
        ...(engagement?.utmSource ? { utm_source: engagement.utmSource } : {}),
        ...(engagement?.utmMedium ? { utm_medium: engagement.utmMedium } : {}),
        ...(engagement?.utmCampaign ? { utm_campaign: engagement.utmCampaign } : {}),
        ...(engagement?.claritySessionId ? { clarity_session_id: engagement.claritySessionId } : {}),
      },
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
