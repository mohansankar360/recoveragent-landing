export const CAL_EVENT_LINK = "recoveragent/product-demo-recover-agent";

export const DEMO_URL = `https://cal.com/${CAL_EVENT_LINK}`;

/**
 * Cal.com booking-question identifiers (Event → Advanced → Booking questions).
 * Update these if prefills do not appear on the confirm step.
 */
export const CAL_BOOKING_FIELDS = {
  websiteUrl: "website-url",
  preferredLanguage: "preferred-language-for-demo",
  storePlatform: "which-platform-your-store-is-in",
} as const;
