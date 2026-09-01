import { CAL_BOOKING_FIELDS, DEMO_URL } from "./constants";

export interface DemoFormData {
  name: string;
  whatsapp: string;
  storeUrl: string;
  monthlyOrders: string;
  preferredLanguage: string;
}

export const DEMO_LANGUAGE_OPTIONS = [
  { value: "english-or-hindi", label: "English or Hindi" },
  { value: "hindi-only", label: "Hindi only" },
  { value: "tamil", label: "Tamil" },
] as const;

export function demoLanguageLabel(value: string): string {
  return DEMO_LANGUAGE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function normalizeWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "").slice(0, 10);
  return `+91${digits}`;
}

/** Build Cal.com link with booking fields prefilled from the demo form. */
export function buildDemoBookingUrl(data: DemoFormData): string {
  const params = new URLSearchParams();
  const name = data.name.trim();
  const phone = normalizeWhatsAppNumber(data.whatsapp);
  const storeUrl = data.storeUrl.trim();
  const monthlyOrders = data.monthlyOrders.trim();
  const preferredLanguage = demoLanguageLabel(data.preferredLanguage);

  params.set("name", name);
  params.set("attendeePhoneNumber", phone);
  params.set(CAL_BOOKING_FIELDS.websiteUrl, storeUrl);
  params.set(CAL_BOOKING_FIELDS.preferredLanguage, preferredLanguage);
  params.set(
    "notes",
    `Monthly orders: ${monthlyOrders}`
  );
  params.set("metadata[storeUrl]", storeUrl);
  params.set("metadata[monthlyOrders]", monthlyOrders);
  params.set("metadata[preferredLanguage]", preferredLanguage);

  return `${DEMO_URL}?${params.toString()}`;
}
