import type { DemoFormData } from "./demo-booking";

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
      typeof parsed.storeUrl === "string" &&
      typeof parsed.monthlyOrders === "string" &&
      typeof parsed.preferredLanguage === "string"
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
