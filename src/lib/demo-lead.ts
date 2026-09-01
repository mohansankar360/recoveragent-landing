import {
  buildDemoBookingUrl,
  demoLanguageLabel,
  normalizeWhatsAppNumber,
  type DemoFormData,
} from "./demo-booking";

export interface DemoLeadPayload {
  source: "recover-agent-landing";
  name: string;
  phone: string;
  storeUrl: string;
  monthlyOrders: string;
  preferredLanguage: string;
  preferredLanguageValue: string;
  calBookingUrl: string;
  submittedAt: string;
}

export function buildDemoLeadPayload(data: DemoFormData): DemoLeadPayload {
  return {
    source: "recover-agent-landing",
    name: data.name.trim(),
    phone: normalizeWhatsAppNumber(data.whatsapp),
    storeUrl: data.storeUrl.trim(),
    monthlyOrders: data.monthlyOrders.trim(),
    preferredLanguage: demoLanguageLabel(data.preferredLanguage),
    preferredLanguageValue: data.preferredLanguage,
    calBookingUrl: buildDemoBookingUrl(data),
    submittedAt: new Date().toISOString(),
  };
}

export function isValidDemoFormData(data: unknown): data is DemoFormData {
  if (!data || typeof data !== "object") return false;
  const form = data as DemoFormData;
  const whatsapp = form.whatsapp?.replace(/\D/g, "") ?? "";
  return (
    typeof form.name === "string" &&
    form.name.trim().length > 0 &&
    typeof form.whatsapp === "string" &&
    /^[6-9]\d{9}$/.test(whatsapp) &&
    typeof form.storeUrl === "string" &&
    form.storeUrl.trim().length > 0 &&
    typeof form.monthlyOrders === "string" &&
    form.monthlyOrders.trim().length > 0 &&
    typeof form.preferredLanguage === "string" &&
    form.preferredLanguage.trim().length > 0
  );
}
