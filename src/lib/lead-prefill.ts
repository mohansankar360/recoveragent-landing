import type { DemoFormData } from "./demo-booking";
import {
  isValidMonthlyOrders,
  isValidStorePlatform,
} from "./demo-booking";

export const LEAD_PREFILL_SESSION_KEY = "recoveragent_lead_prefill";

export type LeadPrefillData = Partial<
  Pick<
    DemoFormData,
    | "name"
    | "whatsapp"
    | "email"
    | "storeUrl"
    | "storePlatform"
    | "monthlyOrders"
    | "preferredLanguage"
  >
>;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function sanitizeLeadPrefill(raw: unknown): LeadPrefillData | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Record<string, unknown>;
  const prefill: LeadPrefillData = {};

  if (isNonEmptyString(data.name)) prefill.name = data.name.trim();
  if (isNonEmptyString(data.email)) prefill.email = data.email.trim();

  if (isNonEmptyString(data.whatsapp)) {
    const digits = data.whatsapp.replace(/\D/g, "");
    const normalized =
      digits.startsWith("91") && digits.length > 10 ? digits.slice(2) : digits;
    if (/^[6-9]\d{9}$/.test(normalized.slice(0, 10))) {
      prefill.whatsapp = normalized.slice(0, 10);
    }
  }

  if (isNonEmptyString(data.storeUrl)) prefill.storeUrl = data.storeUrl.trim();

  if (
    isNonEmptyString(data.storePlatform) &&
    isValidStorePlatform(data.storePlatform)
  ) {
    prefill.storePlatform = data.storePlatform;
  }

  if (
    isNonEmptyString(data.monthlyOrders) &&
    isValidMonthlyOrders(data.monthlyOrders)
  ) {
    prefill.monthlyOrders = data.monthlyOrders;
  }

  if (isNonEmptyString(data.preferredLanguage)) {
    prefill.preferredLanguage = data.preferredLanguage;
  }

  return Object.keys(prefill).length > 0 ? prefill : null;
}

export function saveLeadPrefill(data: LeadPrefillData): void {
  if (typeof window === "undefined") return;

  const sanitized = sanitizeLeadPrefill(data);
  if (!sanitized) return;

  sessionStorage.setItem(LEAD_PREFILL_SESSION_KEY, JSON.stringify(sanitized));
}

export function readLeadPrefill(): LeadPrefillData | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(LEAD_PREFILL_SESSION_KEY);
  if (!raw) return null;

  try {
    return sanitizeLeadPrefill(JSON.parse(raw));
  } catch {
    sessionStorage.removeItem(LEAD_PREFILL_SESSION_KEY);
    return null;
  }
}

export function clearLeadPrefill(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(LEAD_PREFILL_SESSION_KEY);
}

export function applyLeadPrefill<T extends LeadPrefillData>(
  form: T,
  prefill: LeadPrefillData
): T {
  return {
    ...form,
    ...(prefill.name ? { name: prefill.name } : {}),
    ...(prefill.email ? { email: prefill.email } : {}),
    ...(prefill.whatsapp ? { whatsapp: prefill.whatsapp } : {}),
    ...(prefill.storeUrl ? { storeUrl: prefill.storeUrl } : {}),
    ...(prefill.storePlatform ? { storePlatform: prefill.storePlatform } : {}),
    ...(prefill.monthlyOrders ? { monthlyOrders: prefill.monthlyOrders } : {}),
    ...(prefill.preferredLanguage
      ? { preferredLanguage: prefill.preferredLanguage }
      : {}),
  };
}
