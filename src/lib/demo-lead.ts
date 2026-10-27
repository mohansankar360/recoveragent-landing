import {
  buildDemoBookingUrl,
  demoLanguageLabel,
  isValidMonthlyOrders,
  isValidStorePlatform,
  isValidStoreUrl,
  monthlyOrdersLabel,
  normalizeWhatsAppNumber,
  storePlatformLabel,
  type DemoFormData,
} from "./demo-booking";
import type { LeadEngagement } from "./visitor-engagement";

export interface DemoLeadPayload {
  source: "recover-agent-landing";
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

export function buildDemoLeadPayload(
  data: DemoFormData,
  engagement?: LeadEngagement
): DemoLeadPayload {
  return {
    source: "recover-agent-landing",
    name: data.name.trim(),
    phone: normalizeWhatsAppNumber(data.whatsapp),
    email: data.email.trim(),
    storeUrl: data.storeUrl.trim(),
    storePlatform: storePlatformLabel(data.storePlatform),
    storePlatformValue: data.storePlatform,
    monthlyOrders: monthlyOrdersLabel(data.monthlyOrders),
    monthlyOrdersValue: data.monthlyOrders,
    preferredLanguage: demoLanguageLabel(data.preferredLanguage),
    preferredLanguageValue: data.preferredLanguage,
    qualifiesForCalendar:
      data.monthlyOrders !== "0-500" &&
      (data.storePlatform === "shopify" || data.storePlatform === "woocommerce"),
    calBookingUrl: buildDemoBookingUrl(data),
    submittedAt: new Date().toISOString(),
    ...(engagement ? { engagement } : {}),
  };
}

export interface PartialLeadPayload {
  source: "recover-agent-landing";
  name: string;
  phone: string;
  submittedAt: string;
  engagement?: LeadEngagement;
}

/** Step 1 of the demo form: only name and WhatsApp are known yet. */
export function isValidPartialLead(data: unknown): data is Pick<DemoFormData, "name" | "whatsapp"> {
  if (!data || typeof data !== "object") return false;
  const form = data as DemoFormData;
  return (
    typeof form.name === "string" &&
    form.name.trim().length > 0 &&
    typeof form.whatsapp === "string" &&
    /^[6-9]\d{9}$/.test(form.whatsapp.replace(/\D/g, ""))
  );
}

export function buildPartialLeadPayload(
  data: Pick<DemoFormData, "name" | "whatsapp">,
  engagement?: LeadEngagement
): PartialLeadPayload {
  return {
    source: "recover-agent-landing",
    name: data.name.trim().slice(0, 120),
    phone: normalizeWhatsAppNumber(data.whatsapp),
    submittedAt: new Date().toISOString(),
    ...(engagement ? { engagement } : {}),
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidDemoFormData(data: unknown): data is DemoFormData {
  if (!data || typeof data !== "object") return false;
  const form = data as DemoFormData;
  const whatsapp = form.whatsapp?.replace(/\D/g, "") ?? "";
  return (
    typeof form.name === "string" &&
    form.name.trim().length > 0 &&
    typeof form.whatsapp === "string" &&
    /^[6-9]\d{9}$/.test(whatsapp) &&
    typeof form.email === "string" &&
    EMAIL_PATTERN.test(form.email.trim()) &&
    typeof form.storeUrl === "string" &&
    isValidStoreUrl(form.storeUrl) &&
    typeof form.storePlatform === "string" &&
    isValidStorePlatform(form.storePlatform) &&
    typeof form.monthlyOrders === "string" &&
    isValidMonthlyOrders(form.monthlyOrders) &&
    typeof form.preferredLanguage === "string" &&
    form.preferredLanguage.trim().length > 0
  );
}

function cleanText(value: unknown, max = 300): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.trim().slice(0, max);
  return text || undefined;
}

function cleanNumber(value: unknown, max: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(max, Math.max(0, Math.round(value)))
    : 0;
}

/** Engagement comes from the browser, so only keep known, bounded fields. */
export function parseLeadEngagement(value: unknown): LeadEngagement | undefined {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  const visitorId = cleanText(raw.visitorId, 64);
  if (!visitorId) return undefined;
  return {
    visitorId,
    visitCount: cleanNumber(raw.visitCount, 10_000),
    firstSeenAt: cleanText(raw.firstSeenAt, 40) ?? "",
    clarityUserId: cleanText(raw.clarityUserId, 64),
    claritySessionId: cleanText(raw.claritySessionId, 64),
    landingPage: cleanText(raw.landingPage) ?? "",
    referrer: cleanText(raw.referrer),
    utmSource: cleanText(raw.utmSource, 100),
    utmMedium: cleanText(raw.utmMedium, 100),
    utmCampaign: cleanText(raw.utmCampaign, 150),
    pagePath: cleanText(raw.pagePath) ?? "",
    scrollDepthPercent: cleanNumber(raw.scrollDepthPercent, 100),
    activeTimeSeconds: cleanNumber(raw.activeTimeSeconds, 86_400),
    pagesViewed: cleanNumber(raw.pagesViewed, 1_000),
  };
}
