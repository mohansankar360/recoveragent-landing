export const BOOKING_TIME_ZONE = "Asia/Kolkata";
export const BOOKING_TIMES = ["12:30", "16:00"] as const;

export function bookingDays(now = new Date()): string[] {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  const today = Date.UTC(Number(part("year")), Number(part("month")) - 1, Number(part("day")));
  return Array.from({ length: 3 }, (_, i) => new Date(today + i * 86400000).toISOString().slice(0, 10));
}

export function slotStart(day: string, time: string): string {
  return new Date(`${day}T${time}:00+05:30`).toISOString();
}

export function allowedSlot(start: string, now = new Date()): boolean {
  return bookingDays(now).some((day) => BOOKING_TIMES.some((time) =>
    slotStart(day, time) === start && new Date(start) > now));
}

export function formatBookingDate(start: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: BOOKING_TIME_ZONE, weekday: "long", day: "numeric", month: "long",
    hour: "numeric", minute: "2-digit", hour12: true,
  }).format(new Date(start));
}
