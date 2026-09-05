import { CAL_BOOKING_FIELDS, CAL_EVENT_LINK, DEMO_URL } from "./constants";

export { CAL_EVENT_LINK };

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

/** Prefill values for the embedded Cal.com booker (same fields as the external link). */
export function buildDemoEmbedConfig(
  data: DemoFormData
): Record<string, string> {
  const name = data.name.trim();
  const phone = normalizeWhatsAppNumber(data.whatsapp);
  const storeUrl = data.storeUrl.trim();
  const monthlyOrders = data.monthlyOrders.trim();
  const preferredLanguage = demoLanguageLabel(data.preferredLanguage);

  return {
    name,
    attendeePhoneNumber: phone,
    [CAL_BOOKING_FIELDS.websiteUrl]: storeUrl,
    [CAL_BOOKING_FIELDS.preferredLanguage]: preferredLanguage,
    notes: `Monthly orders: ${monthlyOrders}`,
    "metadata[storeUrl]": storeUrl,
    "metadata[monthlyOrders]": monthlyOrders,
    "metadata[preferredLanguage]": preferredLanguage,
  };
}
