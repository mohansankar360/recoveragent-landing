import "server-only";
import { allowedSlot, bookingDays, BOOKING_TIMES, BOOKING_TIME_ZONE, slotStart } from "./calendar-slots";

export const CAL_EVENT_TYPE_ID = 7446791;

export async function calRequest(path: string, version: string, body?: unknown) {
  const response = await fetch(`https://api.cal.com/v2/${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      "cal-api-version": version,
      "Content-Type": "application/json",
      ...(process.env.CAL_API_KEY ? { Authorization: `Bearer ${process.env.CAL_API_KEY}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  const result = await response.json();
  if (!response.ok || result.status !== "success") {
    throw new Error("Cal.com request failed", { cause: { status: response.status } });
  }
  return result.data;
}

export async function availableBookingSlots() {
  const days = bookingDays();
  const params = new URLSearchParams({
    eventTypeId: String(CAL_EVENT_TYPE_ID), start: days[0], end: days[2], timeZone: BOOKING_TIME_ZONE,
  });
  const data = await calRequest(`slots?${params}`, "2024-09-04") as Record<string, Array<{ start: string }>>;
  const starts = Object.values(data).flat().map((slot) => new Date(slot.start).toISOString());
  const slots = starts.filter((start) => allowedSlot(start));
  const availableDays = days.filter((day) => BOOKING_TIMES.some((time) => slots.includes(slotStart(day, time))));
  return { days: availableDays, slots, timeZone: BOOKING_TIME_ZONE };
}
