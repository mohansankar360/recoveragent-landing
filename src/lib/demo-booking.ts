import { CAL_BOOKING_FIELDS, CAL_EVENT_LINK, DEMO_URL } from "./constants";

export { CAL_EVENT_LINK };

export interface DemoFormData {
  name: string;
  whatsapp: string;
  email: string;
  storeUrl: string;
  storePlatform: string;
  monthlyOrders: string;
  preferredLanguage: string;
}

export const DEMO_LANGUAGE_OPTIONS = [
  { value: "english-or-hindi", label: "English or Hindi" },
  { value: "hindi-only", label: "Hindi only" },
  { value: "tamil", label: "Tamil" },
] as const;

export const MONTHLY_ORDERS_OPTIONS = [
  { value: "0-500", label: "0 to 500" },
  { value: "500-2000", label: "500 to 2,000" },
  { value: "2000-5000", label: "2,000 to 5,000" },
  { value: "5000-10000", label: "5,000 to 10,000" },
  { value: "10000-plus", label: "10,000 +" },
] as const;

export const STORE_PLATFORM_OPTIONS = [
  { value: "shopify", label: "Shopify" },
  { value: "woocommerce", label: "Woocommerce" },
  { value: "other", label: "Other platform — currently not supported" },
] as const;

const MONTHLY_ORDERS_VALUE_SET = new Set(
  MONTHLY_ORDERS_OPTIONS.map((option) => option.value)
);

const STORE_PLATFORM_VALUE_SET = new Set(
  STORE_PLATFORM_OPTIONS.map((option) => option.value)
);

export function demoLanguageLabel(value: string): string {
  return DEMO_LANGUAGE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function monthlyOrdersLabel(value: string): string {
  return MONTHLY_ORDERS_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function storePlatformLabel(value: string): string {
  return STORE_PLATFORM_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function isValidMonthlyOrders(value: string): boolean {
  return MONTHLY_ORDERS_VALUE_SET.has(value as (typeof MONTHLY_ORDERS_OPTIONS)[number]["value"]);
}

export function isValidStorePlatform(value: string): boolean {
  return STORE_PLATFORM_VALUE_SET.has(value as (typeof STORE_PLATFORM_OPTIONS)[number]["value"]);
}

export function qualifiesForDemoCalendar(
  data: Pick<DemoFormData, "monthlyOrders" | "storePlatform">
): boolean {
  return (
    data.monthlyOrders !== "0-500" &&
    (data.storePlatform === "shopify" || data.storePlatform === "woocommerce")
  );
}

export function getDisqualificationMessage(
  data: Pick<DemoFormData, "monthlyOrders" | "storePlatform">
): string | null {
  const lowVolume = data.monthlyOrders === "0-500";
  const unsupportedPlatform = data.storePlatform === "other";

  if (lowVolume && unsupportedPlatform) {
    return "Live demos are for Shopify and WooCommerce stores doing 500+ orders per month. We can still help with our WhatsApp API service — our team will call you soon to see how we can help you reduce your RTO.";
  }

  if (lowVolume) {
    return "Live demos are for stores doing 500+ orders per month. We can still set you up with our WhatsApp API service — our team will call you soon to see how we can help you reduce your RTO.";
  }

  if (unsupportedPlatform) {
    return "Recover Agent currently supports Shopify and WooCommerce only. We've saved your details — we'll notify you when your platform is supported.";
  }

  return null;
}

export function normalizeWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "").slice(0, 10);
  return `+91${digits}`;
}

const STORE_URL_PLACEHOLDER = "to be shared on call";

/** Prepends https:// when the user enters a bare domain. */
export function normalizeStoreUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

const STORE_HOSTNAME_PATTERN =
  /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const STORE_URL_INVALID_MESSAGE =
  "Enter a valid store URL (e.g. yourstore.com)";

export function getStoreUrlValidationError(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Store URL is required";

  if (trimmed.toLowerCase() === STORE_URL_PLACEHOLDER) return undefined;

  if (/\s/.test(trimmed)) {
    return "Store URL cannot contain spaces";
  }

  let parsed: URL;
  try {
    parsed = new URL(normalizeStoreUrl(trimmed));
  } catch {
    return STORE_URL_INVALID_MESSAGE;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return STORE_URL_INVALID_MESSAGE;
  }

  const hostname = parsed.hostname.toLowerCase();
  if (
    !hostname.includes(".") ||
    !STORE_HOSTNAME_PATTERN.test(hostname)
  ) {
    return STORE_URL_INVALID_MESSAGE;
  }

  const labels = hostname.split(".");
  const tld = labels[labels.length - 1];
  if (
    labels.some((label) => label.length === 0) ||
    tld.length < 2 ||
    !/^[a-z]{2,63}$/i.test(tld)
  ) {
    return STORE_URL_INVALID_MESSAGE;
  }

  return undefined;
}

/** Lighter checks while typing; full validation runs on submit. */
export function getStoreUrlInlineError(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/\s/.test(trimmed)) return "Store URL cannot contain spaces";
  if (!trimmed.includes(".")) return undefined;
  return getStoreUrlValidationError(value);
}

export function isValidStoreUrl(value: string): boolean {
  return getStoreUrlValidationError(value) === undefined;
}

/** Build Cal.com link with booking fields prefilled from the demo form. */
export function buildDemoBookingUrl(data: DemoFormData): string {
  const params = new URLSearchParams();
  const name = data.name.trim();
  const phone = normalizeWhatsAppNumber(data.whatsapp);
  const email = data.email.trim();
  const storeUrl = data.storeUrl.trim();
  const monthlyOrders = monthlyOrdersLabel(data.monthlyOrders);
  const preferredLanguage = demoLanguageLabel(data.preferredLanguage);
  const storePlatform = storePlatformLabel(data.storePlatform);

  params.set("name", name);
  params.set("email", email);
  params.set("attendeePhoneNumber", phone);
  params.set(CAL_BOOKING_FIELDS.websiteUrl, storeUrl);
  params.set(CAL_BOOKING_FIELDS.preferredLanguage, preferredLanguage);
  params.set(CAL_BOOKING_FIELDS.storePlatform, storePlatform);
  params.set("notes", `Monthly orders: ${monthlyOrders}`);
  params.set("metadata[storeUrl]", storeUrl);
  params.set("metadata[monthlyOrders]", monthlyOrders);
  params.set("metadata[preferredLanguage]", preferredLanguage);
  params.set("metadata[storePlatform]", storePlatform);
  params.set("metadata[email]", email);

  return `${DEMO_URL}?${params.toString()}`;
}

/** Prefill values for the embedded Cal.com booker (same fields as the external link). */
export function buildDemoEmbedConfig(
  data: DemoFormData
): Record<string, string> {
  const name = data.name.trim();
  const phone = normalizeWhatsAppNumber(data.whatsapp);
  const email = data.email.trim();
  const storeUrl = data.storeUrl.trim();
  const monthlyOrders = monthlyOrdersLabel(data.monthlyOrders);
  const preferredLanguage = demoLanguageLabel(data.preferredLanguage);
  const storePlatform = storePlatformLabel(data.storePlatform);

  return {
    name,
    email,
    attendeePhoneNumber: phone,
    [CAL_BOOKING_FIELDS.websiteUrl]: storeUrl,
    [CAL_BOOKING_FIELDS.preferredLanguage]: preferredLanguage,
    [CAL_BOOKING_FIELDS.storePlatform]: storePlatform,
    notes: `Monthly orders: ${monthlyOrders}`,
    "metadata[storeUrl]": storeUrl,
    "metadata[monthlyOrders]": monthlyOrders,
    "metadata[preferredLanguage]": preferredLanguage,
    "metadata[storePlatform]": storePlatform,
    "metadata[email]": email,
  };
}
