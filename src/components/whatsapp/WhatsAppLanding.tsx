"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CaretDown,
  ChartBar,
  ChatCircleDots,
  Check,
  CheckCircle,
  Checks,
  CreditCard,
  DeviceMobile,
  GitBranch,
  List,
  Megaphone,
  PaperPlaneTilt,
  Robot,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkle,
  Storefront,
  Truck,
  UsersThree,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import { trackEvent } from "@/lib/analytics";
import { generateMetaEventId } from "@/lib/meta-pixel";
import { SiteFooter } from "@/components/landing/TrialHomepage";
import base from "@/components/landing/TrialHomepage.module.css";
import styles from "./WhatsAppLanding.module.css";

type ChatLine =
  | { kind: "event"; text: string }
  | { kind: "brand"; text: string; button?: string; product?: { name: string; price: string } }
  | { kind: "buyer"; text: string };

const journeys: Array<{ id: string; label: string; icon: typeof ShoppingCart; trigger: string; wait: string; action: string; result: string; chat: ChatLine[] }> = [
  {
    id: "cart", label: "Recover a cart", icon: ShoppingCart, trigger: "Checkout abandoned", wait: "Wait 30 minutes", action: "Send a cart reminder", result: "Checkout recovered",
    chat: [
      { kind: "event", text: "Checkout abandoned · ₹1,299" },
      { kind: "brand", text: "Hi Aanya 👋 Your Everyday Tote is still in your cart. Complete your order in one tap.", button: "Complete my order" },
      { kind: "buyer", text: "Just placed it. Thanks!" },
    ],
  },
  {
    id: "cod", label: "Confirm a COD order", icon: ShoppingBag, trigger: "COD order placed", wait: "Send right away", action: "Ask the buyer to confirm", result: "Confirmed before dispatch",
    chat: [
      { kind: "event", text: "COD order placed · #1042" },
      { kind: "brand", text: "Thanks for your order, Aanya! Please confirm your cash-on-delivery order before we pack it.", button: "Confirm my order" },
      { kind: "buyer", text: "Yes, confirmed ✅" },
    ],
  },
  {
    id: "shipped", label: "Send an order update", icon: Truck, trigger: "Order shipped", wait: "Get tracking details", action: "Send the shipping update", result: "Fewer “where is my order?” chats",
    chat: [
      { kind: "event", text: "Order shipped · AWB 5767…376" },
      { kind: "brand", text: "It’s on its way, Aanya! 🚚 Follow your Everyday Tote with the link below.", button: "Track my order" },
      { kind: "buyer", text: "Perfect, thank you!" },
    ],
  },
  {
    id: "sell", label: "Sell in the chat", icon: Storefront, trigger: "Customer asks about a product", wait: "Reply from your catalog", action: "Send product + payment link", result: "Sold inside the chat",
    chat: [
      { kind: "buyer", text: "Do you have the tote in black?" },
      { kind: "brand", text: "Yes! Here it is 👇", product: { name: "Everyday Tote · Black", price: "₹1,299" }, button: "View product" },
      { kind: "brand", text: "Want it today? Pay here and we ship tonight.", button: "Pay ₹1,299" },
    ],
  },
];

const features = [
  { icon: Megaphone, title: "Broadcast campaigns", text: "Launches, offers and restock news with approved templates. Schedule them and track delivered and read.", big: true },
  { icon: ChatCircleDots, title: "One inbox for your team", text: "Assign chats, add notes, use quick replies and see each buyer’s Shopify orders beside the chat.", big: true },
  { icon: GitBranch, title: "No-code flows", text: "Triggers, conditions and waits. Your store events start the follow-up on their own." },
  { icon: Robot, title: "AI replies", text: "Trained on your store policies and FAQs. Hands the chat to your team when it should." },
  { icon: Storefront, title: "Sell on WhatsApp", text: "Send products from your Shopify catalog right inside the chat." },
  { icon: CreditCard, title: "Payment links", text: "Collect payment in the chat with Razorpay or Cashfree links." },
  { icon: PaperPlaneTilt, title: "Direct Message", text: "Reach customers even after the 24-hour window has closed." },
  { icon: DeviceMobile, title: "WhatsApp Coexistence", text: "Keep using the WhatsApp Business app on the same number while the API does the heavy lifting." },
  { icon: ChartBar, title: "Click-to-WhatsApp ads", text: "See which ad started each chat and send lead quality back to Meta." },
  { icon: UsersThree, title: "Contacts and segments", text: "Tags, custom fields, CSV import and Google Sheets sync for sharper targeting." },
];

const included = [
  "Official WhatsApp Business API",
  "WhatsApp Coexistence: keep the Business app",
  "Broadcasts, templates and scheduling",
  "Shared team inbox and quick replies",
  "No-code flows and automations",
  "AI replies trained on your store",
  "Abandoned checkout recovery",
  "COD and prepaid order alerts",
  "Shipped and delivered updates",
  "Sell on WhatsApp (product sends)",
  "Payment links (Razorpay, Cashfree)",
  "Direct Message beyond 24 hours",
  "Click-to-WhatsApp ad tracking",
  "Shopify and WooCommerce integrations",
];

const faqs = [
  ["How does the free trial work?", "You get all WhatsApp features free for 14 days. After that it is ₹999/month for the platform. Our team helps you connect your store and WhatsApp number during onboarding."],
  ["What do I get for ₹999/month?", "Every WhatsApp feature on this page: broadcasts, the shared inbox, flows, AI replies, Sell on WhatsApp, payment links, Direct Message, Coexistence, ad tracking, contacts and order notifications. One monthly platform subscription."],
  ["Are WhatsApp messaging charges included?", "No. ₹999/month is the platform subscription. WhatsApp messaging usage is billed separately; the amount depends on the message category and applicable rates. We explain usage billing and taxes before you activate."],
  ["Can I keep using the WhatsApp Business app?", "Yes. With WhatsApp Coexistence you can keep the WhatsApp Business app on the same number while connecting it to the API. We check your number’s eligibility with you first."],
  ["What is Direct Message?", "WhatsApp normally limits free-form messages to 24 hours after a customer last wrote to you. Direct Message lets you reach the customer even after that window has closed."],
  ["Does this work with my store?", "Yes, with Shopify and WooCommerce. We help connect your store and set up checkout reminders, order alerts and the flows that fit your business."],
  ["Can I start if my brand is still small?", "Yes. You can start regardless of your monthly order volume. Tell us about your store and we will help you get going."],
  ["Can I message every customer in my list?", "Send campaigns only to customers who opted in. Templates need Meta approval, and WhatsApp’s messaging limits and policies apply. Your flows should respect opt-outs."],
];

const navLinks = [["#features", "Features"], ["#how-it-works", "How it works"], ["#pricing", "Pricing"], ["#faq", "FAQ"]] as const;

/* ── Animated WhatsApp chat ── */

function ChatPlayer({ journeyIndex }: { journeyIndex: number }) {
  const journey = journeys[journeyIndex];
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(reduceMotion ? journey.chat.length : 0);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    setTyping(false);
    if (reduceMotion) { setShown(journey.chat.length); return; }
    setShown(0);
    const timers: number[] = [];
    let at = 400;
    journey.chat.forEach((line, index) => {
      if (line.kind !== "event") {
        timers.push(window.setTimeout(() => setTyping(true), at));
        at += 900;
      }
      timers.push(window.setTimeout(() => { setTyping(false); setShown(index + 1); }, at));
      at += 700;
    });
    return () => timers.forEach(window.clearTimeout);
  }, [journeyIndex, journey.chat, reduceMotion]);
  const nextIsBuyer = journey.chat[shown]?.kind === "buyer";
  return <div className={styles.chatBody}>
    <p className={styles.chatDay}>Today</p>
    <AnimatePresence initial={false}>
      {journey.chat.slice(0, shown).map((line, index) => <motion.div key={`${journey.id}-${index}`} initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.25 }}
        className={line.kind === "event" ? styles.chatEvent : line.kind === "brand" ? styles.bubbleBrand : styles.bubbleBuyer}>
        {line.kind === "event" ? <><Sparkle size={13} weight="fill" aria-hidden="true" />{line.text}</> : <>
          {line.kind === "brand" && line.product && <div className={styles.productCard}><span><ShoppingBag size={34} weight="duotone" aria-hidden="true" /></span><strong>{line.product.name}</strong><small>{line.product.price}</small></div>}
          <p>{line.text}<span className={styles.stamp}>9:4{index + 1}{line.kind === "brand" && <Checks size={14} weight="bold" aria-hidden="true" />}</span></p>
          {line.kind === "brand" && line.button && <span className={styles.chatButton}><ArrowUpRight size={14} aria-hidden="true" />{line.button}</span>}
        </>}
      </motion.div>)}
    </AnimatePresence>
    {typing && <div className={nextIsBuyer ? styles.typingBuyer : styles.typingBrand} aria-hidden="true"><i /><i /><i /></div>}
  </div>;
}

function PhoneMock({ journeyIndex }: { journeyIndex: number }) {
  return <div className={styles.phone}>
    <div className={styles.phoneNotch} aria-hidden="true" />
    <div className={styles.phoneScreen}>
      <div className={styles.chatHeader}>
        <span className={styles.storeAvatar}><ShoppingBag size={18} weight="fill" aria-hidden="true" /></span>
        <span><strong>The Everyday Store</strong><small>Business account</small></span>
        <WhatsappLogo size={22} weight="fill" aria-hidden="true" />
      </div>
      <ChatPlayer journeyIndex={journeyIndex} />
      <div className={styles.composer}><span>Message</span><PaperPlaneTilt size={18} weight="fill" aria-hidden="true" /></div>
    </div>
  </div>;
}

/* ── Page ── */

export function WhatsAppLanding() {
  const reduceMotion = useReducedMotion();
  const [heroJourney, setHeroJourney] = useState(0);
  const [journey, setJourney] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submission, setSubmission] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const cardUp = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -120]);
  const cardDown = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 80]);
  const phoneY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -40]);
  const selected = journeys[journey];

  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const form = document.getElementById("get-started")?.getBoundingClientRect();
      const formVisible = Boolean(form && form.top < window.innerHeight && form.bottom > 0);
      setShowBar(window.scrollY > 600 && !formVisible);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The hero phone cycles through the journeys on its own.
  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setHeroJourney((value) => (value + 1) % journeys.length), 6500);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  function cta(location: string) {
    trackEvent("cta_clicked", { location, product: "whatsapp", price: 999, cta: "start_trial" });
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

  return <div className={`${base.page} ${styles.page}`}>
    <header className={`${base.header} ${base.headerScrolled}`}>
      <a href="#top" className={`${base.brand} ${styles.brand}`} aria-label="RecoverAgent WhatsApp home">
        <Image src="/recover-agent-logo-transparent.png" width={500} height={250} alt="RecoverAgent" priority />
        <span className={styles.brandTag}><WhatsappLogo size={13} weight="fill" aria-hidden="true" />WhatsApp</span>
      </a>
      <nav className={base.desktopNav} aria-label="WhatsApp navigation">
        {navLinks.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        <a href="https://wa.recoveragent.ai/">Log in</a>
      </nav>
      <div className={base.headerCta}><a href="#get-started" className={`${base.trialButton} ${base.trialButtonCompact} ${styles.greenButton}`} onClick={() => cta("navigation")}>Start free trial <ArrowRight size={16} weight="bold" aria-hidden="true" /></a></div>
      <button type="button" className={base.menuButton} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="wa-mobile-nav" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X size={22} aria-hidden="true" /> : <List size={22} aria-hidden="true" />}</button>
      <AnimatePresence>
        {menuOpen && <motion.nav id="wa-mobile-nav" className={base.mobileNav} aria-label="Mobile navigation" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          {navLinks.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a href="https://wa.recoveragent.ai/">Log in</a>
          <a href="#get-started" className={styles.mobileNavCta} onClick={() => cta("mobile_menu")}>Start 14-day free trial <ArrowRight size={16} aria-hidden="true" /></a>
        </motion.nav>}
      </AnimatePresence>
    </header>

    <main>
      {/* Hero */}
      <section ref={heroRef} className={`${base.hero} ${styles.hero}`} id="top">
        <div className={base.heroGrid} aria-hidden="true" />
        <div className={base.heroInner}>
          <div className={base.heroCopy}>
            <p className={`${base.heroBadge} ${styles.heroBadge}`}><span className={base.pulseDot} />14 days free · then ₹999/month</p>
            <h1>Sell, recover and support. <span className={styles.greenText}>All on WhatsApp.</span></h1>
            <p className={base.heroLead}>Recover carts, confirm COD orders, send order updates and sell right inside the chat. One shared inbox for your team, built for Indian D2C brands.</p>
            <div className={base.heroActions}>
              <a href="#get-started" className={`${base.trialButton} ${styles.greenButton}`} onClick={() => cta("hero")}>Start 14-day free trial <ArrowRight size={17} weight="bold" aria-hidden="true" /></a>
              <a href="#how-it-works" className={base.ghostButton}>See it in action <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <ul className={base.heroAssurances}>
              <li><Check size={15} weight="bold" aria-hidden="true" />Official WhatsApp Business API</li>
              <li><Check size={15} weight="bold" aria-hidden="true" />Keep your WhatsApp Business app</li>
              <li><Check size={15} weight="bold" aria-hidden="true" />Shopify and WooCommerce</li>
            </ul>
          </div>
          <div className={styles.heroStage}>
            <div className={styles.stageGlow} aria-hidden="true" />
            <motion.div style={{ y: phoneY }} className={styles.phoneWrap}><PhoneMock journeyIndex={heroJourney} /></motion.div>
            <motion.div style={{ y: cardUp }} className={`${styles.floatCard} ${styles.floatTop}`} aria-hidden="true">
              <span className={styles.floatIcon}><ShoppingCart size={17} weight="fill" /></span>
              <span><small>Shopify event</small><strong>{journeys[heroJourney].trigger}</strong></span>
            </motion.div>
            <motion.div style={{ y: cardDown }} className={`${styles.floatCard} ${styles.floatBottom}`} aria-hidden="true">
              <span className={styles.floatIconGreen}><CheckCircle size={17} weight="fill" /></span>
              <span><small>Outcome</small><strong>{journeys[heroJourney].result}</strong></span>
            </motion.div>
            <div className={styles.heroDots} role="tablist" aria-label="Example conversations">
              {journeys.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={heroJourney === index} aria-label={item.label} onClick={() => setHeroJourney(index)} />)}
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className={styles.trustStrip} aria-label="Works with">
        <Image src="/shopify-logo.svg" alt="Shopify" width={92} height={26} />
        <Image src="/woocommerce-logo.png" alt="WooCommerce" width={98} height={26} />
        <span><ShieldCheck size={18} weight="fill" aria-hidden="true" />Official WhatsApp Business API</span>
        <span><DeviceMobile size={18} weight="fill" aria-hidden="true" />WhatsApp Coexistence</span>
        <span><CreditCard size={18} weight="fill" aria-hidden="true" />Razorpay and Cashfree payment links</span>
      </section>

      {/* Journeys */}
      <section id="how-it-works" className={styles.journeySection}>
        <div className={base.sectionHead}>
          <a href="#journey-board" className={base.challengeBadge}><Sparkle size={16} weight="fill" aria-hidden="true" /><span>Every store moment</span><b>Tap a flow</b></a>
          <h2>The right message, right when it matters.</h2>
          <p>A cart left behind, a COD order, a shipped parcel, a question about a product. Pick one and watch the flow run.</p>
        </div>
        <div className={styles.journeyBoard} id="journey-board">
          <div className={styles.journeyTabs} role="tablist" aria-label="WhatsApp flows">
            {journeys.map((item, index) => {
              const Icon = item.icon;
              return <button key={item.id} type="button" role="tab" aria-selected={journey === index} onClick={() => { setJourney(index); trackEvent("workflow_step_clicked", { product: "whatsapp", workflow: item.id }); }}>
                <Icon size={19} weight={journey === index ? "fill" : "regular"} aria-hidden="true" />{item.label}
              </button>;
            })}
          </div>
          <div className={styles.journeyPanel}>
            <div className={styles.flowCard}>
              <p className={styles.flowLabel}>Your flow</p>
              <AnimatePresence mode="wait">
                <motion.ol key={selected.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <li><span className={styles.flowIcon}><selected.icon size={18} weight="fill" aria-hidden="true" /></span><span><small>Trigger</small>{selected.trigger}</span></li>
                  <li><span className={styles.flowIcon}><GitBranch size={18} weight="fill" aria-hidden="true" /></span><span><small>Step</small>{selected.wait}</span></li>
                  <li className={styles.flowActive}><span className={styles.flowIcon}><WhatsappLogo size={18} weight="fill" aria-hidden="true" /></span><span><small>WhatsApp</small>{selected.action}</span></li>
                  <li className={styles.flowResult}><span className={styles.flowIcon}><CheckCircle size={18} weight="fill" aria-hidden="true" /></span><span><small>Result</small>{selected.result}</span></li>
                </motion.ol>
              </AnimatePresence>
              <p className={styles.flowNote}>Your rules, your timing, your brand voice.</p>
            </div>
            <div className={styles.journeyPhone}><PhoneMock journeyIndex={journey} /></div>
          </div>
          <p className={base.sampleNote}>Example conversations for illustration.</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.featureSection}>
        <div className={base.sectionHead}>
          <p className={base.eyebrowLight}>Your WhatsApp toolkit</p>
          <h2>Everything a D2C brand needs. Every feature included.</h2>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return <motion.article key={feature.title} className={`${styles.featureCard} ${feature.big ? styles.featureBig : ""}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: (index % 4) * 0.06 }}>
              <span className={styles.featureIcon}><Icon size={22} weight="duotone" aria-hidden="true" /></span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              {index === 0 && <div className={styles.campaignMini} aria-hidden="true"><small>NEW DROP · Scheduled 7:00 pm</small><strong>Something good just landed.</strong><span><Checks size={14} weight="bold" />Delivered · Read</span></div>}
              {index === 1 && <div className={styles.inboxMini} aria-hidden="true"><span className={styles.miniAvatar}>K</span><span><strong>Kavya M.</strong><small>Can I exchange XL for XXL?</small></span><b>Assigned to you</b></div>}
            </motion.article>;
          })}
        </div>
      </section>

      {/* Coexistence + Direct Message highlight */}
      <section className={styles.highlightSection}>
        <div className={styles.highlightGrid}>
          <article>
            <span className={styles.highlightIcon}><DeviceMobile size={26} weight="duotone" aria-hidden="true" /></span>
            <p className={base.eyebrow}>WhatsApp Coexistence</p>
            <h3>Keep your WhatsApp Business app.</h3>
            <p>Your team can keep chatting from the app on the same number, while broadcasts, flows and the shared inbox run on the official API.</p>
          </article>
          <article>
            <span className={styles.highlightIcon}><PaperPlaneTilt size={26} weight="duotone" aria-hidden="true" /></span>
            <p className={base.eyebrow}>Direct Message</p>
            <h3>The 24-hour window is not the end.</h3>
            <p>A buyer went quiet three days ago? Reach them again with Direct Message, even after WhatsApp’s 24-hour window has closed.</p>
          </article>
        </div>
      </section>

      {/* Setup */}
      <section className={base.trialSection}>
        <div className={base.sectionHead}>
          <p className={base.eyebrowLight}>14-day free trial</p>
          <h2>From sign-up to your first campaign.</h2>
        </div>
        <ol className={base.trialTimeline}>
          {[
            { day: "Step 1", title: "Connect your store", text: "Bring your Shopify or WooCommerce store. Orders, products and customers sync in.", icon: Storefront },
            { day: "Step 2", title: "Connect WhatsApp", text: "Link your number to the official API. With Coexistence you can keep the Business app.", icon: WhatsappLogo },
            { day: "Step 3", title: "Switch on flows", text: "Turn on cart recovery, COD confirmation and order updates, and import opted-in contacts.", icon: GitBranch },
            { day: "Step 4", title: "Send and reply", text: "Launch your first campaign and reply as a team from one inbox. Decide on day 14.", icon: Megaphone },
          ].map((step, index) => {
            const Icon = step.icon;
            return <motion.li key={step.day} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: index * 0.1 }}>
              <span className={`${base.trialIcon} ${styles.greenIcon}`}><Icon size={22} weight="duotone" /></span>
              <small>{step.day}</small>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </motion.li>;
          })}
        </ol>
        <p className={styles.setupNote}>Our team helps with onboarding. Meta business verification and template approvals apply.</p>
      </section>

      {/* Pricing */}
      <section id="pricing" className={styles.pricingSection}>
        <div className={styles.pricingCopy}>
          <p className={base.eyebrow}>One plan. The whole toolkit.</p>
          <h2>Try everything free. Then one simple price.</h2>
          <p>You are building a brand. Your WhatsApp tool should leave room for it to grow.</p>
          <p className={styles.pricingShield}><ShieldCheck size={22} weight="fill" aria-hidden="true" />Powered by the official WhatsApp Business API.</p>
        </div>
        <div className={styles.priceCard}>
          <div className={styles.priceTop}><span>WhatsApp for D2C</span><b>All features</b></div>
          <p className={styles.trialLine}>14 days free, then</p>
          <p className={styles.price}>₹999<span>/month</span></p>
          <a href="#get-started" className={`${base.trialButton} ${styles.greenButton}`} onClick={() => cta("pricing")}>Start 14-day free trial <ArrowRight size={17} weight="bold" aria-hidden="true" /></a>
          <ul>{included.map((item) => <li key={item}><Check size={16} weight="bold" aria-hidden="true" />{item}</li>)}</ul>
          <p className={styles.billingNote}><strong>A clear view of your bill.</strong> ₹999/month covers the platform. WhatsApp messaging charges are billed separately; taxes and usage rates are explained before activation.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={base.faqSection}>
        <div className={base.sectionHead}><p className={base.eyebrow}>FAQ</p><h2>A few things you might be asking.</h2></div>
        <div className={base.faqList}>
          {faqs.map(([question, answer]) => <details key={question} onToggle={(event) => { if (event.currentTarget.open) trackEvent("faq_opened", { product: "whatsapp", question }); }}>
            <summary>{question}<CaretDown size={18} aria-hidden="true" /></summary>
            <p>{answer}</p>
          </details>)}
        </div>
      </section>

      {/* Sign-up */}
      <section id="get-started" className={`${base.finalSection} ${styles.finalSection}`}>
        <div className={base.finalInner}>
          <div className={base.finalCopy}>
            <p className={base.eyebrowLight}>Start today</p>
            <h2>Your store’s WhatsApp, sorted. Free for 14 days.</h2>
            <ul>
              <li><CheckCircle size={20} weight="fill" aria-hidden="true" />Every WhatsApp feature included</li>
              <li><CheckCircle size={20} weight="fill" aria-hidden="true" />Help connecting your store and number</li>
              <li><CheckCircle size={20} weight="fill" aria-hidden="true" />Small brands welcome</li>
              <li><CheckCircle size={20} weight="fill" aria-hidden="true" />₹999/month after the trial</li>
            </ul>
          </div>
          <div className={styles.formCard}>
            {submission === "success"
              ? <div className={styles.success} role="status">
                <span><Check size={34} weight="bold" aria-hidden="true" /></span>
                <h3>You’re in.</h3>
                <p>We have your request. Our team will contact you on the details you shared to start your free trial and connect your store.</p>
                <a href="#features" className={base.leakLink}>Explore your WhatsApp toolkit <ArrowRight size={16} aria-hidden="true" /></a>
              </div>
              : <form onSubmit={submit}>
                <h3>Start your 14-day free trial</h3>
                <p className={styles.formSub}>Takes 30 seconds. No setup fee.</p>
                <div className={styles.formGrid}>
                  <label>Your name<input name="name" autoComplete="name" placeholder="Aanya Sharma" maxLength={120} required /></label>
                  <label>Work email<input name="email" type="email" autoComplete="email" placeholder="you@yourbrand.com" maxLength={254} required /></label>
                </div>
                <label>WhatsApp number<span className={styles.phoneField}><span>+91</span><input name="whatsapp" type="tel" autoComplete="tel-national" inputMode="numeric" pattern="[6-9][0-9]{9}" title="Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9" placeholder="9876543210" maxLength={10} required /></span></label>
                <div className={styles.formGrid}>
                  <label>Store website<input name="storeUrl" autoComplete="url" placeholder="yourbrand.com" maxLength={500} required /></label>
                  <label>Store platform<select name="storePlatform" defaultValue="" required><option value="" disabled>Select platform</option><option value="shopify">Shopify</option><option value="woocommerce">WooCommerce</option></select></label>
                </div>
                {submission === "error" && <p className={styles.formError} role="alert">{error}</p>}
                <button type="submit" className={`${base.trialButton} ${styles.greenButton}`} disabled={submission === "sending"}>{submission === "sending" ? "Sending…" : "Start free trial"}<ArrowRight size={17} weight="bold" aria-hidden="true" /></button>
                <small className={styles.formLegal}>By submitting, you agree to be contacted about WhatsApp onboarding. Messaging charges are extra.</small>
              </form>}
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
    <div className={`${styles.mobileBar} ${showBar ? styles.mobileBarVisible : ""}`} aria-hidden={!showBar}>
      <span><strong>14 days free</strong><small>then ₹999/month</small></span>
      <a href="#get-started" onClick={() => cta("mobile_sticky")}>Start free trial <ArrowRight size={16} aria-hidden="true" /></a>
    </div>
  </div>;
}
