import { availableBookingSlots, calRequest, CAL_EVENT_TYPE_ID } from "@/lib/cal-server";
import { allowedSlot, BOOKING_TIME_ZONE } from "@/lib/calendar-slots";
import { isValidDemoFormData } from "@/lib/demo-lead";
import { monthlyOrdersLabel, normalizeWhatsAppNumber, qualifiesForDemoCalendar } from "@/lib/demo-booking";
import { CAL_BOOKING_FIELDS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(await availableBookingSlots(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "We couldn’t load available times. Please try again." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }
  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: "Invalid booking details." }, { status: 400 });
  }
  const fields = ["name", "email", "whatsapp", "storeUrl", "storePlatform", "monthlyOrders", "preferredLanguage"];
  if (!body || !body.details || !fields.every((field) =>
      typeof body.details[field] === "string" && body.details[field].length <= 500) ||
      body.confirmed !== true || !isValidDemoFormData(body.details) ||
      !qualifiesForDemoCalendar(body.details) || typeof body.start !== "string" || !allowedSlot(body.start)) {
    return Response.json({ error: "Please check your details and choose a future time within the next three days." }, { status: 400 });
  }
  try {
    const availability = await availableBookingSlots();
    if (!availability.slots.includes(body.start)) {
      return Response.json({ error: "This time is no longer available. Please choose another slot." }, { status: 409 });
    }
    const details = body.details;
    const data = await calRequest("bookings", "2026-02-25", {
      eventTypeId: CAL_EVENT_TYPE_ID,
      start: body.start,
      attendee: {
        name: details.name.trim(), email: details.email.trim(),
        phoneNumber: normalizeWhatsAppNumber(details.whatsapp), timeZone: BOOKING_TIME_ZONE, language: "en",
      },
      bookingFieldsResponses: {
        [CAL_BOOKING_FIELDS.websiteUrl]: details.storeUrl.trim(),
        [CAL_BOOKING_FIELDS.preferredLanguage]: "English only",
        [CAL_BOOKING_FIELDS.storePlatform]: details.storePlatform === "shopify" ? "Shopify" : "Woocommerce",
        notes: `Monthly orders: ${monthlyOrdersLabel(details.monthlyOrders)}`,
      },
      metadata: {
        source: "recover-agent-landing", storeUrl: details.storeUrl.trim().slice(0, 500),
        monthlyOrders: monthlyOrdersLabel(details.monthlyOrders), storePlatform: details.storePlatform,
        preferredLanguage: details.preferredLanguage.slice(0, 500),
      },
    });
    if (!data?.uid || !["accepted", "pending"].includes(data.status)) {
      return Response.json({ error: "Cal.com did not confirm the booking. Please contact us before trying again." }, { status: 502 });
    }
    return Response.json({ uid: data.uid, status: data.status, start: data.start ?? body.start });
  } catch {
    return Response.json({ error: "We couldn’t confirm your booking. If you received a calendar email, your booking went through; otherwise please try again." }, { status: 502 });
  }
}
