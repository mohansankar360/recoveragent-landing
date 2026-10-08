"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle,
  Headphones,
  List,
  Pause,
  Play,
  ShieldCheck,
  Storefront,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CALL_SCRIPTS, type CallJourneyId } from "@/lib/call-scripts";
import { PRICING_TIERS } from "@/lib/calculator";
import { trackEvent } from "@/lib/analytics";
import { DemoBooking } from "./DemoBooking";
import styles from "./RevenueRecoveryHomepage.module.css";

type Journey = {
  id: CallJourneyId;
  short: string;
  eyebrow: string;
  title: string;
  problem: string;
  trigger: string;
  customer: string;
  intent: string;
  action: string;
  result: string;
  accent: string;
};

const JOURNEYS: Journey[] = [
  {
    id: "cod",
    short: "COD",
    eyebrow: "Before dispatch",
    title: "Confirm the order. Catch the exception.",
    problem:
      "A COD order is expensive to discover was unwanted only after it comes back.",
    trigger: "New COD order",
    customer: "Address change karna hai.",
    intent: "Address change requested",
    action: "Flagged for team review",
    result: "Exception visible before fulfilment",
    accent: "#ec8d42",
  },
  {
    id: "abandoned",
    short: "Checkout",
    eyebrow: "While intent is still warm",
    title: "Find the reason the checkout stopped.",
    problem:
      "A reminder cannot answer a size, delivery, payment, or product question.",
    trigger: "Checkout abandoned",
    customer: "Size ko lekar confused tha.",
    intent: "Product question",
    action: "Options sent on WhatsApp",
    result: "Checkout follow-up ready",
    accent: "#8d74f6",
  },
  {
    id: "ndr",
    short: "NDR",
    eyebrow: "Before the shipment returns",
    title: "Turn a failed attempt into a clear next step.",
    problem:
      "An NDR status tells you delivery failed. It does not tell you what the buyer wants next.",
    trigger: "Delivery attempt failed",
    customer: "Kal 6 baje ke baad bhej do.",
    intent: "Reattempt requested",
    action: "Reattempt outcome recorded",
    result: "Ops team sees the requested slot",
    accent: "#3f8ee8",
  },
];

const NAV_ITEMS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#real-call", label: "Hear a call" },
  { href: "#control-room", label: "Product" },
  { href: "#pricing", label: "Pricing" },
];

const TRUST_POINTS = [
  "Shopify and WooCommerce workflows",
  "Hindi and Indian-language conversations",
  "Recordings, outcomes, notes, and audit history",
];

function analyticsClick(source: string) {
  trackEvent("cta_clicked", { source });
}

function CtaPair({ source }: { source: string }) {
  return (
    <div className={styles.ctaPair}>
      <Link
        className={styles.primaryButton}
        href="#demo-booking"
        onClick={() => {
          analyticsClick(source);
          if (source === "hero") trackEvent("hero_book_demo_clicked");
        }}
      >
        Book a 30-minute demo <ArrowRight size={17} weight="bold" aria-hidden />
      </Link>
      <a
        className={styles.secondaryButton}
        href="#real-call"
        onClick={() => analyticsClick(`${source}_hear_call`)}
      >
        <Play size={15} weight="fill" aria-hidden /> Hear a real call
      </a>
    </div>
  );
}

function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className={styles.siteHeader}>
      <div className={styles.navInner}>
        <Link href="/" aria-label="Recover Agent home" className={styles.logoLink}>
          <Image
            src="/recover-agent-logo-transparent.png"
            width={174}
            height={42}
            priority
            alt="Recover Agent"
            className={styles.logo}
          />
        </Link>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          className={styles.navCta}
          href="#demo-booking"
          onClick={() => analyticsClick("navigation")}
        >
          Book a demo <ArrowRight size={15} weight="bold" aria-hidden />
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </div>

      {open && (
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href="#demo-booking" onClick={() => { analyticsClick("mobile_navigation"); setOpen(false); }}>Book a 30-minute demo</a>
        </nav>
      )}
    </header>
  );
}

function JourneyTabs({
  value,
  onChange,
  label,
}: {
  value: CallJourneyId;
  onChange: (value: CallJourneyId) => void;
  label: string;
}) {
  return (
    <div className={styles.tabs} role="tablist" aria-label={label}>
      {JOURNEYS.map((journey) => (
        <button
          key={journey.id}
          type="button"
          role="tab"
          aria-selected={value === journey.id}
          className={value === journey.id ? styles.activeTab : ""}
          onClick={() => onChange(journey.id)}
        >
          {journey.short}
        </button>
      ))}
    </div>
  );
}

function WorkflowPreview({ journey }: { journey: Journey }) {
  return (
    <div className={styles.productWindow}>
      <div className={styles.windowBar}>
        <span className={styles.windowTitle}>Recovery queue</span>
        <span className={styles.livePill}><i /> Live workflow</span>
      </div>
      <div className={styles.orderRow}>
        <div>
          <span className={styles.fieldLabel}>EVENT</span>
          <strong>{journey.trigger}</strong>
        </div>
        <span className={styles.orderId}>Sample order #1842</span>
      </div>
      <div className={styles.conversation}>
        <span className={styles.avatar}>RA</span>
        <div>
          <span className={styles.fieldLabel}>CUSTOMER SAID</span>
          <p>“{journey.customer}”</p>
        </div>
      </div>
      <div className={styles.outcomeGrid}>
        <div>
          <span className={styles.fieldLabel}>UNDERSTOOD</span>
          <strong>{journey.intent}</strong>
        </div>
        <div>
          <span className={styles.fieldLabel}>NEXT STEP</span>
          <strong>{journey.action}</strong>
        </div>
      </div>
      <div className={styles.resultBar}>
        <CheckCircle size={18} weight="fill" aria-hidden />
        <span>{journey.result}</span>
        <span className={styles.synced}>Outcome saved</span>
      </div>
      <p className={styles.sampleNote}>Illustrative workflow using product-supported statuses and actions.</p>
    </div>
  );
}

function Hero() {
  const [journeyId, setJourneyId] = useState<CallJourneyId>("cod");
  const journey = JOURNEYS.find((item) => item.id === journeyId) ?? JOURNEYS[0];

  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden />
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>Revenue recovery for Indian D2C</div>
          <h1>Turn at-risk orders into <span>confirmed revenue.</span></h1>
          <p className={styles.heroLead}>
            Recover Agent calls customers when COD orders, abandoned checkouts, or failed deliveries need action—understands what they want, follows up on WhatsApp, and gives your team the next step.
          </p>
          <CtaPair source="hero" />
          <ul className={styles.heroTrust}>
            {TRUST_POINTS.map((point) => (
              <li key={point}><Check size={14} weight="bold" aria-hidden /> {point}</li>
            ))}
          </ul>
        </div>

        <div className={styles.heroProduct}>
          <div className={styles.heroProductHead}>
            <div>
              <span className={styles.overline}>SEE THE CLOSED LOOP</span>
              <strong>Not just a call. A usable outcome.</strong>
            </div>
            <span className={styles.securePill}><ShieldCheck size={15} weight="fill" /> Merchant view</span>
          </div>
          <JourneyTabs value={journeyId} onChange={setJourneyId} label="Choose a recovery workflow" />
          <WorkflowPreview journey={journey} />
        </div>
      </div>
      <div className={styles.heroFoot}>
        <span>VOICE</span><i /> <span>WHATSAPP</span><i /> <span>RECOVERY DASHBOARD</span>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className={styles.problemSection} id="how-it-works">
      <div className={styles.sectionIntro}>
        <div className={styles.eyebrow}>Three moments. One recovery system.</div>
        <h2>Revenue does not disappear in one place.</h2>
        <p>It leaks before dispatch, during checkout, and after a failed delivery. Recover Agent gives each moment a conversation and a next step.</p>
      </div>
      <div className={styles.problemList}>
        {JOURNEYS.map((journey, index) => (
          <article className={styles.problemRow} key={journey.id}>
            <span className={styles.problemNumber}>0{index + 1}</span>
            <div className={styles.problemMain}>
              <span className={styles.problemEyebrow}>{journey.eyebrow}</span>
              <h3>{journey.title}</h3>
            </div>
            <p>{journey.problem}</p>
            <div className={styles.problemOutcome}>
              <span>RECOVERY OUTCOME</span>
              <strong>{journey.action}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LoopSection() {
  const steps = [
    ["01", "Event", "A COD order, abandoned checkout, or NDR enters the queue."],
    ["02", "Conversation", "The agent calls with order, product, and workflow context."],
    ["03", "Intent", "The response becomes a clear outcome your team can use."],
    ["04", "Next step", "A configured follow-up is triggered, routed, or flagged."],
  ];

  return (
    <section className={styles.loopSection}>
      <div className={styles.loopHeader}>
        <div>
          <div className={styles.eyebrow}>The mechanism</div>
          <h2>Customer intent should not die inside a recording.</h2>
        </div>
        <p>Recover Agent turns each conversation into structured recovery work—so the next action is visible without your team replaying every call.</p>
      </div>
      <ol className={styles.loopGrid}>
        {steps.map(([number, title, body]) => (
          <li key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>
      <div className={styles.loopProof}>
        <span>ECOMMERCE EVENT</span><ArrowRight aria-hidden />
        <span>AI CONVERSATION</span><ArrowRight aria-hidden />
        <span>CUSTOMER INTENT</span><ArrowRight aria-hidden />
        <strong>OPERATIONAL NEXT STEP</strong>
      </div>
    </section>
  );
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function AudioProof() {
  const [journeyId, setJourneyId] = useState<CallJourneyId>("abandoned");
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(CALL_SCRIPTS.abandoned.durationSec);
  const audioRef = useRef<HTMLAudioElement>(null);
  const startedRef = useRef<Record<string, boolean>>({});
  const script = CALL_SCRIPTS[journeyId];
  const journey = JOURNEYS.find((item) => item.id === journeyId) ?? JOURNEYS[0];

  const bars = useMemo(
    () => Array.from({ length: 64 }, (_, index) => 22 + Math.round(Math.abs(Math.sin(index * 1.71 + journeyId.length)) * 66)),
    [journeyId]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : script.durationSec);
    const onPlay = () => {
      setPlaying(true);
      if (!startedRef.current[journeyId]) {
        startedRef.current[journeyId] = true;
        trackEvent("call_sample_played", { journey: journeyId });
      }
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      trackEvent("call_sample_completed", { journey: journeyId });
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [journeyId, script.durationSec]);

  const changeJourney = useCallback((value: CallJourneyId) => {
    const audio = audioRef.current;
    audio?.pause();
    if (audio) audio.currentTime = 0;
    setCurrent(0);
    setPlaying(false);
    setJourneyId(value);
    setDuration(CALL_SCRIPTS[value].durationSec);
  }, []);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try { await audio.play(); } catch { setPlaying(false); }
    } else {
      audio.pause();
    }
  }, []);

  const progress = duration > 0 ? Math.min(current / duration, 1) : 0;
  const displayedLines = script.lines.slice(0, 3);

  return (
    <section className={styles.audioSection} id="real-call">
      <div className={styles.sectionIntroDark}>
        <div className={styles.eyebrow}>Hear the product</div>
        <h2>Do not take our word for the voice.</h2>
        <p>Play a real recording. Then see the outcome the merchant would receive after the conversation.</p>
      </div>
      <JourneyTabs value={journeyId} onChange={changeJourney} label="Choose a call recording" />
      <div className={styles.audioGrid}>
        <div className={styles.player}>
          <audio key={journeyId} ref={audioRef} src={script.audioSrc} preload="metadata" />
          <div className={styles.playerTop}>
            <div>
              <span className={styles.fieldLabel}>REAL CALL RECORDING</span>
              <strong>{script.recordingLanguage} · {journey.eyebrow}</strong>
            </div>
            <span className={styles.duration}>{formatTime(current)} / {formatTime(duration)}</span>
          </div>
          <div className={styles.waveform} aria-hidden>
            {bars.map((height, index) => (
              <i key={index} className={index / bars.length <= progress ? styles.wavePlayed : ""} style={{ height: `${height}%` }} />
            ))}
          </div>
          <label className={styles.scrubber}>
            <span className={styles.srOnly}>Recording progress</span>
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={progress * 100}
              onChange={(event) => {
                const next = Number(event.target.value) / 100;
                if (audioRef.current) audioRef.current.currentTime = next * duration;
                setCurrent(next * duration);
              }}
            />
          </label>
          <div className={styles.playerActions}>
            <button type="button" onClick={toggle} className={styles.playButton}>
              {playing ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}
              {playing ? "Pause" : current > 0 ? "Resume" : "Play recording"}
            </button>
            <span>{script.recordingNote}</span>
          </div>
        </div>

        <div className={styles.callEvidence}>
          <div className={styles.transcript}>
            <span className={styles.fieldLabel}>SHORT TRANSCRIPT</span>
            {displayedLines.map((line, index) => (
              <div key={`${line.speaker}-${index}`} className={line.speaker === "cust" ? styles.customerLine : styles.agentLine}>
                <span>{line.speaker === "cust" ? "CUSTOMER" : "RECOVER AGENT"}</span>
                <p>{line.translation ?? line.text}</p>
              </div>
            ))}
          </div>
          <div className={styles.callOutcome}>
            <div><span>DETECTED INTENT</span><strong>{journey.intent}</strong></div>
            <div><span>RECOVERY STEP</span><strong>{journey.action}</strong></div>
          </div>
        </div>
      </div>
      <p className={styles.recordingDisclaimer}>Recordings demonstrate the conversation experience. The outcome panel is an illustrative product walkthrough, not a customer-performance claim.</p>
    </section>
  );
}

function ControlRoom() {
  const rows = [
    ["#1842", "COD", "Address change", "Review needed"],
    ["#1839", "Checkout", "Payment options", "Link sent"],
    ["#1834", "NDR", "Reattempt requested", "Outcome saved"],
    ["#1828", "COD", "Order confirmed", "Ready to process"],
  ];

  return (
    <section className={styles.controlSection} id="control-room">
      <div className={styles.controlCopy}>
        <div className={styles.eyebrow}>The recovery control room</div>
        <h2>Your team sees the outcome—not another inbox of calls.</h2>
        <p>Track COD, checkout, and NDR recovery in one operational view. Search the customer, inspect the recording, add a note, retry when appropriate, and see the status history.</p>
        <ul>
          <li><CheckCircle size={18} weight="fill" /> Clear dispositions and intervention queues</li>
          <li><CheckCircle size={18} weight="fill" /> Recordings, summaries, notes, and status history</li>
          <li><CheckCircle size={18} weight="fill" /> Spend, recovered revenue, and ROI views from your own data</li>
        </ul>
        <Link href="/how-it-works" className={styles.textLink}>Explore how it works <ArrowRight size={16} weight="bold" /></Link>
      </div>
      <div className={styles.dashboardShell}>
        <aside>
          <div className={styles.dashMark}>RA</div>
          {['Overview','COD','Checkout','NDR','Flows'].map((item, index) => <span key={item} className={index === 0 ? styles.dashActive : ""}>{item}</span>)}
        </aside>
        <div className={styles.dashMain}>
          <div className={styles.dashTop}>
            <div><span>RECOVERY OPERATIONS</span><h3>Today’s queue</h3></div>
            <button type="button" aria-label="Search orders">⌕ Search</button>
          </div>
          <div className={styles.dashMetrics}>
            <div><span>NEEDS REVIEW</span><strong>—</strong><small>Visible as it happens</small></div>
            <div><span>OUTCOMES SAVED</span><strong>—</strong><small>From connected workflows</small></div>
            <div><span>RECOVERY ROI</span><strong>Live</strong><small>Using your store data</small></div>
          </div>
          <div className={styles.queueTable}>
            <div className={styles.queueHead}><span>ORDER</span><span>JOURNEY</span><span>OUTCOME</span><span>NEXT STEP</span></div>
            {rows.map((row) => (
              <div className={styles.queueRow} key={row[0]}>
                <strong>{row[0]}</strong><span>{row[1]}</span><span>{row[2]}</span><b>{row[3]}</b>
              </div>
            ))}
          </div>
          <p className={styles.sampleNote}>Illustrative view based on live dashboard capabilities. No fabricated merchant metrics.</p>
        </div>
      </div>
    </section>
  );
}

function ConnectedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !tracked.current) {
        trackEvent("integration_viewed");
        tracked.current = true;
      }
    }, { threshold: 0.35 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.connectedSection} ref={sectionRef}>
      <div className={styles.connectedCopy}>
        <div className={styles.eyebrow}>One customer journey</div>
        <h2>Voice finds the intent. WhatsApp carries the next step.</h2>
        <p>A call can resolve the ambiguity. WhatsApp can deliver the checkout link, payment option, reminder, or confirmation. The merchant keeps the customer history and outcome in view.</p>
      </div>
      <div className={styles.channelFlow}>
        <div className={styles.channelCard}>
          <span className={styles.channelIcon}><Headphones size={23} weight="duotone" /></span>
          <small>VOICE</small>
          <strong>“Can I pay online instead?”</strong>
          <p>Payment preference understood during the call.</p>
        </div>
        <div className={styles.flowArrow}><ArrowRight size={22} weight="bold" /></div>
        <div className={`${styles.channelCard} ${styles.whatsappCard}`}>
          <span className={styles.channelIcon}><WhatsappLogo size={23} weight="fill" /></span>
          <small>WHATSAPP</small>
          <strong>Secure payment link sent</strong>
          <p>The follow-up is available in the shared conversation history.</p>
        </div>
        <div className={styles.flowArrow}><ArrowRight size={22} weight="bold" /></div>
        <div className={styles.channelCard}>
          <span className={styles.channelIcon}><Storefront size={23} weight="duotone" /></span>
          <small>RECOVERY DASHBOARD</small>
          <strong>Outcome and next step visible</strong>
          <p>Ops can review the recording, status, notes, and audit trail.</p>
        </div>
      </div>
      <div className={styles.integrationLine}>
        <span>Connects with</span>
        <strong>Shopify</strong><i /> <strong>WooCommerce</strong><i /> <strong>WhatsApp Business</strong>
      </div>
    </section>
  );
}

function TrustSection() {
  const items = [
    ["Unexpected questions", "The agent can use connected product, order, and policy context. Unknown or sensitive cases can be routed for human review."],
    ["Merchant control", "Configure journey timing, retries, quiet hours, workflow stages, and the knowledge the agent can use."],
    ["No call-listening bottleneck", "Each conversation produces an outcome, recording, summary, and status history for the team."],
    ["Buyer language", "Configure Indian-language voices and conversational code-switching for the audience you serve."],
  ];

  return (
    <section className={styles.trustSection}>
      <div className={styles.trustLead}>
        <div className={styles.eyebrow}>Built for customer-facing operations</div>
        <h2>Automation needs boundaries your team can see.</h2>
        <p>Recover Agent is designed around configured recovery workflows, merchant context, visible outcomes, and human review—not an open-ended bot making promises on its own.</p>
      </div>
      <div className={styles.trustRows}>
        {items.map(([title, body], index) => (
          <article key={title}>
            <span>0{index + 1}</span>
            <div><h3>{title}</h3><p>{body}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const tracked = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !tracked.current) {
        trackEvent("pricing_viewed");
        tracked.current = true;
      }
    }, { threshold: 0.35 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.pricingSection} id="pricing" ref={ref}>
      <div className={styles.sectionIntro}>
        <div className={styles.eyebrow}>Published plans</div>
        <h2>Start with the volume you have now.</h2>
        <p>Every plan supports the core recovery journeys. We will help you map the right tier to order volume during the demo.</p>
      </div>
      <div className={styles.pricingGrid}>
        {PRICING_TIERS.map((plan) => (
          <article key={plan.id} className={plan.id === "growth" ? styles.featuredPlan : ""}>
            {plan.id === "growth" && <span className={styles.recommended}>MOST POPULAR</span>}
            <h3>{plan.name}</h3>
            <div className={styles.price}>₹{plan.base.toLocaleString("en-IN")}<span>/month</span></div>
            <p>{plan.includedCalls.toLocaleString("en-IN")} AI voice orders included</p>
            <ul>
              <li><Check size={16} weight="bold" /> COD, checkout, and NDR workflows</li>
              <li><Check size={16} weight="bold" /> Recovery dashboard and call outcomes</li>
              <li><Check size={16} weight="bold" /> WhatsApp recovery workflows available</li>
            </ul>
            <a href="#demo-booking" onClick={() => analyticsClick(`pricing_${plan.id}`)}>Discuss this plan <ArrowRight size={15} weight="bold" /></a>
          </article>
        ))}
      </div>
      <p className={styles.pricingNote}>Additional orders are billed by plan. Final scope depends on configured integrations and workflows.</p>
    </section>
  );
}

function SetupSection() {
  return (
    <section className={styles.setupSection}>
      <div className={styles.setupCopy}>
        <div className={styles.eyebrow}>From store event to recovery queue</div>
        <h2>A practical setup, not a blank AI canvas.</h2>
      </div>
      <ol>
        <li><span>01</span><div><h3>Connect the store</h3><p>Bring Shopify or WooCommerce order events into the recovery workflow.</p></div></li>
        <li><span>02</span><div><h3>Configure the journeys</h3><p>Choose timing, languages, retries, knowledge, and the outcomes your team needs.</p></div></li>
        <li><span>03</span><div><h3>Review before scale</h3><p>Test the experience, inspect outcomes, then expand coverage with merchant controls in place.</p></div></li>
      </ol>
    </section>
  );
}

function FaqSection() {
  const questions = [
    ["Is this just an AI calling tool?", "No. Voice is the conversation layer. Recover Agent also queues ecommerce events, turns calls into clear dispositions, coordinates WhatsApp follow-up, and gives operators one place to review the outcome and next step."],
    ["What happens when the customer asks something unexpected?", "The agent can use configured product, order, and policy context. Questions or exceptions that should not be handled automatically can be marked for intervention or human review."],
    ["Does my team need to listen to every call?", "No. Calls produce a visible outcome with the recording and history available when your team wants to inspect the detail."],
    ["Can it speak Indian languages?", "The voice platform supports multiple Indian-language configurations and code-mixed conversations. The right language and voice setup is selected during implementation."],
    ["Does it work with Shopify and WooCommerce?", "Yes. Both are present in the product. The exact actions available depend on the store, courier, payment, and workflow connections configured for your account."],
    ["How quickly can we start?", "Implementation depends on your store and workflow complexity. The demo is used to map your recovery journeys, integrations, and rollout plan before a go-live commitment is made."],
  ];

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqHead}>
        <div className={styles.eyebrow}>Before you book</div>
        <h2>Questions a D2C operator should ask.</h2>
      </div>
      <div className={styles.faqList}>
        {questions.map(([question, answer], index) => (
          <details key={question} onToggle={(event) => {
            if ((event.currentTarget as HTMLDetailsElement).open) trackEvent("faq_opened", { question: index });
          }}>
            <summary><span>{question}</span><b>+</b></summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div>
        <Image src="/recover-agent-logo-transparent.png" width={158} height={38} alt="Recover Agent" />
        <p>Revenue recovery operations for Indian D2C.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/cod-confirmation">COD confirmation</Link>
        <Link href="/abandoned-checkout">Abandoned checkout</Link>
        <Link href="/ndr-recovery">NDR recovery</Link>
        <Link href="/loss-calculator">RTO loss calculator</Link>
        <Link href="/blog">Blog</Link>
      </nav>
      <span>© {new Date().getFullYear()} Recover Agent</span>
    </footer>
  );
}

function MobileDemoBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 520);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.mobileDemoBar}>
      <span><strong>Recover more orders.</strong><small>See the workflow live.</small></span>
      <a href="#demo-booking" onClick={() => trackEvent("sticky_cta_clicked", { source: "mobile_sticky" })}>Book demo</a>
    </div>
  );
}

export function RevenueRecoveryHomepage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <LoopSection />
        <AudioProof />
        <ControlRoom />
        <ConnectedSection />
        <TrustSection />
        <PricingSection />
        <SetupSection />
        <FaqSection />
        <div className={styles.demoWrap}>
          <DemoBooking compact />
        </div>
      </main>
      <SiteFooter />
      <MobileDemoBar />
    </div>
  );
}
