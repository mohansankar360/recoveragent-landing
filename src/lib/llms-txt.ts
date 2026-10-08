import { ALL_PLANS_WHATSAPP } from "@/lib/pricing-plans";
import { getAllBlogPosts } from "@/lib/blog";
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

  const blogPosts = getAllBlogPosts()
    .map(
      (post) =>
        `- [${post.title}](${siteUrl}/blog/${post.slug}): ${post.description}`
    )
    .join("\n");

  return `# Recover Agent

Recover Agent is a revenue recovery and ecommerce operations product for Indian D2C brands on Shopify and WooCommerce. AI voice and WhatsApp help merchants understand customer intent across COD orders, abandoned checkouts, and failed deliveries (NDR), while the dashboard makes outcomes and next steps visible to the team.

## What Recover Agent does

- COD verification and confirmation calls before shipment
- Abandoned checkout recovery via AI voice conversations
- NDR (non-delivery report) recovery and delivery re-attempt coordination
- AI voice calling in Indian languages (including Hindi, Tamil, Telugu, Malayalam, Kannada, and English)
- WhatsApp automation for confirmations, payment links, and follow-ups via the official WhatsApp Business API
- Recovery control room to track COD, cart, and NDR workflows and order outcomes
- Outcomes saved to the recovery dashboard and routed to configured store or team workflows where connected
- Pricing tiers (Starter, Growth, Scale) with voice-call allotments and WhatsApp flows on every plan

## Who it is for

- Indian D2C ecommerce brands losing revenue to RTO, unverified COD, abandoned carts, or failed deliveries
- Shopify merchants running COD-heavy order volumes
- WooCommerce merchants with similar COD, cart, and delivery recovery needs
- Operations teams that currently rely on manual confirmation calls or inconsistent WhatsApp follow-up
- Brands with meaningful COD, checkout, or failed-delivery follow-up volume

## Problems it solves

| Problem | How Recover Agent addresses it |
| --- | --- |
| Unconfirmed or fake COD orders shipping and returning as RTO | AI calls customers before dispatch to confirm purchase intent and address details |
| COD cancellations and unwanted orders | Captures customer intent before shipping; flags orders that should not ship |
| High RTO (return to origin) | Verifies COD upfront and follows up on failed deliveries before they become returns |
| Failed delivery / NDR | Calls the customer after a failed delivery to understand the issue and capture a requested re-attempt |
| Abandoned checkouts | AI voice outreach to customers who added to cart but did not complete payment |
| Manual customer follow-up | Automates voice and WhatsApp recovery workflows and tracks outcomes in one dashboard |

## How it works

1. **Connect the store** — Shopify or WooCommerce is connected with the relevant checkout, shipping, payment, and WhatsApp workflows.
2. **Configure recovery flows** — COD confirmation, abandoned checkout, and NDR flows are set up for the brand's tone and rules.
3. **Order or checkout triggers recovery** — A COD order, abandoned checkout, or failed delivery enters the recovery workflow (store webhooks and automation steps shown in the control room demo).
4. **Customer is contacted** — Recover Agent places an AI voice call and/or sends WhatsApp messages (confirmations, payment links, follow-ups).
5. **Response is captured** — Customer intent (confirm, reschedule, cancel, pay prepaid, etc.) is recorded from the conversation.
6. **Outcome is routed and tracked** — Results are saved in the recovery dashboard and sent to configured store or team workflows where applicable.

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

Implementation scope and timing depend on the merchant's store, workflow complexity, and connected tools.

## Product pages

- [Home](${siteUrl}/): AI voice + WhatsApp agent for Indian D2C brands — verify COD before dispatch, re-attempt NDR, recover abandoned checkouts
${productPages}

## Resources

${resources}

## Blog

- [Blog index](${siteUrl}/blog): Guides on RTO reduction, COD verification, NDR recovery, and ecommerce automation for Indian D2C brands
${blogPosts}

## Booking

- [${bookDemo.navLabel}](${sectionUrl(bookDemo.slug)}): ${bookDemo.description}

Demo booking on the site collects store URL, platform (Shopify/WooCommerce), monthly order volume, and preferred demo language before scheduling.

## Contact & company

Public information available on the website:

- Product name: Recover Agent
- Audience: Indian D2C ecommerce (AI voice and WhatsApp recovery)
- Data handling and workflow controls are reviewed during implementation for the merchant's specific setup
- WhatsApp: the product repository uses the official Meta WhatsApp Cloud API

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
