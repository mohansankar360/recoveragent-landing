import {
  buildDemoBookingUrl,
  demoLanguageLabel,
  isValidMonthlyOrders,
  isValidStorePlatform,
  monthlyOrdersLabel,
  normalizeWhatsAppNumber,
  storePlatformLabel,
  type DemoFormData,
} from "./demo-booking";

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
}

export function buildDemoLeadPayload(data: DemoFormData): DemoLeadPayload {
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
    form.storeUrl.trim().length > 0 &&
    typeof form.storePlatform === "string" &&
    isValidStorePlatform(form.storePlatform) &&
    typeof form.monthlyOrders === "string" &&
    isValidMonthlyOrders(form.monthlyOrders) &&
    typeof form.preferredLanguage === "string" &&
    form.preferredLanguage.trim().length > 0
  );
}
