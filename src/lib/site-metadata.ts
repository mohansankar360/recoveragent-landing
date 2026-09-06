import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";

export const SITE_NAME = "Recover Agent";

export const DEFAULT_TITLE =
  "Recover Agent — Ship fewer orders back. Bank more of what you sell.";

export const DEFAULT_DESCRIPTION =
  "AI voice + WhatsApp agent for Indian D2C brands on Shopify. Verify COD before dispatch, re-attempt NDR, recover abandoned checkouts — in your customer's own language.";

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1024,
  height: 640,
  alt: "Recover Agent — AI voice agent for D2C brands: COD confirmation, abandoned checkout recovery, and NDR follow-up",
} as const;

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "RTO reduction",
    "COD verification",
    "COD confirmation",
    "reduce RTO ecommerce",
    "D2C RTO",
    "NDR management",
    "AI voice agent ecommerce",
    "COD to prepaid",
    "Shopify COD India",
  ],
  openGraph: {
    title: DEFAULT_TITLE,
    description:
      "AI voice + WhatsApp agent for Indian D2C brands. Verify COD, re-attempt NDR, recover abandoned checkouts.",
    type: "website",
    siteName: SITE_NAME,
    url: siteUrl,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recover Agent — Ship fewer orders back.",
    description:
      "AI voice + WhatsApp recovery for Indian D2C brands on Shopify.",
    images: [OG_IMAGE.url],
  },
  robots: { index: true, follow: true },
};

export const homeMetadata: Metadata = {
  alternates: { canonical: "/" },
};
