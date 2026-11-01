export const BOOKING_TIME_ZONE = "Asia/Kolkata";
// Number of bookable days offered, counting today. Sundays are skipped and don't count.
export const BOOKING_DAY_COUNT = 3;

export function istDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
}

export function bookingDays(now = new Date()): string[] {
  const today = Date.parse(`${istDate(now)}T00:00:00Z`);
  const days: string[] = [];
  for (let i = 0; days.length < BOOKING_DAY_COUNT; i++) {
    const day = new Date(today + i * 86400000);
    if (day.getUTCDay() !== 0) days.push(day.toISOString().slice(0, 10));
  }
  return days;
}

export function allowedSlot(start: string, now = new Date()): boolean {
  const date = new Date(start);
  return !Number.isNaN(date.getTime()) && date > now && bookingDays(now).includes(istDate(date));
}

export function formatBookingTime(start: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: BOOKING_TIME_ZONE, hour: "numeric", minute: "2-digit", hour12: true,
  }).format(new Date(start)).toUpperCase();
}

export function formatBookingDate(start: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: BOOKING_TIME_ZONE, weekday: "long", day: "numeric", month: "long",
    hour: "numeric", minute: "2-digit", hour12: true,
  }).format(new Date(start));
}
