import type { DemoFormData } from "./demo-booking";
import { isValidMonthlyOrders, isValidStorePlatform } from "./demo-booking";

export const DEMO_BOOKING_SESSION_KEY = "recoveragent_demo_booking";

export function saveDemoBookingSession(data: DemoFormData): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DEMO_BOOKING_SESSION_KEY, JSON.stringify(data));
}

export function readDemoBookingSession(): DemoFormData | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(DEMO_BOOKING_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as DemoFormData;
    if (
      typeof parsed.name === "string" &&
      typeof parsed.whatsapp === "string" &&
      typeof parsed.email === "string" &&
      typeof parsed.storeUrl === "string" &&
      typeof parsed.storePlatform === "string" &&
      typeof parsed.monthlyOrders === "string" &&
      typeof parsed.preferredLanguage === "string" &&
      isValidStorePlatform(parsed.storePlatform) &&
      isValidMonthlyOrders(parsed.monthlyOrders)
    ) {
      return parsed;
    }
  } catch {
    sessionStorage.removeItem(DEMO_BOOKING_SESSION_KEY);
  }

  return null;
}

export function clearDemoBookingSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DEMO_BOOKING_SESSION_KEY);
}

// The visitor's own form answers, kept in this browser so a returning visitor
// doesn't retype them. Lasts until site data is cleared or they press "Not you?".
const SAVED_LEAD_DETAILS_KEY = "recoveragent_lead_details";
const SAVED_LEAD_FIELDS = ["name", "whatsapp", "email", "storeUrl", "monthlyOrders", "storePlatform"] as const;
export type SavedLeadDetails = Partial<Record<(typeof SAVED_LEAD_FIELDS)[number], string>>;

export function readSavedLeadDetails(): SavedLeadDetails | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_LEAD_DETAILS_KEY) ?? "null");
    if (!parsed || typeof parsed !== "object") return null;
    const details: SavedLeadDetails = {};
    for (const field of SAVED_LEAD_FIELDS) {
      const value = parsed[field];
      if (typeof value === "string" && value.length <= 300) details[field] = value;
    }
    if (details.monthlyOrders && !isValidMonthlyOrders(details.monthlyOrders)) delete details.monthlyOrders;
    if (details.storePlatform && !isValidStorePlatform(details.storePlatform)) delete details.storePlatform;
    return details.name && details.whatsapp ? details : null;
  } catch {
    return null;
  }
}

export function saveLeadDetails(details: SavedLeadDetails): void {
  try {
    const saved = readSavedLeadDetails() ?? {};
    for (const field of SAVED_LEAD_FIELDS) {
      const value = details[field]?.trim();
      if (value) saved[field] = value;
    }
    localStorage.setItem(SAVED_LEAD_DETAILS_KEY, JSON.stringify(saved));
  } catch {
    // Storage blocked (private mode, site data disabled): just don't remember.
  }
}

export function clearSavedLeadDetails(): void {
  try {
    localStorage.removeItem(SAVED_LEAD_DETAILS_KEY);
  } catch {
    // Nothing to clear.
  }
}
