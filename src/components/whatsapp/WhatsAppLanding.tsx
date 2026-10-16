"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, WhatsappLogo, Check, Checks, CaretDown, ShoppingBag, ChatCircleDots, Megaphone, GitBranch, UsersThree, ChartBar, Package, ShoppingCart, Lightning, List, X, ShieldCheck, PaperPlaneTilt } from "@phosphor-icons/react";
import { trackEvent } from "@/lib/analytics";
import { generateMetaEventId } from "@/lib/meta-pixel";
import styles from "./WhatsAppLanding.module.css";

const journeys = [
  { label: "Recover a cart", icon: ShoppingCart, event: "Checkout abandoned", delay: "Wait 30 minutes", action: "Send a friendly reminder", message: "Hey Aanya! Your Everyday Tote is still in your cart. Pick up right where you left off.", button: "Complete my order", reply: "Just placed my order. Thank you!", result: "A checkout, picked back up.", tag: "CART RECOVERY" },
  { label: "Confirm a COD order", icon: ShoppingBag, event: "COD order placed", delay: "Send confirmation", action: "Record the customer's reply", message: "Thanks for your order, Aanya! Please confirm your cash-on-delivery order for the Everyday Tote before we prepare it.", button: "Confirm my order", reply: "Yes, please confirm my order.", result: "A confirmed order. A clearer next step.", tag: "COD CONFIRMATION" },
  { label: "Send an order update", icon: Package, event: "Order fulfilled", delay: "Get tracking details", action: "Send the shipping update", message: "It's on its way, Aanya! Your Everyday Tote has been shipped. Follow your delivery with the link below.", button: "Track my order", reply: "Perfect, thanks for the update!", result: "An informed customer, without the chase.", tag: "ORDER UPDATES" },
];

const features = [
  { icon: Megaphone, title: "Broadcast campaigns", text: "Send launches, offers and restock announcements using approved WhatsApp templates.", detail: "Reach your opted-in audience", className: "campaignFeature" },
  { icon: ChatCircleDots, title: "One inbox. Your whole team.", text: "Keep customer conversations together. Assign chats, add notes and pick up where a teammate left off.", detail: "Shared inbox · assignments · notes", className: "inboxFeature" },
  { icon: GitBranch, title: "Flows that do the follow-up", text: "Build rule-based journeys with triggers, conditions and wait steps. Your store events set things in motion.", detail: "Visual, no-code automation", className: "flowFeature" },
  { icon: UsersThree, title: "Know who you're messaging", text: "Import contacts, organise them with tags and custom fields, and send more relevant messages.", detail: "Contacts · tags · CSV imports", className: "contactsFeature" },
  { icon: ChartBar, title: "See what gets delivered", text: "Follow delivery and read status for your broadcasts and keep an eye on your team's activity.", detail: "Campaign and conversation visibility", className: "analyticsFeature" },
];

const included = ["Official WhatsApp Business API", "Broadcasts & message templates", "Shared team inbox", "Contacts, tags & custom fields", "No-code chatbots & automations", "Abandoned checkout recovery", "COD & prepaid order alerts", "Order fulfilled notifications", "Transactional communication flows", "Campaign delivery & read tracking", "Shopify & WooCommerce integrations"];

const faqs = [
  ["What do I get for ₹999/month?", "All Recover Agent WhatsApp features: broadcasts, a shared team inbox, contacts and tags, templates, no-code chatbots and automations, checkout recovery, order notifications and campaign tracking. One monthly platform subscription."],
  ["Are WhatsApp messaging charges included?", "No. ₹999/month is the platform subscription. WhatsApp messaging usage is billed separately; the amount depends on the message category, recipient country and applicable rates. Our team will explain usage billing and applicable taxes before you activate."],
  ["Does this work with my store?", "Recover Agent supports Shopify and WooCommerce. We help connect your store and set up the WhatsApp workflows that fit your business, including checkout reminders and order notifications."],
  ["Can I start if my brand is still small?", "Yes. You can request WhatsApp onboarding regardless of your monthly order volume. Tell us about your store and our team will help you get started."],
  ["What do I need to get started?", "Your Shopify or WooCommerce store, a business phone number and access to your Meta business account. Our team will walk you through number eligibility, business setup and message template approval. Activation depends on Meta's requirements and approval."],
  ["Can I bring my existing WhatsApp number?", "We'll review your current setup and number eligibility with you. The steps depend on whether you're using the WhatsApp Business app or another API provider. We'll explain the migration requirements before you make changes."],
  ["Can I message every customer in my contact list?", "Send campaigns only to customers who have opted in to receive them. Outbound templates require Meta approval, and WhatsApp's messaging limits and policies apply. Your flows should also respect customer opt-outs."],
];

export function WhatsAppLanding() {
  const [journey, setJourney] = useState(0);
  const [previewReply, setPreviewReply] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submission, setSubmission] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const selected = journeys[journey];

  function cta(location: string) {
    trackEvent("cta_clicked", { location, product: "whatsapp", price: 999 });
    setMenuOpen(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submission === "sending" || submission === "success") return;
    const form = new FormData(event.currentTarget);
    const metaEventId = generateMetaEventId();
    setSubmission("sending");
    setError("");
    try {
      const response = await fetch("/api/whatsapp-lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: String(form.get("name")).trim(), whatsapp: String(form.get("whatsapp")).trim(), email: String(form.get("email")).trim(), storeUrl: String(form.get("storeUrl")).trim(), storePlatform: form.get("storePlatform"), metaEventId }),
        signal: AbortSignal.timeout(20_000),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Please try again shortly.");
      setSubmission("success");
      trackEvent("lead_form_submitted", { product: "whatsapp", value: 999, currency: "INR", event_id: metaEventId });
    } catch (cause) {
      setSubmission("error");
      setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "The request timed out. Please try again.");
    }
  }

  return (
    <div className={styles.page}>
      <a href="#main-content" className={styles.skipLink}>Skip to content</a>
      <div className={styles.announcement}><span>Small brand. Big WhatsApp energy.</span><a href="#pricing">All features. ₹999/month. <ArrowUpRight size={14} /></a></div>
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="WhatsApp navigation">
          <Link href="/whatsapp" className={styles.brand} aria-label="Recover Agent WhatsApp home"><span className={styles.brandMark}><WhatsappLogo size={25} weight="fill" /></span><span>recover<span className={styles.brandLight}>agent</span><small>WHATSAPP FOR D2C</small></span></Link>
          <div className={styles.desktopNav}><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#pricing">Pricing</a><a href="#faq">FAQs</a></div>
          <div className={styles.navActions}><a className={styles.login} href="https://wa.recoveragent.ai/">Log in <ArrowUpRight size={14} /></a><a href="#get-started" className={styles.primarySmall} onClick={() => cta("navigation")}>Get started <ArrowRight size={16} /></a><button className={styles.menuToggle} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="whatsapp-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={24} /> : <List size={24} />}</button></div>
        </nav>
        {menuOpen && <div id="whatsapp-menu" className={styles.mobileMenu} onKeyDown={(e) => { if (e.key === "Escape") setMenuOpen(false); }}>{[["#features", "Features"], ["#how-it-works", "How it works"], ["#pricing", "Pricing"], ["#faq", "FAQs"]].map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={16} /></a>)}</div>}
      </header>

      <main id="main-content">
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}><span /> YOUR STORE’S WHATSAPP, SORTED.</div>
            <h1>More orders.<br />Closer customers.<br /><span>Just WhatsApp.</span></h1>
            <p>Recover carts, send campaigns, share order updates and reply as a team. Everything your D2C brand needs on WhatsApp.</p>
            <div className={styles.heroPrice}><strong>₹999</strong><span>/ month<small>All WhatsApp features included.</small></span></div>
            <div className={styles.heroActions}><a href="#get-started" className={styles.primary} onClick={() => cta("hero")}>Get started for ₹999/mo <ArrowRight size={19} /></a><a href="#how-it-works" className={styles.textLink}>See it in action <ArrowUpRight size={18} /></a></div>
            <p className={styles.usageNote}>Platform subscription. WhatsApp messaging charges extra.</p>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.visualOrbit} />
            <div className={styles.eventCard}><span className={styles.eventIcon}><ShoppingBag size={22} /></span><div><small>YOUR STORE</small><strong>Checkout abandoned</strong><span>Let’s bring this customer back.</span></div><span className={styles.eventDot} /></div>
            <div className={styles.connector}><span /><Lightning size={18} weight="fill" /><span /></div>
            <div className={styles.phone}>
              <div className={styles.phoneTop}><span>9:41</span><div /><span>•••</span></div>
              <div className={styles.chatHeader}><span className={styles.storeAvatar}><ShoppingBag size={20} /></span><div><strong>The Everyday Store</strong><small>Business account</small></div><WhatsappLogo size={23} weight="fill" /></div>
              <div className={styles.chatBody}><div className={styles.chatDate}>Today</div><div className={styles.chatMessage}><div className={styles.productVisual}><ShoppingBag size={62} weight="duotone" /><span>THE EVERYDAY TOTE</span></div><p>Hey Aanya!<br />Good taste. Your Everyday Tote is waiting right where you left it.</p><span className={styles.messageTime}>9:41 <Checks size={14} /></span><button onClick={() => setPreviewReply(true)}>{previewReply ? "Order placed" : "Complete my order"}<ArrowUpRight size={15} /></button></div>{previewReply ? <div className={styles.customerReply}>Just ordered. Thank you! <Checks size={14} /></div> : <span className={styles.previewHint}>Try the message button ↑</span>}</div>
              <div className={styles.chatComposer}><span>Message</span><PaperPlaneTilt size={19} /></div>
            </div>
            <div className={styles.outcomeCard}><span><Check size={17} weight="bold" /></span><div><strong>A conversation that converts.</strong><small>From abandoned cart to next order.</small></div></div>
            <span className={styles.exampleLabel}>Illustrative customer journey</span>
          </div>
        </section>

        <div className={styles.integrationStrip}><span>Made for the store you already run.</span><div><Image src="/shopify-logo.svg" alt="Shopify" width={100} height={30} /><span className={styles.integrationDivider} /><Image src="/woocommerce-logo.png" alt="WooCommerce" width={116} height={30} /></div><span className={styles.official}><ShieldCheck size={18} /> Official WhatsApp Business API</span></div>

        <section id="how-it-works" className={`${styles.section} ${styles.journeySection}`}>
          <div className={styles.sectionHeading}><h2>Every store moment.<br /><span>A better conversation.</span></h2><p>A customer leaves a cart. Places an order. Waits for a delivery. Be there with the right WhatsApp message.</p></div>
          <div className={styles.journeyTabs} role="tablist" aria-label="Explore WhatsApp workflows">{journeys.map((item, index) => <button key={item.label} role="tab" id={`journey-tab-${index}`} aria-controls="journey-panel" aria-selected={journey === index} tabIndex={journey === index ? 0 : -1} onClick={() => { setJourney(index); trackEvent("workflow_step_clicked", { product: "whatsapp", workflow: item.tag }); }} onKeyDown={(event) => { if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) { event.preventDefault(); const next = event.key === "Home" ? 0 : event.key === "End" ? journeys.length - 1 : (journey + (event.key === "ArrowRight" ? 1 : -1) + journeys.length) % journeys.length; setJourney(next); document.getElementById(`journey-tab-${next}`)?.focus(); } }}><item.icon size={19} />{item.label}<ArrowUpRight size={15} /></button>)}</div>
          <div className={styles.journeyPanel} role="tabpanel" id="journey-panel" aria-labelledby={`journey-tab-${journey}`}>
            <div className={styles.flowPreview}><span className={styles.previewLabel}>YOUR WORKFLOW</span><div className={styles.flowStep}><selected.icon size={22} /><span>{selected.event}</span><span className={styles.stepBadge}>Trigger</span></div><div className={styles.flowLine} /><div className={styles.flowStep}><Lightning size={22} /><span>{selected.delay}</span></div><div className={styles.flowLine} /><div className={`${styles.flowStep} ${styles.activeStep}`}><WhatsappLogo size={23} /><span>{selected.action}</span><Check size={17} /></div><p>Your rules. Your timing. Your brand.</p></div>
            <div className={styles.journeyChat} key={journey}><span className={styles.previewLabel}>WHAT YOUR CUSTOMER SEES · EXAMPLE</span><div className={styles.sampleMessage}><strong>The Everyday Store</strong><p>{selected.message}</p><div><span>9:41</span><Checks size={15} /></div><span className={styles.sampleButton}>{selected.button}<ArrowUpRight size={14} /></span></div><div className={styles.sampleReply}>{selected.reply}<Checks size={14} /></div><div className={styles.journeyResult}><Check size={18} weight="bold" />{selected.result}</div></div>
          </div>
        </section>

        <section id="features" className={styles.section}>
          <div className={styles.sectionHeading}><h2>Your WhatsApp toolkit.<br /><span>Every feature included.</span></h2><p>Marketing, customer conversations and store automations, together in one place.</p></div>
          <div className={styles.featureGrid}>{features.map((feature, index) => <article key={feature.title} className={`${styles.feature} ${styles[feature.className]}`}><span className={styles.featureIcon}><feature.icon size={25} /></span><h3>{feature.title}</h3><p>{feature.text}</p>{index === 0 && <div className={styles.campaignIllustration} aria-hidden="true"><span>NEW DROP</span><strong>Something good<br />just landed.</strong><div>Explore the collection <ArrowUpRight size={15} /></div></div>}{index === 1 && <div className={styles.inboxIllustration} aria-hidden="true"><span className={styles.avatar}>A</span><div><strong>Aanya Sharma</strong><span>Can I get a delivery update?</span></div><small>Assigned to you</small></div>}<span className={styles.featureDetail}><Check size={14} />{feature.detail}</span></article>)}</div>
        </section>

        <section className={`${styles.section} ${styles.setupSection}`}><h2>From “where do I start?”<br /><span>to your first message.</span></h2><div className={styles.setupSteps}>{[{ title: "Connect your store", text: "Bring your Shopify or WooCommerce store. We help you connect your WhatsApp business account." }, { title: "Make it your own", text: "Set up your templates, import opted-in contacts and choose your customer journeys." }, { title: "Send. Reply. Follow up.", text: "Launch a campaign, switch on order updates and keep conversations moving from your shared inbox." }].map((step, index) => <div key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div><p className={styles.setupNote}>Our team helps with onboarding. Meta business and template approvals apply.</p></section>

        <section id="pricing" className={`${styles.section} ${styles.pricingSection}`}>
          <div className={styles.pricingIntro}><span className={styles.eyebrow}>ONE PLAN. THE WHOLE TOOLKIT.</span><h2>Built for your brand.<br /><span>Priced for right now.</span></h2><p>You’re building a business. Your WhatsApp subscription should leave room for it to grow.</p><div className={styles.pricingFootnote}><ShieldCheck size={23} /><span>Powered by the official<br />WhatsApp Business API.</span></div></div>
          <div className={styles.priceCard}><div className={styles.priceCardTop}><span>WhatsApp for D2C</span><span className={styles.allIncluded}>All features included</span></div><div className={styles.planPrice}>₹999<span>/ month</span></div><p>One monthly subscription. All our WhatsApp features.</p><a href="#get-started" className={styles.primary} onClick={() => cta("pricing")}>Get started <ArrowRight size={19} /></a><ul>{included.map((item) => <li key={item}><Check size={17} weight="bold" />{item}</li>)}</ul><div className={styles.billingNote}><strong>A clear view of your bill.</strong><p>₹999/month covers the platform. WhatsApp messaging charges are billed separately. Applicable taxes and usage rates will be explained before activation.</p></div></div>
        </section>

        <section id="faq" className={`${styles.section} ${styles.faqSection}`}><div><h2>A few things<br /><span>you might be asking.</span></h2><p>Clear answers before you get started.</p></div><div className={styles.faqList}>{faqs.map(([question, answer]) => <details key={question} onToggle={(event) => { if (event.currentTarget.open) trackEvent("faq_opened", { product: "whatsapp", question }); }}><summary>{question}<CaretDown size={19} /></summary><p>{answer}</p></details>)}</div></section>

        <section id="get-started" className={`${styles.section} ${styles.onboarding}`}><div className={styles.onboardingCopy}><span className={styles.eyebrow}><WhatsappLogo size={18} weight="fill" /> LET’S GET YOUR BRAND CONNECTED.</span><h2>Your next chapter.<br /><span>On WhatsApp.</span></h2><p>Tell us a little about your store. We’ll help you get set up with all our WhatsApp features for ₹999/month.</p><div className={styles.onboardingNote}><Check size={17} />Small stores welcome.<br /><Check size={17} />Shopify & WooCommerce supported.</div></div>
          <div className={styles.formCard}>{submission === "success" ? <div className={styles.success} role="status"><span><Check size={36} /></span><h3>You’re on the list.</h3><p>We’ve received your WhatsApp onboarding request. Our team will contact you using the details you shared to help connect your store.</p><a href="#features" className={styles.textLink}>Explore your WhatsApp toolkit <ArrowRight size={17} /></a></div> : <form onSubmit={submit}><h3>Let’s get you started.</h3><p>Request WhatsApp onboarding.</p><div className={styles.formGrid}><label>Your name<input name="name" autoComplete="name" placeholder="Aanya Sharma" maxLength={120} required /></label><label>Work email<input name="email" type="email" autoComplete="email" placeholder="you@yourbrand.com" maxLength={254} required /></label></div><label>WhatsApp number<div className={styles.phoneField}><span>+91</span><input name="whatsapp" type="tel" autoComplete="tel-national" inputMode="numeric" pattern="[6-9][0-9]{9}" title="Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9" placeholder="9876543210" maxLength={10} required /></div></label><div className={styles.formGrid}><label>Store website<input name="storeUrl" autoComplete="url" placeholder="yourbrand.com" maxLength={500} required /></label><label>Store platform<select name="storePlatform" defaultValue="" required><option value="" disabled>Select platform</option><option value="shopify">Shopify</option><option value="woocommerce">WooCommerce</option></select></label></div>{submission === "error" && <p className={styles.formError} role="alert">{error}</p>}<button type="submit" className={styles.primary} disabled={submission === "sending"}>{submission === "sending" ? "Sending your request…" : "Request onboarding · ₹999/mo"}<ArrowRight size={18} /></button><small>By submitting, you agree to be contacted about WhatsApp onboarding using the details above. Messaging charges extra.</small></form>}</div>
        </section>
      </main>
      <footer className={styles.footer}><Link href="/whatsapp" className={styles.footerBrand}><WhatsappLogo size={21} weight="fill" />recoveragent<span>WhatsApp for D2C.</span></Link><div><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="https://wa.recoveragent.ai/">Log in <ArrowUpRight size={13} /></a></div><small>© {new Date().getFullYear()} Recover Agent. WhatsApp is a trademark of Meta.</small></footer>
      <div className={styles.mobileBar}><span><strong>₹999</strong> / month<small>All WhatsApp features</small></span><a href="#get-started" onClick={() => cta("mobile_sticky")}>Get started <ArrowRight size={17} /></a></div>
    </div>
  );
}
