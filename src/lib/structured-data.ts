import { siteUrl } from "@/lib/site-url";

const SITE_NAME = "Recover Agent";
const SITE_DESCRIPTION =
  "AI voice + WhatsApp agent for Indian D2C brands on Shopify and WooCommerce. Verify COD before dispatch, re-attempt NDR, and recover abandoned checkouts.";

export function websiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
  };
}

export function organizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/recover-agent-logo.png`,
    description: SITE_DESCRIPTION,
  };
}
