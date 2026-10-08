'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight,
  Brain,
  CalendarBlank,
  CaretDown,
  ChartLineUp,
  Check,
  CheckCircle,
  ClockCountdown,
  List,
  Link as LinkIcon,
  Package,
  PhoneCall,
  Play,
  Storefront,
  Truck,
  UserSwitch,
  WhatsappLogo,
  X,
} from '@phosphor-icons/react';
import { DemoBooking } from './DemoBooking';
import { ControlRoomDemo } from './ControlRoomDemo';
import { Footer } from './Footer';
import { faqs } from '@/lib/faq-data';
import { LossCalculator } from './LossCalculator';
import { PRICING_TIERS } from '@/lib/calculator';
import { ALL_PLANS_WHATSAPP, PLAN_FEATURE_ROWS, PLAN_FEATURES } from '@/lib/pricing-plans';
import { trackEvent } from '@/lib/analytics';
import styles from './ConversionHomepage.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type JourneyKey = 'cod' | 'checkout' | 'ndr';

type Journey = {
  label: string;
  title: string;
  trigger: string;
  conversation: string;
  intents: string[];
  action: string;
  result: string;
  audio: string;
  language: string;
  icon: typeof Package;
};

const journeys: Record<JourneyKey, Journey> = {
  cod: {
    label: 'COD confirmation',
    title: 'Confirm before you ship.',
    trigger: 'COD order placed',
    conversation: 'AI confirms the order and address.',
    intents: ['Confirmed', 'Cancel', 'Address issue', 'Unreachable'],
    action: 'Confirmed orders go to fulfilment review.',
    result: 'Reduce avoidable RTO.',
    audio: '/audio/COD_hindi.mp4',
    language: 'Hindi',
    icon: Package,
  },
  checkout: {
    label: 'Abandoned checkout',
    title: 'Bring shoppers back.',
    trigger: 'Checkout abandoned',
    conversation: 'AI answers questions and resolves hesitation.',
    intents: ['Will purchase', 'Needs help', 'Not interested', 'Call back'],
    action: 'Send the checkout link on WhatsApp.',
    result: 'Recover missed orders.',
    audio: '/audio/abandoned_hindi.mp3',
    language: 'Hindi',
    icon: Storefront,
  },
  ndr: {
    label: 'NDR recovery',
    title: 'Give delivery another chance.',
    trigger: 'Delivery attempt failed',
    conversation: 'AI checks what went wrong.',
    intents: ['Reattempt', 'Reschedule', 'Address issue', 'Cancel'],
    action: 'Share the next step with your team.',
    result: 'Resolve failed deliveries before RTO.',
    audio: '/audio/NDR_english.mp4',
    language: 'English',
    icon: Truck,
  },
};

const heroFlows: Record<JourneyKey, {
  context: string;
  goal: string;
  nodes: Array<{ title: string; icon: typeof Package }>;
  outcome: string;
}> = {
  cod: {
    context: 'Order #1042 · ₹1,499 · Cash on delivery',
    goal: 'Confirm before dispatch.',
    nodes: [
      { title: 'COD order placed', icon: Package },
      { title: 'AI calls buyer', icon: PhoneCall },
      { title: 'Intent captured', icon: Brain },
      { title: 'Outcome saved', icon: CheckCircle },
    ],
    outcome: 'Order confirmed · Ready to dispatch',
  },
  checkout: {
    context: 'Checkout #AC-214 · ₹3,450 · Payment incomplete',
    goal: 'Recover the checkout.',
    nodes: [
      { title: 'Checkout abandoned', icon: Storefront },
      { title: 'AI calls shopper', icon: PhoneCall },
      { title: 'Checkout link sent', icon: LinkIcon },
      { title: 'Completion tracked', icon: ChartLineUp },
    ],
    outcome: 'Link sent · Awaiting checkout completion',
  },
  ndr: {
    context: 'Shipment #NDR-82 · Delivery attempt failed',
    goal: 'Resolve the failed delivery.',
    nodes: [
      { title: 'Delivery failed', icon: Truck },
      { title: 'AI calls buyer', icon: PhoneCall },
      { title: 'Reattempt requested', icon: ClockCountdown },
      { title: 'Request saved', icon: UserSwitch },
    ],
    outcome: 'Reattempt requested · Awaiting delivery action',
  },
};

function PrimaryButton({ onClick, compact = false, children = 'Book a demo', icon = <ArrowRight size={17} weight="bold" aria-hidden /> }: { onClick: () => void; compact?: boolean; children?: React.ReactNode; icon?: React.ReactNode }) {
  return <button type="button" className={`${styles.primaryButton} ${compact ? styles.compactButton : ''}`} onClick={onClick}>{children}{icon}</button>;
}

function Header({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const close = () => setOpen(false);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    const onOutsideInteraction = (event: Event) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 901px)');
    const onBreakpointChange = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onOutsideInteraction);
    document.addEventListener('focusin', onOutsideInteraction);
    desktop.addEventListener('change', onBreakpointChange);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onOutsideInteraction);
      document.removeEventListener('focusin', onOutsideInteraction);
      desktop.removeEventListener('change', onBreakpointChange);
    };
  }, [open]);
  return <header ref={headerRef} className={styles.header}>
    <a href="#top" className={styles.brand} aria-label="RecoverAgent home" onClick={close}>
      <Image src="/recover-agent-logo-transparent.png" width={500} height={250} alt="RecoverAgent" priority />
    </a>
    <nav className={styles.desktopNav} aria-label="Primary navigation">
      <a href="#workflows">How it works</a>
      <a href="#call">Hear a call</a>
      <a href="#results">Results</a>
      <a href="#product">Dashboard</a>
      <a href="#calc">Loss calculator</a>
      <a href="#pricing">Pricing</a>
    </nav>
    <PrimaryButton onClick={onBook} compact />
    <button ref={menuButtonRef} type="button" className={styles.menuButton} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="homepage-mobile-navigation" onClick={() => setOpen((value) => !value)}>{open ? <X size={22} aria-hidden="true" /> : <List size={22} aria-hidden="true" />}</button>
    <AnimatePresence>
      {open && <motion.nav id="homepage-mobile-navigation" className={styles.mobileNav} aria-label="Mobile navigation" initial={reduceMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}>
        <a href="#workflows" onClick={close}>How it works</a>
        <a href="#call" onClick={close}>Hear a call</a>
        <a href="#results" onClick={close}>Results</a>
        <a href="#product" onClick={close}>Dashboard</a>
        <a href="#calc" onClick={close}>Loss calculator</a>
        <a href="#pricing" onClick={close}>Pricing</a>
        <button type="button" onClick={() => { close(); onBook(); }}>Book a demo <ArrowRight size={16} /></button>
      </motion.nav>}
    </AnimatePresence>
  </header>;
}

function HeroRecording({ journey, playRef }: { journey: JourneyKey; playRef: React.MutableRefObject<(() => void) | null> }) {
  const item = journeys[journey];
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const syncDuration = () => setDuration(Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0);
    // Metadata can arrive before hydration attaches React event handlers.
    syncDuration();
    audio.addEventListener('loadedmetadata', syncDuration);
    audio.addEventListener('durationchange', syncDuration);
    return () => { audio.pause(); audio.removeEventListener('loadedmetadata', syncDuration); audio.removeEventListener('durationchange', syncDuration); };
  }, []);
  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    setError('');
    if (audio.ended) audio.currentTime = 0;
    try { await audio.play(); } catch { setPlaying(false); setError('Could not play the recording. Please try again.'); }
  };
  const playRecording = async () => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    setError('');
    if (audio.ended) audio.currentTime = 0;
    try { await audio.play(); } catch { setPlaying(false); setError('Could not play the recording. Please try again.'); }
  };
  playRef.current = playRecording;
  const format = (value: number) => `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, '0')}`;
  return <div className={`${styles.voiceAgent} ${styles.voiceAgentInline}`}>
    <div className={styles.voiceAgentHeader}>
      <div><strong>Listen to a real AI call</strong><small>{item.label} · {item.language}</small></div>
    </div>
    <div className={styles.heroRecordingControls}>
      <button type="button" className={styles.playButton} onClick={toggle} aria-label={playing ? 'Pause recording' : 'Play recording'}>{playing ? <span className={styles.pauseBars}><i /><i /></span> : <Play size={21} weight="fill" />}</button>
      <input aria-label="Recording progress" aria-valuetext={`${format(progress)} of ${format(duration)}`} style={{ '--recording-progress': `${duration ? (progress / duration) * 100 : 0}%` } as React.CSSProperties} type="range" min="0" max={duration || 1} step="0.1" value={progress} disabled={!duration} onChange={(event) => {
        const value = Number(event.target.value);
        if (audioRef.current) audioRef.current.currentTime = value;
        setProgress(value);
      }} />
      <span className={styles.heroRecordingTime}>{duration ? `${format(progress)} / ${format(duration)}` : 'Loading audio…'}</span>
    </div>
    {error && <p className={styles.heroRecordingError} role="alert">{error}</p>}
    <audio ref={audioRef} src={item.audio} preload="metadata" onLoadedMetadata={(event) => { const value = event.currentTarget.duration; setDuration(Number.isFinite(value) ? value : 0); }} onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setError('Recording unavailable. Please try again.')} />
  </div>;
}

function RecoveryRun({ playRef }: { playRef: React.MutableRefObject<(() => void) | null> }) {
  const [journey, setJourney] = useState<JourneyKey>('cod');
  const [stage, setStage] = useState(1);
  const flow = heroFlows[journey];
  const selectJourney = (key: JourneyKey) => {
    if (key === journey) return;
    setStage(1);
    setJourney(key);
  };
  return <div id="call" className={styles.heroProduct} aria-label="Interactive recovery workflow">
    <div className={styles.productTop}>
      <span><i /> AI voice agent preview</span>
      <span>Example workflow</span>
    </div>
    <div className={styles.journeyTabs} role="tablist" aria-label="Recovery journey">
      {(Object.keys(journeys) as JourneyKey[]).map((key, index, keys) => <button key={key} id={`hero-tab-${key}`} type="button" role="tab" aria-controls="hero-flow-panel" aria-selected={journey === key} tabIndex={journey === key ? 0 : -1} onClick={() => selectJourney(key)} onKeyDown={(event) => {
        let target: JourneyKey | undefined;
        if (event.key === 'ArrowRight') target = keys[(index + 1) % keys.length];
        if (event.key === 'ArrowLeft') target = keys[(index + keys.length - 1) % keys.length];
        if (event.key === 'Home') target = keys[0];
        if (event.key === 'End') target = keys[keys.length - 1];
        if (target) { event.preventDefault(); selectJourney(target); document.getElementById(`hero-tab-${target}`)?.focus(); }
      }}>{journeys[key].label}</button>)}
    </div>
    <div id="hero-flow-panel" role="tabpanel" aria-labelledby={`hero-tab-${journey}`} tabIndex={0}>
    <div className={styles.runContext}><strong>{flow.goal}</strong><small>{flow.context}</small></div>
    <HeroRecording key={journey} journey={journey} playRef={playRef} />
    <p className={styles.runOutcome}><Check size={15} weight="bold" aria-hidden="true" /><span>{flow.outcome}</span></p>
    <div className={styles.runCaption}><strong>Sample workflow</strong><span>Step {stage} of 4</span></div>
    <div className={styles.runTimeline}>
      {flow.nodes.map((node, index) => {
        const Icon = node.icon;
        const active = stage === index + 1;
        const complete = stage > index + 1 || stage === 4;
        return <button type="button" key={node.title} aria-pressed={active} onClick={() => setStage(index + 1)} className={`${styles.runNode} ${active ? styles.runNodeActive : ''} ${complete ? styles.runNodeComplete : ''}`}>
          <span className={styles.runIcon}>{complete ? <Check size={17} weight="bold" /> : <Icon size={19} weight="duotone" />}</span>
          <span><strong>{node.title}</strong></span>
        </button>;
      })}
    </div>
    </div>
  </div>;
}

function Hero({ onBook }: { onBook: () => void }) {
  const playRef = useRef<(() => void) | null>(null);
  const hearCall = () => {
    document.getElementById('call')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    playRef.current?.();
  };
  return <section className={styles.hero} id="top">
    <div className={styles.heroCopy} data-reveal>
      <div className={styles.shopifyHeroBadge}>
        <span className={styles.integrationLogo}>
          <Image src="/shopify-logo.svg" width={112} height={32} alt="Shopify" priority />
        </span>
        <span className={styles.integrationLogo}>
          <Image src="/woocommerce-logo.png" width={90} height={24} alt="WooCommerce" priority />
        </span>
        <span className={styles.integrationTagline}>Built for Indian D2C brands</span>
      </div>
      <h1>Reduce RTO.<br />Deliver more orders.</h1>
      <p className={styles.heroLead}>AI calls confirm COD orders, recover abandoned checkouts and resolve failed deliveries. WhatsApp carries the follow-up.</p>
      <div className={styles.heroActions}><PrimaryButton onClick={hearCall} icon={<Play size={17} weight="fill" aria-hidden />}>Hear the AI call</PrimaryButton><button type="button" className={styles.secondaryButton} onClick={onBook}>Book a demo <CalendarBlank size={18} weight="bold" aria-hidden /></button></div>
    </div>
    <div data-reveal><RecoveryRun playRef={playRef} /></div>
  </section>;
}

function ProductProofStrip() {
  return <section className={styles.proofStrip} aria-label="Verified product capabilities" data-reveal>
    <span><PhoneCall size={20} /><strong>AI conversations</strong><small>Indian-language configurations</small></span>
    <span><WhatsappLogo size={20} /><strong>WhatsApp follow-up</strong><small>Links, updates, and reminders</small></span>
    <span><UserSwitch size={20} /><strong>Human handoff</strong><small>For any escalation needed</small></span>
  </section>;
}

function WorkflowSection() {
  const [active, setActive] = useState<JourneyKey>('cod');
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const journeyKeys: JourneyKey[] = ['cod', 'checkout', 'ndr'];
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 901px)',
      mobile: '(max-width: 900px)',
      motion: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      if (!context.conditions?.motion) return;
      const mobile = context.conditions.mobile;
      const track = sectionRef.current?.querySelector<HTMLElement>('[data-workflow-track]');
      const layout = track?.firstElementChild as HTMLElement | null;
      if (!track || !layout) return;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: mobile ? 'top 78px' : 'top 90px',
          end: () => `+=${track.offsetHeight - layout.offsetHeight}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(journeyKeys[Math.min(2, Math.floor(self.progress * 3))]),
        },
      });
      scrollTriggerRef.current = timeline.scrollTrigger ?? null;
      // Each layer moves at a different speed as the sticky panel progresses.
      timeline.fromTo('[data-workflow-title]', { y: mobile ? 6 : 18 }, { y: mobile ? -6 : -18, ease: 'none' }, 0)
        .fromTo('[data-workflow-path]', { y: mobile ? 10 : 28 }, { y: mobile ? -10 : -28, ease: 'none' }, 0)
        .fromTo('[data-workflow-outcome]', { y: mobile ? 14 : 38 }, { y: mobile ? -14 : -38, ease: 'none' }, 0);
      return () => { scrollTriggerRef.current = null; };
    });
    return () => media.revert();
  }, { scope: sectionRef });
  const selectJourney = (key: JourneyKey) => {
    setActive(key);
    const trigger = scrollTriggerRef.current;
    if (trigger) {
      const progress = (journeyKeys.indexOf(key) + 0.5) / journeyKeys.length;
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'smooth' });
    }
  };
  const item = journeys[active];
  const Icon = item.icon;
  return <section ref={sectionRef} className={styles.section} id="workflows">
    <div className={styles.sectionHeading} data-reveal><h2>Three ways to recover revenue.</h2><p>AI calls for COD, abandoned carts and failed deliveries.</p></div>
    <div className={styles.workflowTrack} data-workflow-track>
    <div className={styles.workflowLayout}>
      <div className={styles.workflowIndex} role="tablist" aria-label="Recovery workflows">
        {journeyKeys.map((key, index) => { const JourneyIcon = journeys[key].icon; return <button key={key} id={`workflow-tab-${key}`} aria-controls="workflow-panel" type="button" role="tab" aria-selected={active === key} tabIndex={active === key ? 0 : -1} onClick={() => selectJourney(key)} onKeyDown={(event) => { let next: number | undefined; if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % journeyKeys.length; if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + journeyKeys.length - 1) % journeyKeys.length; if (event.key === "Home") next = 0; if (event.key === "End") next = journeyKeys.length - 1; if (next !== undefined) { event.preventDefault(); selectJourney(journeyKeys[next]); document.getElementById(`workflow-tab-${journeyKeys[next]}`)?.focus(); } }}><span><JourneyIcon size={22} /></span><strong>{journeys[key].label}</strong><ArrowRight size={17} /></button>; })}
      </div>
      <div className={styles.workflowDetail} role="tabpanel" id="workflow-panel" aria-labelledby={`workflow-tab-${active}`}>
        <div className={styles.workflowTitle} data-workflow-title><span><Icon size={27} weight="duotone" /></span><h3>{item.title}</h3></div>
        <div className={styles.workflowPath} data-workflow-path>
          <article><small>Trigger</small><strong>{item.trigger}</strong></article>
          <ArrowRight size={18} aria-hidden="true" />
          <article><small>Conversation</small><strong>{item.conversation}</strong></article>
          <ArrowRight size={18} aria-hidden="true" />
          <article><small>Action</small><strong>{item.action}</strong></article>
        </div>
        <div data-workflow-outcome>
          <div className={styles.intentBar}><span>Customer intent</span>{item.intents.map((intent) => <b key={intent}>{intent}</b>)}</div>
          <p className={styles.workflowResult}><CheckCircle size={20} weight="fill" />{item.result}</p>
        </div>
      </div>
      </div>
    </div>
  </section>;
}

function FounderResult() {
  return <section className={styles.founderResult} id="results" aria-labelledby="founder-result-title" data-reveal>
    <div><p className={styles.eyebrow}>Live results across 100+ brands</p><h2 id="founder-result-title">Average RTO fell from 32% to 17%.</h2><p>Reported by RecoverAgent from live operating data across more than 100 brands.</p><Link href="/book-demo">Discuss the results in your demo <ArrowRight size={17} /></Link></div>
    <div className={styles.resultNumbers}><div><span>Average before</span><strong>32%</strong></div><ArrowRight size={26} aria-hidden="true" /><div><span>With RecoverAgent</span><strong>17%</strong></div><small>15 percentage points lower · 47% relative reduction.<br />Aggregate results. Your outcomes depend on your store and workflows.</small></div>
  </section>;
}

function ProductSection() {
  return <div id="product" className={styles.productEvidence}><ControlRoomDemo /></div>;
}

function PricingSection({ onBook }: { onBook: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      trackEvent('pricing_viewed');
      observer.disconnect();
    }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const taglines = { starter: 'Verify COD before dispatch', growth: 'Verify COD + recover checkouts', scale: 'COD, checkout + NDR recovery' };
  return <section ref={sectionRef} className={`${styles.section} ${styles.pricingSection}`} id="pricing" aria-labelledby="pricing-title">
    <div className={styles.sectionHeading} data-reveal>
      <p className={styles.eyebrow}>Pricing</p>
      <h2 id="pricing-title">Choose your plan.</h2>
      <p>Priced per order. Choose the AI calling workflows your store needs.</p>
    </div>
    <div className={styles.pricingGrid} data-reveal>
      {PRICING_TIERS.map((tier) => <article key={tier.id} className={`${styles.pricingCard} ${tier.recommended ? styles.pricingRecommended : ''}`}>
        <div className={styles.pricingCardTitle}><h3>{tier.name}</h3>{tier.recommended && <span>Recommended</span>}</div>
        <p className={styles.pricingTagline}>{taglines[tier.id]}</p>
        <p className={styles.pricingPrice}>₹{tier.base.toLocaleString('en-IN')}<span>/ month</span></p>
        <dl className={styles.pricingAllowance}>
          <div><dt>Orders included</dt><dd>{tier.includedCalls.toLocaleString('en-IN')}</dd></div>
          <div><dt>Additional order</dt><dd>₹{tier.overagePerOrder} / order</dd></div>
        </dl>
        <ul className={styles.pricingFeatures}>
          {PLAN_FEATURE_ROWS.map((row) => {
            const included = PLAN_FEATURES[tier.id][row.key];
            return <li key={row.key} className={included ? '' : styles.pricingUnavailable}>
              {included ? <Check size={17} weight="bold" aria-hidden="true" /> : <span aria-hidden="true">—</span>}
              <span>{row.label}{!included && <span className={styles.screenReaderOnly}> — Not included</span>}</span>
            </li>;
          })}
        </ul>
        <button type="button" className={tier.recommended ? styles.primaryButton : styles.secondaryButton} onClick={() => {
          trackEvent('sticky_cta_clicked', { source: 'pricing', tier: tier.id });
          onBook();
        }}>Book a demo <ArrowRight size={17} aria-hidden="true" /></button>
      </article>)}
    </div>
    <div className={styles.pricingIncluded} data-reveal>
      <div><span className={styles.eyebrow}>WhatsApp flows in every plan</span><h3>Calling and messaging work together.</h3><p>WhatsApp checkout recovery is available on every tier. AI calling for checkout recovery starts with Growth.</p></div>
      <ul>{ALL_PLANS_WHATSAPP.map((feature) => <li key={feature}><CheckCircle size={17} weight="fill" aria-hidden="true" />{feature}</li>)}</ul>
    </div>
    <p className={styles.pricingNote}>Each COD order or abandoned checkout counts once for billing. Compare your monthly total in the calculator.<br />Zero setup fee · Rollout mapped to your store · No annual lock-in</p>
  </section>;
}

function Objections() {
  const items = faqs.map(item => ({ q: item.question, a: item.answer }));
  return <section className={`${styles.section} ${styles.objectionSection}`}>
    <div className={styles.sectionHeading} data-reveal><h2>Common questions.</h2></div>
    <div className={styles.objectionGrid} data-reveal>{items.map((item) => <details key={item.q}><summary>{item.q}<span><CaretDown size={18} /></span></summary><p>{item.a}</p></details>)}</div>
  </section>;
}

function FinalSection({ onBook }: { onBook: () => void }) {
  return <section className={styles.finalSection} id="demo-booking"><div data-reveal><p className={styles.eyebrow}>Live demo</p><h2>Recover the sales your competitors are still losing.</h2><p>See RecoverAgent in action and get a recovery plan tailored to your store.</p><PrimaryButton onClick={onBook} /><small>30 minutes. A clear plan to get started.</small></div></section>;
}

function BookingDialog({ open, onClose, onEligibilityChange }: { open: boolean; onClose: () => void; onEligibilityChange: (excluded: boolean) => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])'));
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    window.setTimeout(() => closeRef.current?.focus(), 0);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); previousFocus?.focus(); };
  }, [open, onClose]);
  return <AnimatePresence>{open && <motion.div className={styles.bookingDialog} role="dialog" aria-modal="true" aria-labelledby="booking-title" aria-describedby="booking-description" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><motion.div ref={dialogRef} className={styles.dialogShell} initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.99 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}><button ref={closeRef} type="button" className={styles.dialogClose} onClick={onClose} aria-label="Close demo booking"><X size={21} /></button><div className={styles.dialogIntro}><Image src="/recover-agent-logo-transparent.png" width={500} height={250} alt="RecoverAgent" /><h2 id="booking-title">Plan your recovery.</h2><p id="booking-description">30 minutes. Your order volume, costs and first workflow.</p><ul><li><ClockCountdown size={16} />30-minute walkthrough</li><li><Storefront size={16} />Your Shopify workflow</li><li><ChartLineUp size={16} />Call outcomes and tracking</li></ul></div><div className={styles.dialogForm}><DemoBooking compact sectionId="dialog-demo-booking" onEligibilityChange={onEligibilityChange} /></div></motion.div></motion.div>}</AnimatePresence>;
}

export function ConversionHomepage() {
  const pageRef = useRef<HTMLElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [inlineExcluded, setInlineExcluded] = useState(false);
  const [dialogExcluded, setDialogExcluded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => gsap.from(element, { opacity: 0, y: 28, duration: 0.72, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%', once: true } }));
  }, { scope: pageRef });

  useEffect(() => {
    const boundaries = Array.from(document.querySelectorAll<HTMLElement>('#top, #demo-booking'));
    if (!boundaries.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setShowSticky(!boundaries.some((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      }));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const openBooking = useCallback(() => setBookingOpen(true), []);
  const closeBooking = useCallback(() => setBookingOpen(false), []);
  return <main ref={pageRef} className={styles.page}>
    <div inert={bookingOpen ? true : undefined}>
    <Header onBook={openBooking} />
    <Hero onBook={openBooking} />
    <FounderResult />
    <ProductProofStrip />
    <WorkflowSection />
    <ProductSection />
    <div className={styles.lossCalculator}><LossCalculator comparePlansHref="#pricing" /></div>
    <PricingSection onBook={openBooking} />
    <Objections />
    <div className={styles.inlineBooking}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>Your next move</p>
        <h2>Let’s talk about your store.</h2>
        <p>Share a few details, then choose a time for your live demo.</p>
      </div>
      <div className={styles.dialogForm}><DemoBooking compact sectionId="inline-demo-booking" onEligibilityChange={setInlineExcluded} /></div>
    </div>
    {!inlineExcluded && !dialogExcluded && <FinalSection onBook={openBooking} />}
    <Footer />
    <div className={`${styles.mobileSticky} ${showSticky ? styles.mobileStickyVisible : ''}`} aria-hidden={!showSticky}>
      <button type="button" className={styles.mobileStickyBook} onClick={openBooking} tabIndex={showSticky ? 0 : -1}>Book a demo <ArrowRight size={16} /></button>
      <a className={styles.mobileStickyCall} href="tel:+919788274333" aria-label="Call +91 97882 74333" tabIndex={showSticky ? 0 : -1}><PhoneCall size={22} weight="bold" aria-hidden="true" /></a>
    </div>
    </div>
    <BookingDialog open={bookingOpen} onClose={closeBooking} onEligibilityChange={setDialogExcluded} />
  </main>;
}
