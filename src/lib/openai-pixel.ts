type Pixel = (command: string, ...args: unknown[]) => void;
declare global {
  interface Window { oaiq?: Pixel; }
}

const sentBookings = new Set<string>();

export function trackOpenAIPageView(): void {
  try {
    if (typeof window === "undefined") return;
    window.oaiq?.("measure", "page_viewed", { type: "contents" });
  } catch { /* Measurement must never interrupt the page. */ }
}

export function trackOpenAIBooking(eventId?: string): void {
  try {
    if (typeof window === "undefined" || !window.oaiq) return;
    if (eventId && sentBookings.has(eventId)) return;
    window.oaiq("measure", "appointment_scheduled", { type: "customer_action" },
      eventId ? { event_id: eventId } : {});
    if (eventId) sentBookings.add(eventId);
  } catch { /* Measurement must never interrupt a confirmed booking. */ }
}
