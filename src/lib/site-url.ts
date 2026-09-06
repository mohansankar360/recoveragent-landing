/** Canonical site origin — set NEXT_PUBLIC_SITE_URL in production. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://recoveragent.ai"
).replace(/\/$/, "");
