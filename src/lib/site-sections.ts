export const SITE_SECTIONS = [
  {
    slug: "where-you-leak",
    anchorId: "leaks",
    navLabel: "Where you leak",
    title: "Where D2C brands lose revenue — COD, carts & NDR",
    description:
      "Three recovery paths Indian D2C brands leak money on: unverified COD orders, abandoned checkouts, and failed deliveries. Recover Agent handles all three with AI voice and WhatsApp.",
    sitemapPriority: 0.85,
  },
  {
    slug: "loss-calculator",
    anchorId: "calc",
    navLabel: "Loss calculator",
    title: "RTO & recovery loss calculator for Indian D2C",
    description:
      "Estimate monthly revenue lost to RTO, abandoned carts, and NDR expiry. See what Recover Agent could recover based on your COD volume, AOV, and order count.",
    sitemapPriority: 0.9,
  },
  {
    slug: "control-room",
    anchorId: "control-room",
    navLabel: "Control room",
    title: "Recovery control room — COD, cart & NDR dashboard",
    description:
      "See how Recover Agent tracks COD verification, abandoned checkout recovery, and NDR re-attempts in one control room built for Indian Shopify and WooCommerce brands.",
    sitemapPriority: 0.8,
  },
  {
    slug: "hear-a-call",
    anchorId: "call",
    navLabel: "Hear a call",
    title: "Hear a Recover Agent AI voice call demo",
    description:
      "Listen to real Recover Agent call scripts for COD confirmation, cart recovery, and NDR re-attempt — in Hindi, English, and regional languages.",
    sitemapPriority: 0.8,
  },
  {
    slug: "why-calling",
    anchorId: "call-versus",
    navLabel: "Why calling",
    title: "Why voice calls beat email and WhatsApp for order recovery",
    description:
      "Compare recovery rates: email ~10%, WhatsApp 40–50%, voice call + WhatsApp 70–80%. Why Indian D2C brands use AI voice for COD and NDR recovery.",
    sitemapPriority: 0.75,
  },
  {
    slug: "plans",
    anchorId: "plans",
    navLabel: "Plans",
    title: "Recover Agent pricing — COD, cart & NDR recovery plans",
    description:
      "Simple pricing tiers for AI voice COD verification, abandoned checkout recovery, and NDR re-attempts. WhatsApp flows included on every plan.",
    sitemapPriority: 0.95,
  },
  {
    slug: "go-live",
    anchorId: "go-live",
    navLabel: "Go live",
    title: "Go live in 3 days — Recover Agent onboarding",
    description:
      "Connect Shopify or WooCommerce, configure AI recovery flows, and go live in three days. No integration project, no IT ticket.",
    sitemapPriority: 0.7,
  },
  {
    slug: "how-it-works",
    anchorId: "how-it-works",
    navLabel: "How it works",
    title: "How Recover Agent works — order to recovery lifecycle",
    description:
      "From store order through AI voice call, WhatsApp follow-up, prepaid conversion, and NDR re-attempt — the full Recover Agent recovery workflow.",
    sitemapPriority: 0.82,
  },
  {
    slug: "faq",
    anchorId: "faq",
    navLabel: "FAQ",
    title: "Recover Agent FAQ — COD, WhatsApp, RTO & data privacy",
    description:
      "Answers founders ask before booking: AI call quality, WhatsApp compliance, Shopify support, DPDP data handling, and what happens if RTO doesn't move.",
    sitemapPriority: 0.85,
  },
  {
    slug: "book-demo",
    anchorId: "demo-booking",
    navLabel: "Book a demo",
    title: "Book a Recover Agent demo — 15-minute walkthrough",
    description:
      "Book a free 15-minute demo. See Recover Agent verify COD, recover abandoned carts, and re-attempt NDR for your Indian D2C brand.",
    sitemapPriority: 1,
  },
] as const;

export type SiteSectionSlug = (typeof SITE_SECTIONS)[number]["slug"];

export type SiteSection = (typeof SITE_SECTIONS)[number];

const sectionBySlug = new Map<string, SiteSection>(
  SITE_SECTIONS.map((section) => [section.slug, section])
);

export function getSiteSection(slug: string): SiteSection | undefined {
  return sectionBySlug.get(slug);
}

export function getAllSiteSectionSlugs(): SiteSectionSlug[] {
  return SITE_SECTIONS.map((section) => section.slug);
}
