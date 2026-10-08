import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";

export const SITE_NAME = "Recover Agent";

export const DEFAULT_TITLE =
  "Recover Agent: Revenue Recovery for Indian D2C";

export const DEFAULT_DESCRIPTION =
  "Recover at-risk COD orders, abandoned checkouts, and failed deliveries with AI voice, WhatsApp follow-up, and one recovery operations dashboard.";

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1024,
  height: 640,
  alt: "Recover Agent: revenue recovery for COD, abandoned checkouts, and NDR",
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
    "D2C revenue recovery",
    "abandoned checkout calling",
    "NDR recovery software",
  ],
  openGraph: {
    title: DEFAULT_TITLE,
    description:
      "Recover at-risk COD orders, abandoned checkouts, and failed deliveries with AI voice, WhatsApp follow-up, and one operations dashboard.",
    type: "website",
    siteName: SITE_NAME,
    url: siteUrl,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recover Agent: Revenue Recovery for Indian D2C",
    description:
      "AI voice, WhatsApp follow-up, and recovery operations for COD, checkout, and NDR.",
    images: [OG_IMAGE.url],
  },
  robots: { index: true, follow: true },
};

export const homeMetadata: Metadata = {
  alternates: { canonical: "/" },
};
