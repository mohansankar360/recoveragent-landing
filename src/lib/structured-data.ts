import { siteUrl } from "@/lib/site-url";

const SITE_NAME = "Recover Agent";
const SITE_DESCRIPTION =
  "Revenue recovery operations for Indian D2C brands using AI voice, WhatsApp follow-up, and a dashboard for COD, abandoned checkout, and NDR workflows.";

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
