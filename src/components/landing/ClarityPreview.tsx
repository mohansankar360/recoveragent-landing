"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, CheckCircle, Headphones, Moon, Package, PhoneCall, Storefront, Sun, Truck, UserSwitch, WhatsappLogo } from "@phosphor-icons/react";
import { PRICING_TIERS, calculateTierCost, formatInr } from "@/lib/calculator";
import { PLAN_FEATURE_ROWS, PLAN_FEATURES } from "@/lib/pricing-plans";
import { faqs } from "@/lib/faq-data";
import { trackEvent } from "@/lib/analytics";
import { ControlRoomDemo } from "./ControlRoomDemo";
import styles from "./ClarityPreview.module.css";

const examples = [
  {
    id: "cod", name: "COD confirmation", icon: Package,
    title: "Confirm the order before it leaves your store.",
    body: "A new COD order is a chance to check intent, confirm the address, and catch changes before dispatch.",
    quote: "Can I pay online instead?", response: "The agent can send a payment link on WhatsApp, using your configured payment workflow.",
    steps: ["COD order placed", "AI confirms order and address", "Follow-up sent on WhatsApp", "Outcome saved for dispatch review"],
    outcome: "Your team sees confirmed orders and exceptions separately.",
    audio: "/audio/COD_hindi.mp4", language: "Hindi",
  },
  {
    id: "checkout", name: "Abandoned checkout", icon: Storefront,
    title: "Answer the question that stopped the purchase.",
    body: "A shopper may need help with size, delivery, or payment. The agent asks what happened and follows up with the relevant information.",
    quote: "I wasn't sure about the size.", response: "The agent can explain your exchange policy and share a size guide and checkout link on WhatsApp.",
    steps: ["Checkout abandoned", "AI asks what the shopper needs", "Relevant link shared on WhatsApp", "Intent and next step recorded"],
    outcome: "Follow up with context, rather than another generic reminder.",
    audio: "/audio/abandoned_hindi.mp3", language: "Hindi",
  },
  {
    id: "ndr", name: "Failed delivery recovery", icon: Truck,
    title: "Find the next step before an order returns.",
    body: "When delivery fails, the agent checks whether the buyer needs another attempt, an address correction, or help from your team.",
    quote: "Please try again tomorrow evening.", response: "The requested timing is recorded for your team. Reattempt actions depend on your connected delivery workflow.",
    steps: ["Delivery attempt fails", "AI checks the buyer's intent", "Request recorded with context", "Your team reviews the next action"],
    outcome: "Give operations a clear request to act on.",
    audio: "/audio/NDR_english.mp4", language: "English",
  },
] as const;

function DemoLink({ children = "Book a demo", secondary = false, source = "preview" }: { children?: React.ReactNode; secondary?: boolean; source?: string }) {
  return <Link className={secondary ? styles.secondary : styles.primary} href="/book-demo" onClick={() => trackEvent("cta_clicked", { source })}>{children}<ArrowRight size={18} aria-hidden /></Link>;
}

export function ClarityPreview() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const heroAudio = useRef<HTMLAudioElement>(null);
  const billingExample = calculateTierCost(1000, PRICING_TIERS[1]);

  useEffect(() => {
    setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);

  function stopOtherAudio(event: React.SyntheticEvent<HTMLAudioElement>) {
    document.querySelectorAll<HTMLAudioElement>("audio[data-preview-audio]").forEach((audio) => {
      if (audio !== event.currentTarget) audio.pause();
    });
  }

  return <div className={styles.page} data-theme={theme}>
    <a href="#preview-main" className={styles.skip}>Skip to content</a>
    <div className={styles.comparison}><span>Homepage comparison</span><Link href="/">View existing homepage <ArrowRight size={14} aria-hidden /></Link></div>
    <header className={styles.header}>
      <div className={styles.nav}>
        <a href="#top" aria-label="RecoverAgent preview home" className={styles.logo}><Image src="/recover-agent-logo-transparent.png" width={174} height={54} alt="RecoverAgent" priority /></a>
        <nav aria-label="Preview navigation"><a href="#workflows">How it works</a><a href="#product">Product</a><a href="#pricing">Pricing</a><a href="#questions">FAQ</a></nav>
        <div className={styles.navActions}><button className={styles.themeToggle} onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>{theme === "light" ? <Moon size={19} /> : <Sun size={19} />}</button><DemoLink source="preview_navigation" /></div>
      </div>
    </header>

    <main id="preview-main">
      <section id="top" className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>AI calls + WhatsApp for Indian D2C</p>
          <h1>Reduce RTO.<br /><span>Deliver more orders.</span></h1>
          <p className={styles.lead}>Confirm COD orders, recover abandoned checkouts, and follow up on failed deliveries. AI handles the conversation. Your team sees the next step.</p>
          <div className={styles.actions}><DemoLink source="preview_hero" /><a className={styles.secondary} href="#hear-call"><Headphones size={18} aria-hidden /> Hear an AI call</a></div>
          <p className={styles.heroNote}>30-minute walkthrough of your store’s recovery workflow.</p>
          <div className={styles.compatibility}><span>Works with</span><Image src="/shopify-logo.svg" alt="Shopify" width={91} height={27} /><Image src="/woocommerce-logo.png" alt="WooCommerce" width={81} height={27} /></div>
        </div>
        <div className={styles.callPanel} id="hear-call">
          <div className={styles.panelTop}><span><PhoneCall size={18} aria-hidden /> Hear the product</span><span>COD confirmation</span></div>
          <div className={styles.callIdentity}><div className={styles.callIcon}><PhoneCall size={40} weight="duotone" aria-hidden /></div><h2>A conversation.<br />A clear outcome.</h2><p>Listen to the Hindi COD recording.</p></div>
          <audio ref={heroAudio} controls preload="metadata" data-preview-audio onPlay={stopOtherAudio} aria-label="Hindi COD confirmation call"><source src="/audio/COD_hindi.mp4" />Your browser does not support audio. <a href="/audio/COD_hindi.mp4">Open the recording</a>.</audio>
          <div className={styles.callOutcome}><CheckCircle size={22} weight="fill" aria-hidden /><div><strong>Confirm intent before dispatch</strong><span>Order details checked. Follow-up coordinated.</span></div></div>
          <a className={styles.textLink} href="#workflows">Explore the three recovery workflows <ArrowRight size={16} aria-hidden /></a>
        </div>
      </section>

      <section className={styles.capabilities} aria-label="Product capabilities">
        <div><PhoneCall size={22} aria-hidden /><span><strong>AI conversations</strong><small>Indian-language configurations</small></span></div>
        <div><WhatsappLogo size={22} aria-hidden /><span><strong>WhatsApp follow-up</strong><small>Links, updates, and reminders</small></span></div>
        <div><UserSwitch size={22} aria-hidden /><span><strong>Your team stays in control</strong><small>Exceptions flagged for review</small></span></div>
      </section>

      <section id="workflows" className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.eyebrow}>Three moments that matter</p><h2>From an order event<br />to a useful conversation.</h2><p>Each workflow starts with your store’s activity and ends with an outcome your team can use.</p></div>
        <div className={styles.workflowList}>{examples.map((item) => <article className={styles.workflow} key={item.id}>
          <div className={styles.workflowCopy}><p className={styles.workflowLabel}><item.icon size={23} aria-hidden />{item.name}</p><h3>{item.title}</h3><p>{item.body}</p><ol className={styles.steps}>{item.steps.map((step) => <li key={step}><Check size={15} weight="bold" aria-hidden />{step}</li>)}</ol><p className={styles.workflowOutcome}>{item.outcome}</p></div>
          <div className={styles.example}><span className={styles.exampleLabel}>Illustrative conversation</span><blockquote>“{item.quote}”</blockquote><div className={styles.response}><WhatsappLogo size={23} aria-hidden /><p>{item.response}</p></div><div className={styles.exampleAudio}><span><Headphones size={17} aria-hidden />{item.language} call recording</span><audio controls preload="none" data-preview-audio onPlay={stopOtherAudio} aria-label={`${item.language} ${item.name} recording`}><source src={item.audio} /> <a href={item.audio}>Listen to recording</a></audio></div></div>
        </article>)}</div>
      </section>

      <section className={styles.results} aria-labelledby="results-title"><div><p className={styles.eyebrow}>Reported operating results</p><h2 id="results-title">Less RTO.<br />More room to grow.</h2><p>RecoverAgent reports average RTO falling from 32% to 17% across more than 100 brands.</p><Link href="/book-demo" className={styles.textLink}>Discuss the data in your demo <ArrowRight size={17} aria-hidden /></Link></div><div className={styles.resultMetric}><div><span>Average before</span><strong>32<small>%</small></strong></div><ArrowRight size={30} aria-hidden /><div><span>With RecoverAgent</span><strong>17<small>%</small></strong></div><p>15 percentage points lower</p><small>Aggregate, company-reported results. Outcomes depend on your store and workflows. Review the reporting period and measurement approach in your demo.</small></div></section>

      <section id="product" className={`${styles.section} ${styles.productSection}`}>
        <div className={styles.productIntro}><div><p className={styles.eyebrow}>Calls and messages, connected</p><h2>One conversation.<br />The right follow-up.</h2><p>Voice checks what the buyer needs. WhatsApp carries the useful link or update. Your dashboard keeps the outcome attached to the order.</p><Link className={styles.textLink} href="/control-room">See the dashboard <ArrowRight size={17} aria-hidden /></Link></div><div className={styles.handoff}><article><PhoneCall size={26} aria-hidden /><div><h3>Ask and understand</h3><p>Confirm intent, answer configured questions, and capture requests.</p></div></article><article><WhatsappLogo size={26} aria-hidden /><div><h3>Send what helps</h3><p>Share a checkout link, payment link, or order update through your configured flows.</p></div></article><article><UserSwitch size={26} aria-hidden /><div><h3>Keep your team informed</h3><p>Review the outcome, recording, and exceptions when a person needs to step in.</p></div></article></div></div>
        <details className={styles.dashboard}><summary>Explore the interactive dashboard <span>Sample orders <ArrowRight size={18} aria-hidden /></span></summary><div className={styles.dashboardBody}><ControlRoomDemo /></div></details>
      </section>

      <section id="setup" className={styles.setup}><div><p className={styles.eyebrow}>A rollout built around your store</p><h2>Connect. Configure.<br />Test together.</h2><p>We map your workflows before committing to a go-live date.</p><DemoLink secondary source="preview_setup">Plan your setup</DemoLink></div><ol>{[
        ["Bring your store context", "Share your order volume, COD share, RTO rate, and commerce and shipping tools."],
        ["Set the rules", "Agree on language, call timing, brand policies, WhatsApp follow-up, and human review."],
        ["Test the first workflow", "Review conversations and outcomes together before rolling out more journeys."],
      ].map(([title, body], index) => <li key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol></section>

      <section id="pricing" className={styles.section}>
        <div className={styles.sectionHead}><p className={styles.eyebrow}>Straightforward plans</p><h2>Choose the recovery<br />your store needs.</h2><p>Monthly plans with included orders and a clear additional-order rate.</p></div>
        <div className={styles.planList}>{PRICING_TIERS.map((plan) => <article className={`${styles.plan} ${plan.recommended ? styles.recommended : ""}`} key={plan.id}><div><span className={styles.planName}>{plan.name}{plan.recommended && <small>Recommended</small>}</span><p>{plan.id === "starter" ? "Confirm COD before dispatch" : plan.id === "growth" ? "Confirm COD and recover checkouts" : "COD, checkout, and failed delivery recovery"}</p></div><div className={styles.planPrice}><strong>{formatInr(plan.base)}</strong><span>/ month</span></div><div className={styles.planAllowance}><strong>{plan.includedCalls.toLocaleString("en-IN")} orders included</strong><span>₹{plan.overagePerOrder} / additional order</span></div><ul>{PLAN_FEATURE_ROWS.filter((feature) => PLAN_FEATURES[plan.id][feature.key]).map((feature) => <li key={feature.key}><Check size={14} weight="bold" aria-hidden />{feature.label}</li>)}</ul><DemoLink secondary source={`preview_pricing_${plan.id}`}>Discuss this plan</DemoLink></article>)}</div>
        <div className={styles.billing}><div><WhatsappLogo size={25} aria-hidden /><h3>WhatsApp flows in every plan.</h3><p>Order notifications, WhatsApp checkout recovery, chatbots, and customer communication flows. AI calling for checkout recovery starts with Growth.</p></div><div><h3>A monthly cost example</h3><p>1,000 billed orders on Growth:</p><dl><div><dt>Plan with 700 included orders</dt><dd>{formatInr(billingExample.baseCost)}</dd></div><div><dt>300 additional orders × ₹4.50</dt><dd>{formatInr(billingExample.overageCost)}</dd></div><div><dt>Plan + order overage</dt><dd>{formatInr(billingExample.cost)}</dd></div></dl><small>Illustrative plan cost. Confirm taxes, messaging charges, NDR billing, and retry terms during your demo.</small></div></div>
        <div className={styles.calculatorLink}><span>Want to use your own numbers?</span><Link href="/loss-calculator">Open the recovery calculator <ArrowRight size={17} aria-hidden /></Link></div>
      </section>

      <section id="questions" className={styles.faq}><div><p className={styles.eyebrow}>Before you get started</p><h2>A few useful answers.</h2><p>Still have a question?<br /><a href="mailto:hello@recoveragent.ai">hello@recoveragent.ai</a></p></div><div>{faqs.filter((_, index) => [0, 1, 2, 5, 7, 8, 9].includes(index)).map((faq) => <details key={faq.question}><summary>{faq.question}<span aria-hidden>+</span></summary><p>{faq.answer}</p></details>)}</div></section>

      <section className={styles.final}><p className={styles.eyebrow}>Your store. Your recovery plan.</p><h2>See how it works<br />with your orders.</h2><p>Walk through the calls, WhatsApp follow-up, dashboard, and costs. Leave with a clear first workflow.</p><DemoLink source="preview_final">Book a 30-minute demo</DemoLink><small>Live demos for Shopify and WooCommerce stores with 500+ monthly orders.<br />Smaller stores can request an onboarding call.</small></section>
    </main>
    <footer className={styles.footer}><div><strong>RecoverAgent</strong><p>AI calls and WhatsApp recovery for Indian D2C.</p><a href="mailto:hello@recoveragent.ai">hello@recoveragent.ai</a></div><nav aria-label="Footer navigation"><a href="#workflows">How it works</a><Link href="/go-live">Onboarding</Link><Link href="/blog">Guides</Link><a href="tel:+919788274333">+91 97882 74333</a></nav><Link className={styles.compareBack} href="/">Compare with existing homepage <ArrowRight size={16} aria-hidden /></Link></footer>
  </div>;
}
