export const CAL_EVENT_LINK = "recoveragent/recover-agent-discovery-call";

export const DEMO_URL = `https://cal.com/${CAL_EVENT_LINK}`;

/**
 * Cal.com booking-question identifiers (Event → Advanced → Booking questions).
 * Update these if prefills do not appear on the confirm step.
 */
export const CAL_BOOKING_FIELDS = {
  websiteUrl: "Website-url",
  preferredLanguage: "Preferred-Language-for-Demo",
  storePlatform: "Which-platform-your-store-is-in",
} as const;
