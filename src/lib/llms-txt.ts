import { ALL_PLANS_WHATSAPP } from "@/lib/pricing-plans";
import { SITE_SECTIONS } from "@/lib/site-sections";
import { SITE_USE_CASES } from "@/lib/site-use-cases";
import { siteUrl } from "@/lib/site-url";

const RESOURCE_SECTION_SLUGS = new Set([
  "faq",
  "why-calling",
  "loss-calculator",
  "how-it-works",
]);

function sectionUrl(slug: string): string {
  return `${siteUrl}/${slug}`;
}

function formatSectionLinks(
  sections: typeof SITE_SECTIONS,
  pick: (slug: string) => boolean
): string {
  return sections
    .filter((section) => pick(section.slug))
    .map(
      (section) =>
        `- [${section.navLabel}](${sectionUrl(section.slug)}): ${section.description}`
    )
    .join("\n");
}

export function buildLlmsTxt(): string {
  const productPages = formatSectionLinks(
    SITE_SECTIONS,
    (slug) => slug !== "book-demo"
  );

  const resources = formatSectionLinks(SITE_SECTIONS, (slug) =>
    RESOURCE_SECTION_SLUGS.has(slug)
  );

  const useCases = SITE_USE_CASES.map(
    (useCase) =>
      `- [${useCase.navLabel}](${sectionUrl(useCase.slug)}): ${useCase.description}`
  ).join("\n");

  const whatsappFlows = ALL_PLANS_WHATSAPP.map((flow) => `- ${flow}`).join("\n");

  const bookDemo = SITE_SECTIONS.find((section) => section.slug === "book-demo")!;

  return `# Recover Agent

Recover Agent is an AI voice and WhatsApp automation product for Indian D2C ecommerce brands on Shopify and WooCommerce. It helps merchants verify COD orders before dispatch, recover abandoned checkouts, and re-attempt failed deliveries (NDR) to reduce return-to-origin (RTO) losses.

## What Recover Agent does

- COD verification and confirmation calls before shipment
- Abandoned checkout recovery via AI voice conversations
- NDR (non-delivery report) recovery and delivery re-attempt coordination
- AI voice calling in Indian languages (including Hindi, Tamil, Telugu, Malayalam, Kannada, and English)
- WhatsApp automation for confirmations, payment links, and follow-ups via the official WhatsApp Business API
- Recovery control room to track COD, cart, and NDR workflows and order outcomes
- Outcomes written back to the connected store (e.g. Shopify tags and order updates)
- Pricing tiers (Starter, Growth, Scale) with voice-call allotments and WhatsApp flows on every plan

## Who it is for

- Indian D2C ecommerce brands losing revenue to RTO, unverified COD, abandoned carts, or failed deliveries
- Shopify merchants running COD-heavy order volumes
- WooCommerce merchants with similar COD, cart, and delivery recovery needs
- Operations teams that currently rely on manual confirmation calls or inconsistent WhatsApp follow-up
- Brands doing roughly 500+ orders per month (live product demos on the site target this range)

## Problems it solves

| Problem | How Recover Agent addresses it |
| --- | --- |
| Unconfirmed or fake COD orders shipping and returning as RTO | AI calls customers before dispatch to confirm purchase intent and address details |
| COD cancellations and unwanted orders | Captures customer intent before shipping; flags orders that should not ship |
| High RTO (return to origin) | Verifies COD upfront and follows up on failed deliveries before they become returns |
| Failed delivery / NDR | Calls the customer after a failed delivery to understand the issue and schedule re-attempt |
| Abandoned checkouts | AI voice outreach to customers who added to cart but did not complete payment |
| Manual customer follow-up | Automates voice and WhatsApp recovery workflows and tracks outcomes in one dashboard |

## How it works

1. **Connect the store** — Shopify or WooCommerce is connected along with checkout, shipping, and WhatsApp (onboarding described as a 3-day go-live on the site).
2. **Configure recovery flows** — COD confirmation, abandoned checkout, and NDR flows are set up for the brand's tone and rules.
3. **Order or checkout triggers recovery** — A COD order, abandoned checkout, or failed delivery enters the recovery workflow (store webhooks and automation steps shown in the control room demo).
4. **Customer is contacted** — Recover Agent places an AI voice call and/or sends WhatsApp messages (confirmations, payment links, follow-ups).
5. **Response is captured** — Customer intent (confirm, reschedule, cancel, pay prepaid, etc.) is recorded from the conversation.
6. **Outcome is applied and tracked** — Results are written back to the store where applicable; calls, confirmations, recoveries, and revenue are tracked in the control room dashboard.

Full workflow: [How it works](${sectionUrl("how-it-works")})

## Use cases

${useCases}

Related demos and walkthroughs:
- [Hear a call](${sectionUrl("hear-a-call")}): Sample AI voice scripts for COD confirmation, abandoned checkout recovery, and NDR re-attempt
- [Why calling](${sectionUrl("why-calling")}): Comparison of email, WhatsApp-only, and voice + WhatsApp outreach for order recovery

## Integrations

Publicly supported on the website:

- **Shopify** — primary commerce platform; order webhooks, tags, and order updates
- **WooCommerce** — supported store platform alongside Shopify
- **WhatsApp Business API** — official Meta-approved route with pre-approved templates (not unofficial gateways)

WhatsApp flows included on all plans:

${whatsappFlows}

Go-live onboarding also references connecting checkout and shipping tools alongside the store and WhatsApp.

## Product pages

- [Home](${siteUrl}/): AI voice + WhatsApp agent for Indian D2C brands — verify COD before dispatch, re-attempt NDR, recover abandoned checkouts
${productPages}

## Resources

${resources}

No public blog, documentation portal, or help center routes exist in the site at this time.

## Booking

- [${bookDemo.navLabel}](${sectionUrl(bookDemo.slug)}): ${bookDemo.description}

Demo booking on the site collects store URL, platform (Shopify/WooCommerce), monthly order volume, and preferred demo language before scheduling.

## Contact & company

Public information available on the website:

- Product name: Recover Agent
- Audience: Indian D2C ecommerce (AI voice and WhatsApp recovery)
- Data handling: customer data stays within the encrypted pipe between the store, WhatsApp, and the voice system; site states compliance with India's DPDP Act 2023 and GDPR for merchants shipping internationally
- WhatsApp: uses the official WhatsApp Business API only

No public email address, phone number, or physical office address appears on the current site.

## Important terminology

- COD verification / COD confirmation
- RTO reduction / return to origin
- NDR recovery / non-delivery report / delivery re-attempt
- Abandoned checkout recovery
- AI voice agent / AI voice calling
- WhatsApp automation / WhatsApp Business API
- D2C operations / ecommerce recovery
- COD to prepaid conversion
- Recovery control room / recovery dashboard

## Sitemap

- [Sitemap](${siteUrl}/sitemap.xml)
- [Robots](${siteUrl}/robots.txt)
`;
}
