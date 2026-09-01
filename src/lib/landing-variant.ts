export type LandingVariant = "full" | "cold" | "warm";

export const LANDING_VARIANTS: {
  id: LandingVariant;
  path: string;
  label: string;
  tagline: string;
  audience: string;
}[] = [
  {
    id: "cold",
    path: "/cold",
    label: "Cold traffic",
    tagline: "Ad click · 60-second path",
    audience: "Meta / Google ads — zero trust, zero patience",
  },
  {
    id: "warm",
    path: "/warm",
    label: "Warm traffic",
    tagline: "Referral · depth to decide",
    audience: "WhatsApp intro, retargeting, founder referrals",
  },
  {
    id: "full",
    path: "/full",
    label: "Full (current)",
    tagline: "Everything included",
    audience: "Original long-form page for comparison",
  },
];

/** FAQ question keys shown on the cold-traffic variant. */
export const COLD_FAQ_QUESTIONS = new Set([
  "What if the AI annoys my customer and I lose the sale?",
  "How is this different from the confirmation calls my ops team already makes?",
  "What if it doesn't move my RTO?",
  "Which brands does this not work for?",
]);
