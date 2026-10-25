'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Brain,
  Calculator,
  CalendarCheck,
  CaretDown,
  ChartLineUp,
  Check,
  CheckCircle,
  Checks,
  ClockCountdown,
  Lightning,
  List,
  MapPin,
  Package,
  Phone,
  PhoneCall,
  PhoneDisconnect,
  Play,
  ShieldCheck,
  SpeakerHigh,
  Storefront,
  Tag,
  Truck,
  UserSwitch,
  WhatsappLogo,
  X,
  XCircle,
} from '@phosphor-icons/react';
import { DemoBooking } from './DemoBooking';
import { faqs } from '@/lib/faq-data';
import { PRICING_TIERS, calculateRecoveryEstimate, formatInr } from '@/lib/calculator';
import { ALL_PLANS_WHATSAPP, PLAN_FEATURE_ROWS, PLAN_FEATURES } from '@/lib/pricing-plans';
import { CUSTOMER_LOGOS, CUSTOMER_QUOTES } from '@/lib/customer-proof';
import { CALL_CAPTION_NOTES, CALL_CAPTIONS } from '@/lib/call-captions';
import { trackEvent } from '@/lib/analytics';
import styles from './TrialHomepage.module.css';
import { CASE_STUDY, COST_PER_RTO, RTO_COST } from '@/lib/case-study';

export type ScenarioKey = 'cod' | 'checkout' | 'ndr';

const scenarios: Record<ScenarioKey, {
  label: string;
  short: string;
  caller: string;
  context: string;
  audio: string;
  language: string;
  outcome: string;
  tag: string;
  whatsapp: string;
  icon: typeof Package;
}> = {
  cod: {
    label: 'COD confirmation',
    short: 'COD',
    caller: 'COD order · Boxer shorts, pack of 3',
    context: 'Confirming the order before dispatch',
    audio: '/audio/COD_hindi.mp4',
    language: 'Hindi',
    outcome: 'Buyer denied the order · Held before dispatch',
    tag: 'RTO-Hold',
    whatsapp: 'Here is the product from your order, so you can check it 👇',
    icon: Package,
  },
  checkout: {
    label: 'Abandoned checkout',
    short: 'Cart',
    caller: 'Checkout · Baby birth frame · ₹799',
    context: 'Answering questions and helping the buyer finish the order',
    audio: '/audio/abandoned_hindi.mp3',
    language: 'Hindi',
    outcome: 'Order placed on the call · ₹899 COD',
    tag: 'Cart-Recovered',
    whatsapp: 'Your order is placed 🎉 Confirmation details inside.',
    icon: Storefront,
  },
  ndr: {
    label: 'Failed delivery',
    short: 'Delivery',
    caller: 'Shipment · Delivery attempt failed',
    context: 'Finding out what went wrong and rescheduling',
    audio: '/audio/NDR_english.mp4',
    language: 'English',
    outcome: 'Delivery rescheduled for tomorrow',
    tag: 'NDR-Reattempt',
    whatsapp: 'Your delivery is rescheduled for tomorrow 🚚',
    icon: Truck,
  },
};

const scenarioKeys = Object.keys(scenarios) as ScenarioKey[];

// Checkout and courier partners shown under the hero. Add the official logo file to set `src`; until then the name shows as text.
const partnerLogos: Array<{ name: string; src?: string; width: number; height?: number }> = [
  { name: 'GoKwik', src: '/logos/gokwik.png', width: 77 },
  { name: 'Fastrr', src: '/logos/fastrr.png', width: 64 },
  { name: 'Shiprocket', src: '/logos/shiprocket.png', width: 108 },
  { name: 'Delhivery', src: '/logos/delhivery.webp', width: 107, height: 18 },
];


// Any section can open the trial sign-up dialog owned by TrialSiteFrame.
const TrialContext = createContext<() => void>(() => {});
export const useTrial = () => useContext(TrialContext);

function smoothScrollTo(id: string, block: ScrollLogicalPosition = 'start') {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block });
}

export function TrialButton({ onClick, children = 'Start 14-day free trial', variant = 'primary', source }: { onClick: () => void; children?: React.ReactNode; variant?: 'primary' | 'light' | 'compact'; source: string }) {
  return <button
    type="button"
    className={`${styles.trialButton} ${variant === 'light' ? styles.trialButtonLight : ''} ${variant === 'compact' ? styles.trialButtonCompact : ''}`}
    onClick={() => { trackEvent('cta_clicked', { cta: 'start_trial', source }); onClick(); }}
  >{children}<ArrowRight size={17} weight="bold" aria-hidden="true" /></button>;
}

/* ───────────────────────── Header ───────────────────────── */

// On the homepage links jump to sections; on sub pages they go to the matching page.
const navLinks = [
  { label: 'Case study', home: '#case-study', page: '/#case-study' },
  { label: 'How it works', home: '#how', page: '/how-it-works' },
  { label: 'Ship or hold?', home: '#game', page: '/#game' },
  { label: 'RTO calculator', home: '#calc', page: '/loss-calculator' },
  { label: 'Pricing', home: '#pricing', page: '/plans' },
  { label: 'FAQ', home: '#faq', page: '/faq' },
];

function Header({ isHome }: { isHome: boolean }) {
  const onTrial = useTrial();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  const links = navLinks.map((link) => [isHome ? link.home : link.page, link.label] as const);
  return <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
    <a href={isHome ? '#top' : '/'} className={styles.brand} aria-label="RecoverAgent home">
      <Image src="/recover-agent-logo-transparent.png" width={500} height={250} alt="RecoverAgent" priority />
    </a>
    <nav className={styles.desktopNav} aria-label="Primary navigation">
      {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
    </nav>
    <div className={styles.headerCta}><TrialButton onClick={onTrial} variant="compact" source="header">Start free trial</TrialButton></div>
    <button type="button" className={styles.menuButton} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="trial-mobile-nav" onClick={() => setOpen((value) => !value)}>
      {open ? <X size={22} aria-hidden="true" /> : <List size={22} aria-hidden="true" />}
    </button>
    <AnimatePresence>
      {open && <motion.nav id="trial-mobile-nav" className={styles.mobileNav} aria-label="Mobile navigation" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
        {links.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <button type="button" onClick={() => { setOpen(false); onTrial(); }}>Start 14-day free trial <ArrowRight size={16} /></button>
      </motion.nav>}
    </AnimatePresence>
  </header>;
}

/* ───────────────────────── Hero: an answerable AI call ───────────────────────── */

type CallStatus = 'ringing' | 'live' | 'paused' | 'ended';

function useCallPlayer(scenario: ScenarioKey) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<CallStatus>('ringing');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  useEffect(() => {
    setStatus('ringing'); setProgress(0); setError('');
    const audio = audioRef.current;
    // Metadata can arrive before hydration attaches React handlers, so read it directly too.
    const sync = () => setDuration(audio && Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0);
    sync();
    audio?.addEventListener('durationchange', sync);
    return () => audio?.removeEventListener('durationchange', sync);
  }, [scenario]);
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setError('');
    if (audio.ended) audio.currentTime = 0;
    try {
      await audio.play();
      trackEvent('ai_demo_played', { scenario });
    } catch {
      setError('Tap again to play the call.');
    }
  }, [scenario]);
  const pause = useCallback(() => audioRef.current?.pause(), []);
  const hangUp = useCallback(() => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
    setProgress(0);
    setStatus('ringing');
  }, []);
  const audioProps = {
    ref: audioRef,
    src: scenarios[scenario].audio,
    preload: 'metadata' as const,
    onLoadedMetadata: (event: React.SyntheticEvent<HTMLAudioElement>) => { const value = event.currentTarget.duration; setDuration(Number.isFinite(value) ? value : 0); },
    onTimeUpdate: (event: React.SyntheticEvent<HTMLAudioElement>) => {
      const audio = event.currentTarget;
      setProgress(audio.currentTime);
      if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
    },
    onPlay: () => setStatus('live'),
    onPause: (event: React.SyntheticEvent<HTMLAudioElement>) => { if (!event.currentTarget.ended && event.currentTarget.currentTime > 0) setStatus('paused'); },
    onEnded: () => { setStatus('ended'); trackEvent('call_sample_completed', { scenario }); },
    onError: () => setError('Recording unavailable right now.'),
  };
  return { status, progress, duration, error, play, pause, hangUp, audioProps };
}

const formatTime = (value: number) => `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, '0')}`;

function Waveform({ active }: { active: boolean }) {
  return <div className={`${styles.waveform} ${active ? styles.waveformActive : ''}`} aria-hidden="true">
    {Array.from({ length: 28 }, (_, index) => <i key={index} style={{ '--i': index } as React.CSSProperties} />)}
  </div>;
}

type ParallaxInputs = { springX: MotionValue<number>; springY: MotionValue<number>; scrollY: MotionValue<number>; disabled: boolean };

/** Pointer + scroll parallax: each layer drifts by its own depth. */
function useParallaxLayer({ springX, springY, scrollY, disabled }: ParallaxInputs, depth: number, scrollDepth: number) {
  const x = useTransform(springX, (value) => (disabled ? 0 : value * depth));
  const y = useTransform([springY, scrollY], ([pointer, scroll]: number[]) => (disabled ? 0 : pointer * depth - Math.min(scroll, 800) * scrollDepth));
  return { x, y };
}

/** The answerable phone with parallax cards. Used in the homepage hero and on sub pages. */
export function CallStage({ defaultScenario = 'cod', playRef }: { defaultScenario?: ScenarioKey; playRef?: React.MutableRefObject<(() => void) | null> }) {
  const reduceMotion = useReducedMotion();
  const [scenario, setScenario] = useState<ScenarioKey>(defaultScenario);
  const player = useCallPlayer(scenario);
  const item = scenarios[scenario];
  const stageRef = useRef<HTMLDivElement>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 70, damping: 18 });
  const springY = useSpring(pointerY, { stiffness: 70, damping: 18 });
  const { scrollY } = useScroll();
  const motionInputs = { springX, springY, scrollY, disabled: Boolean(reduceMotion) };
  const phoneLayer = useParallaxLayer(motionInputs, 14, 0.06);
  const cardA = useParallaxLayer(motionInputs, 34, 0.16);
  const cardB = useParallaxLayer(motionInputs, -26, 0.24);
  const cardC = useParallaxLayer(motionInputs, 22, 0.11);
  const glowLayer = useParallaxLayer(motionInputs, -10, -0.05);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const answer = () => {
    if (player.status === 'live') { player.pause(); return; }
    player.play();
  };
  const { play } = player;
  useEffect(() => {
    if (!playRef) return;
    playRef.current = () => {
      if (window.matchMedia('(max-width: 900px)').matches) smoothScrollTo('hero-phone', 'center');
      play();
    };
  }, [playRef, play]);
  const live = player.status === 'live';
  const ended = player.status === 'ended';
  const percent = player.duration ? (player.progress / player.duration) * 100 : 0;
  // "Not now" skips to the next sample call instead of doing nothing.
  const nextScenario = () => {
    const index = scenarioKeys.indexOf(scenario);
    player.hangUp();
    setScenario(scenarioKeys[(index + 1) % scenarioKeys.length]);
  };
  const caption = live || player.status === 'paused'
    ? [...CALL_CAPTIONS[scenario]].reverse().find((line) => line.at <= player.progress)
    : undefined;

  return <div className={styles.heroStage} ref={stageRef} onPointerMove={onPointerMove} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
        <motion.div className={styles.stageGlow} style={glowLayer} aria-hidden="true" />

        <div className={styles.scenarioTabs} role="tablist" aria-label="Choose a call to hear">
          {scenarioKeys.map((key) => {
            const Icon = scenarios[key].icon;
            return <button key={key} type="button" role="tab" aria-selected={scenario === key} aria-label={scenarios[key].label} onClick={() => { player.hangUp(); setScenario(key); }}>
              <Icon size={16} weight={scenario === key ? 'fill' : 'regular'} aria-hidden="true" />
              <span className={styles.tabLong}>{scenarios[key].label}</span>
              <span className={styles.tabShort}>{scenarios[key].short}</span>
            </button>;
          })}
        </div>

        <motion.div className={styles.phoneWrap} style={phoneLayer} id="hero-phone">
          <div className={`${styles.phone} ${player.status === 'ringing' ? styles.phoneRinging : ''}`}>
            <div className={styles.phoneNotch} aria-hidden="true" />
            <div className={styles.phoneScreen}>
              <p className={styles.phoneStatus}>{live ? <><span className={styles.liveDot} />Live call · {item.language}</> : ended ? 'Call ended' : player.status === 'paused' ? 'On hold' : 'Incoming AI call…'}</p>
              <div className={`${styles.callerAvatar} ${live ? styles.callerAvatarLive : ''}`}><PhoneCall size={30} weight="duotone" aria-hidden="true" /></div>
              <p className={styles.callerName}>RecoverAgent</p>
              <p className={styles.callerMeta}>{item.caller}</p>
              <Waveform active={live} />
              <div className={styles.callProgress} aria-hidden="true"><i style={{ width: `${percent}%` }} /></div>
              <p className={styles.callTime}>{player.duration ? `${formatTime(player.progress)} / ${formatTime(player.duration)}` : item.context}</p>
              {caption && <p className={styles.caption} aria-live="polite">
                <small>{caption.speaker === 'agent' ? 'AI agent' : 'Buyer'} · {CALL_CAPTION_NOTES[scenario]}</small>
                <span>{caption.text}</span>
              </p>}
              <AnimatePresence mode="wait">
                {ended
                  ? <motion.div key="outcome" className={styles.callOutcome} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <CheckCircle size={20} weight="fill" aria-hidden="true" /><span><strong>{item.outcome}</strong><small>Sample outcome · saved to your dashboard</small></span>
                  </motion.div>
                  : <motion.div key="controls" className={styles.callControls} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span className={styles.callAction}>
                      <button type="button" className={styles.declineButton} onClick={nextScenario} aria-label="Not now, play the next sample call"><PhoneDisconnect size={22} weight="fill" /></button>
                      <small aria-hidden="true">Not now</small>
                    </span>
                    <span className={styles.callAction}>
                      <button type="button" className={styles.answerButton} onClick={answer} aria-label={live ? 'Pause call' : 'Answer and play the real AI call'}>
                        {live ? <span className={styles.pauseBars}><i /><i /></span> : <Phone size={24} weight="fill" />}
                      </button>
                      <small aria-hidden="true">{live ? 'Pause' : 'Answer'}</small>
                    </span>
                  </motion.div>}
              </AnimatePresence>
              {ended && <button type="button" className={styles.replayLink} onClick={player.play}>Play again</button>}
              {player.error && <p className={styles.callError} role="alert">{player.error}</p>}
            </div>
            <audio {...player.audioProps} />
          </div>
          <p className={styles.phoneHint}>{live ? 'Real recording of our AI voice agent' : ended ? 'What happened next:' : <><SpeakerHigh size={15} weight="fill" aria-hidden="true" />Turn your sound on</>}</p>
          {ended && <div className={styles.outcomeChips}>
            <span><WhatsappLogo size={15} weight="fill" aria-hidden="true" />WhatsApp follow-up sent</span>
            <span><Tag size={15} weight="fill" aria-hidden="true" />Shopify tag: {item.tag}</span>
          </div>}
        </motion.div>

        <motion.div className={`${styles.floatCard} ${styles.floatWhatsapp}`} style={cardA} aria-hidden="true">
          <span className={styles.floatIconGreen}><WhatsappLogo size={18} weight="fill" /></span>
          <span><small>WhatsApp follow-up</small><strong>{item.whatsapp}</strong></span>
        </motion.div>
        <motion.div className={`${styles.floatCard} ${styles.floatTag}`} style={cardB} aria-hidden="true">
          <span className={styles.floatIconBlue}><Tag size={18} weight="fill" /></span>
          <span><small>Shopify tag added</small><strong>{item.tag}</strong></span>
        </motion.div>
        <motion.div className={`${styles.floatCard} ${styles.floatStat}`} style={cardC} aria-hidden="true">
          <small>Average RTO</small>
          <strong>32% <ArrowRight size={14} weight="bold" /> <em>17%</em></strong>
        </motion.div>
      </div>;
}

export function Hero() {
  const onTrial = useTrial();
  const playRef = useRef<(() => void) | null>(null);
  return <section className={styles.hero} id="top">
    <div className={styles.heroGrid} aria-hidden="true" />
    <div className={styles.heroInner}>
      <div className={styles.heroCopy}>
        <p className={styles.heroBadge}><span className={styles.pulseDot} />Built by a D2C founder, for D2C brands</p>
        <h1>Stop shipping orders <span>that come back.</span></h1>
        <p className={styles.heroLead}>Our AI voice agent calls every COD buyer before you dispatch. It confirms the order, fixes the address and follows up on WhatsApp. Brands on RecoverAgent cut average RTO from <strong>32% to 17%</strong>.</p>
        <div className={styles.heroActions}>
          <TrialButton onClick={onTrial} source="hero" />
          <button type="button" className={styles.ghostButton} onClick={() => playRef.current?.()}><Play size={17} weight="fill" aria-hidden="true" />Hear a real call</button>
        </div>
        <ul className={styles.heroAssurances}>
          <li><Check size={15} weight="bold" aria-hidden="true" />Test it on your real orders</li>
          <li><Check size={15} weight="bold" aria-hidden="true" />Calls in 6 languages</li>
          <li><Check size={15} weight="bold" aria-hidden="true" />Zero setup fee</li>
          <li><Check size={15} weight="bold" aria-hidden="true" />No annual lock-in</li>
        </ul>
      </div>
      <CallStage playRef={playRef} />
    </div>
    <a href="#proof" className={styles.scrollCue} aria-label="Scroll to results"><span /></a>
  </section>;
}

/** Standalone dark band with the answerable phone, for sub pages. */
export function CallShowcase({ defaultScenario = 'cod', title = 'Answer the call. Hear the real AI agent.', text = 'Pick a workflow, tap the green button and listen to a real recording from our AI agent.' }: { defaultScenario?: ScenarioKey; title?: string; text?: string }) {
  return <section className={styles.callShowcase} aria-labelledby="call-showcase-title">
    <div className={styles.sectionHead}>
      <p className={styles.eyebrowLight}>Real recording</p>
      <h2 id="call-showcase-title">{title}</h2>
      <p>{text}</p>
    </div>
    <div className={styles.callShowcaseStage}><CallStage defaultScenario={defaultScenario} /></div>
  </section>;
}

/* ───────────────────────── Integrations strip ───────────────────────── */

export function IntegrationStrip() {
  const logos = [
    { name: 'Shopify', src: '/shopify-logo.svg', width: 84, height: 24 },
    { name: 'WooCommerce', src: '/woocommerce-logo.png', width: 88, height: 24 },
    ...partnerLogos,
  ];
  return <section className={styles.integrationStrip} aria-label="Works with">
    <p>Works with your store, checkout and courier</p>
    <ul>
      {logos.map((logo) => <li key={logo.name}>
        {logo.src
          ? <Image src={logo.src} width={logo.width} height={logo.height ?? 24} alt={logo.name} style={{ height: logo.height ?? 24, width: 'auto' }} />
          : <span className={styles.logoText}>{logo.name}</span>}
      </li>)}
      <li><span className={styles.moreIntegrations}>20+ integrations</span></li>
    </ul>
  </section>;
}

/* ───────────────────────── Proof band ───────────────────────── */

function useCountUp(target: number, start: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setValue(target); return; }
    let frame = 0;
    const began = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - began) / durationMs);
      setValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, durationMs]);
  return value;
}

export function ProofBand() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const before = useCountUp(32, inView);
  const after = useCountUp(17, inView, 1900);
  const relative = useCountUp(47, inView, 2100);
  return <section ref={ref} className={styles.proofBand} id="proof" aria-labelledby="proof-title">
    <div className={styles.proofInner}>
      <div className={styles.proofCopy}>
        <p className={styles.eyebrowLight}>Live results across 100+ brands</p>
        <h2 id="proof-title">Average RTO, before and after RecoverAgent.</h2>
        <p>Aggregate from live operating data across more than 100 brands. Your result depends on your store, which is exactly what the free trial measures.</p>
      </div>
      <div className={styles.proofMeter}>
        <div className={styles.proofBar}>
          <span>Before</span>
          <div><i className={styles.proofBarBefore} style={{ width: `${(before / 40) * 100}%` }} /></div>
          <strong>{Math.round(before)}%</strong>
        </div>
        <div className={styles.proofBar}>
          <span>With RecoverAgent</span>
          <div><i className={styles.proofBarAfter} style={{ width: `${(after / 40) * 100}%` }} /></div>
          <strong>{Math.round(after)}%</strong>
        </div>
        <p className={styles.proofRelative}><strong>{Math.round(relative)}%</strong> fewer orders coming back</p>
      </div>
    </div>
    {CUSTOMER_LOGOS.length > 0 && <div className={styles.logoStrip} aria-label="Brands using RecoverAgent">
      {CUSTOMER_LOGOS.map((logo) => <Image key={logo.name} src={logo.src} width={logo.width} height={logo.height} alt={logo.name} />)}
    </div>}
  </section>;
}

/* ───────────────────────── Case study (anonymised live data) ───────────────────────── */

const caseStudy = CASE_STUDY;

export function CaseStudySection() {
  const onTrial = useTrial();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const orders = useCountUp(caseStudy.orders, inView, 1200);
  const saved = useCountUp(caseStudy.cancelled * COST_PER_RTO, inView, 1800);
  const rows = [
    { label: 'Verified and shipped', value: caseStudy.verified, tone: styles.caseBarGreen, note: 'Buyer clearly confirmed on the call' },
    { label: 'Stopped before shipping', value: caseStudy.cancelled, tone: styles.caseBarRed, note: 'Buyer cancelled or did not want the order' },
    { label: 'Duplicate orders caught', value: caseStudy.duplicates, tone: styles.caseBarAmber, note: 'Repeat COD orders from the same number' },
    { label: 'Escalated to your team', value: caseStudy.escalated, tone: styles.caseBarBlue, note: 'Needed a human decision, sent with full context' },
  ];
  return <section ref={ref} className={styles.caseSection} id="case-study" aria-labelledby="case-title">
    <div className={styles.caseInner}>
      <div className={styles.caseCopy}>
        <p className={styles.eyebrow}>Case study · live data</p>
        <h2 id="case-title">A men’s apparel D2C brand, last 30 days.</h2>
        <p>Every COD order got a call before dispatch. Here is what came out of those calls, straight from their RecoverAgent dashboard.</p>
        <div className={styles.caseSaved}>
          <small>RTO cost avoided in 30 days</small>
          <strong>{formatInr(saved)}</strong>
          <span>{caseStudy.cancelled} unwanted orders never shipped, at ₹{COST_PER_RTO} per returned order</span>
        </div>
        <p className={styles.caseExtra}>The same agent also worked <b>{caseStudy.abandoned.toLocaleString('en-IN')} abandoned checkouts</b> and <b>{caseStudy.ndr} failed deliveries</b> that month.</p>
        <TrialButton onClick={onTrial} source="case_study">Get these numbers for my store</TrialButton>
      </div>
      <div className={styles.caseBoard} aria-label="COD results for 30 days">
        <div className={styles.caseBoardTop}>
          <span><Package size={18} weight="duotone" aria-hidden="true" />COD orders called</span>
          <strong>{Math.round(orders).toLocaleString('en-IN')}</strong>
        </div>
        <ul>
          {rows.map((row, index) => {
            const share = (row.value / caseStudy.orders) * 100;
            return <li key={row.label}>
              <div className={styles.caseRowTop}><span>{row.label}</span><strong>{row.value.toLocaleString('en-IN')} <small>{share < 1 ? '<1' : Math.round(share)}%</small></strong></div>
              <div className={styles.caseTrack}><motion.i className={row.tone} initial={{ width: 0 }} animate={inView ? { width: `${Math.max(share, 1.2)}%` } : {}} transition={{ duration: 1, delay: 0.2 + index * 0.15, ease: [0.16, 1, 0.3, 1] }} /></div>
              <small className={styles.caseNote}>{row.note}</small>
            </li>;
          })}
        </ul>
        <p className={styles.caseFoot}>Brand name withheld. Results from one store; yours will differ.</p>
      </div>
    </div>
  </section>;
}

/* ───────────────────────── Problem with parallax photo ───────────────────────── */

export function ProblemSection() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['-12%', '12%']);
  const costs = [
    { label: 'Forward shipping', value: RTO_COST.forward },
    { label: 'Return shipping', value: RTO_COST.return },
    { label: 'Packaging & handling', value: RTO_COST.packaging },
    { label: 'Ad spend to win the order', value: RTO_COST.acquisition },
  ];
  return <section ref={ref} className={styles.problem} aria-labelledby="problem-title">
    <motion.div className={styles.problemImage} style={{ y: imageY }} aria-hidden="true">
      <Image src="/images/rto-returns.png" alt="" fill sizes="100vw" quality={70} />
    </motion.div>
    <div className={styles.problemShade} aria-hidden="true" />
    <div className={styles.problemInner}>
      <div className={styles.problemCopy}>
        <p className={styles.eyebrowWarm}>The real cost of COD</p>
        <h2 id="problem-title">Every returned parcel costs you twice.</h2>
        <p>You pay to ship it, you pay to get it back, and the ad spend that won the order is gone. Most of it is avoidable with one short call before dispatch.</p>
      </div>
      <div className={styles.receipt} aria-label="Typical cost of one RTO">
        <p className={styles.receiptHead}>What one returned order costs you <small>typical estimate</small></p>
        <ul>{costs.map((cost) => <li key={cost.label}><span>{cost.label}</span><strong>₹{cost.value}</strong></li>)}</ul>
        <p className={styles.receiptTotal}><span>Lost per returned order</span><strong>₹{COST_PER_RTO}</strong></p>
      </div>
    </div>
  </section>;
}

/* ───────────────────────── Ship or hold? game ───────────────────────── */

type Verdict = 'ship' | 'hold';
type Outcome = 'confirmed' | 'cancelled' | 'address' | 'unreachable';

const gameOrders: Array<{ id: string; name: string; place: string; value: number; signals: string[]; outcome: Outcome; detail: string }> = [
  { id: '#2041', name: 'Rahul K.', place: 'Lucknow · 226010', value: 1299, signals: ['First order', 'Placed at 1:40 am'], outcome: 'confirmed', detail: 'Genuine buyer. Confirmed on the call. Wanted it before a wedding.' },
  { id: '#2042', name: 'Sneha P.', place: 'Pune · 411057', value: 2499, signals: ['Repeat buyer', 'Full address'], outcome: 'cancelled', detail: 'Already bought it elsewhere. Cancelled before you paid to ship it.' },
  { id: '#2043', name: 'Amit', place: 'Patna · 800001', value: 899, signals: ['Short address', 'No landmark'], outcome: 'address', detail: 'Genuine buyer. Added flat number and landmark on the call.' },
  { id: '#2044', name: 'Test Test', place: 'Delhi · 110001', value: 3999, signals: ['Odd name', 'High value'], outcome: 'unreachable', detail: 'Not reachable after retries. Held for your team to review.' },
  { id: '#2045', name: 'Priya S.', place: 'Coimbatore · 641002', value: 1599, signals: ['First order', 'From an Instagram ad'], outcome: 'confirmed', detail: 'Genuine buyer. Confirmed and shipped the same day.' },
];

const outcomeMeta: Record<Outcome, { label: string; shouldShip: boolean; tone: 'good' | 'bad' | 'warn' }> = {
  confirmed: { label: 'Confirmed: ship it', shouldShip: true, tone: 'good' },
  address: { label: 'Address fixed: ship it', shouldShip: true, tone: 'warn' },
  cancelled: { label: 'Cancelled: don’t ship', shouldShip: false, tone: 'bad' },
  unreachable: { label: 'Unreachable: hold', shouldShip: false, tone: 'bad' },
};

export function ShipOrHoldGame() {
  const onTrial = useTrial();
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
  const [revealed, setRevealed] = useState(false);
  const answered = Object.keys(verdicts).length;
  const allAnswered = answered === gameOrders.length;
  const choose = (id: string, verdict: Verdict) => {
    if (revealed) return;
    if (!answered) trackEvent('workflow_step_clicked', { step: 'game_started' });
    setVerdicts((current) => ({ ...current, [id]: verdict }));
  };
  const reveal = () => { setRevealed(true); trackEvent('workflow_step_clicked', { step: 'game_revealed' }); };
  const reset = () => { setVerdicts({}); setRevealed(false); };

  // A shipped order the buyer never wanted (or at a broken address) comes back. A held genuine order is a lost sale.
  let returned = 0; let lostSales = 0; let correct = 0;
  gameOrders.forEach((order) => {
    const verdict = verdicts[order.id];
    const meta = outcomeMeta[order.outcome];
    if (verdict === 'ship' && (!meta.shouldShip || order.outcome === 'address')) returned += 1;
    if (verdict === 'hold' && meta.shouldShip) lostSales += order.value;
    // No guess fixes a broken address, so that order only counts as solved by the call.
    if ((verdict === 'ship') === meta.shouldShip && order.outcome !== 'address') correct += 1;
  });
  const addressOrder = gameOrders.find((order) => order.outcome === 'address');

  return <section className={styles.gameSection} id="game" aria-labelledby="game-title">
    <div className={styles.sectionHead}>
      <a href="#game-board" className={styles.challengeBadge}><Lightning size={16} weight="fill" aria-hidden="true" /><span>30-second challenge</span><b>Play now</b></a>
      <h2 id="game-title">Can you spot which COD orders will come back?</h2>
      <p>You have five orders waiting for dispatch. Decide which to ship and which to hold, then see what one AI call actually found.</p>
    </div>
    <div className={styles.gameBoard} id="game-board">
      <div className={styles.gameProgress} aria-live="polite">
        <span>{revealed ? 'Results' : `${answered} of ${gameOrders.length} decided`}</span>
        <div><i style={{ width: `${(answered / gameOrders.length) * 100}%` }} /></div>
      </div>
      <ol className={styles.orderList}>
        {gameOrders.map((order, index) => {
          const verdict = verdicts[order.id];
          const meta = outcomeMeta[order.outcome];
          const right = revealed && verdict && (verdict === 'ship') === meta.shouldShip && order.outcome !== 'address';
          return <motion.li key={order.id} className={`${styles.orderCard} ${revealed ? styles.orderRevealed : ''}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: index * 0.06 }}>
            <div className={styles.orderHead}>
              <span className={styles.orderAvatar}>{order.name.charAt(0)}</span>
              <span><strong>{order.name}</strong><small><MapPin size={12} aria-hidden="true" />{order.place}</small></span>
              <span className={styles.orderValue}><small>{order.id} · COD</small>{formatInr(order.value)}</span>
            </div>
            <div className={styles.orderSignals}>{order.signals.map((signal) => <span key={signal}>{signal}</span>)}</div>
            {!revealed
              ? <div className={styles.verdictRow} role="group" aria-label={`Decision for order ${order.id}`}>
                <button type="button" aria-pressed={verdict === 'ship'} className={verdict === 'ship' ? styles.verdictShip : ''} onClick={() => choose(order.id, 'ship')}><Truck size={16} aria-hidden="true" />Ship</button>
                <button type="button" aria-pressed={verdict === 'hold'} className={verdict === 'hold' ? styles.verdictHold : ''} onClick={() => choose(order.id, 'hold')}><ClockCountdown size={16} aria-hidden="true" />Hold</button>
              </div>
              : <motion.div className={`${styles.orderOutcome} ${styles[`tone_${meta.tone}`]}`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: index * 0.12 }}>
                <p><PhoneCall size={15} weight="fill" aria-hidden="true" /><strong>AI call: {meta.label}</strong></p>
                <p>{order.detail}</p>
                <p className={styles.yourCall}>You chose <b>{verdict ?? '—'}</b>{right ? <><CheckCircle size={14} weight="fill" aria-hidden="true" /> good call</> : <><XCircle size={14} weight="fill" aria-hidden="true" /> {order.outcome === 'address' ? (verdict === 'ship' ? 'would fail at the old address' : 'a genuine sale lost') : 'costly guess'}</>}</p>
              </motion.div>}
          </motion.li>;
        })}
      </ol>
      <AnimatePresence mode="wait">
        {!revealed
          ? <motion.div key="cta" className={styles.gameFooter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" className={styles.revealButton} disabled={!allAnswered} onClick={reveal}><Brain size={18} weight="fill" aria-hidden="true" />{allAnswered ? 'Reveal what the AI call found' : `Decide ${gameOrders.length - answered} more to reveal`}</button>
          </motion.div>
          : <motion.div key="score" className={styles.gameScore} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <p className={styles.scoreBig}>{correct}/{gameOrders.length} <small>orders called right</small></p>
              <p>{returned > 0 ? <>You would have shipped <b>{returned} order{returned > 1 ? 's' : ''}</b> that would come back, about <b>{formatInr(returned * COST_PER_RTO)}</b> lost.</> : <>You shipped nothing that would come back.</>} {lostSales > 0 && <>You also held back <b>{formatInr(lostSales)}</b> of genuine orders.</>} {addressOrder && <>And no guess could fix {addressOrder.name}’s address. Only the call did.</>}</p>
              <p className={styles.scoreMoral}>Order signals are guesses. A two-minute call is an answer. RecoverAgent makes that call on every COD order, so your team doesn’t have to guess.</p>
            </div>
            <div className={styles.scoreActions}>
              <TrialButton onClick={onTrial} source="game">Try it on my orders, free</TrialButton>
              <button type="button" className={styles.textButton} onClick={reset}>Play again</button>
            </div>
          </motion.div>}
      </AnimatePresence>
      <p className={styles.sampleNote}>Sample orders for illustration.</p>
    </div>
  </section>;
}

/* ───────────────────────── Scroll story: order to outcome ───────────────────────── */

const storyByScenario: Record<ScenarioKey, Array<{ title: string; text: string; icon: typeof Package; visual: string; chip: string }>> = {
  cod: [
    { title: 'A COD order lands', text: 'Shopify or WooCommerce sends the order to RecoverAgent the moment it is placed.', icon: Package, visual: 'Order #1042 · ₹1,499 · COD', chip: 'Webhook received' },
    { title: 'The AI calls the buyer', text: 'At the timing you set, in the buyer’s language. It sounds like your brand, not a robot reading a script.', icon: PhoneCall, visual: 'Calling +91 98••• ••210', chip: 'Hindi · 0:48' },
    { title: 'It understands the answer', text: 'Confirmed, cancel, wrong address or unreachable. Interruptions and questions are handled in the conversation.', icon: Brain, visual: 'Intent: Confirmed · address updated', chip: 'Intent captured' },
    { title: 'Your store updates itself', text: 'The order is tagged Verified or RTO hold in Shopify and the buyer gets a WhatsApp confirmation. Your team only sees exceptions.', icon: Tag, visual: 'Tag: COD-Verified · WhatsApp sent', chip: 'Ready to dispatch' },
  ],
  checkout: [
    { title: 'A checkout is abandoned', text: 'The shopper reached checkout and left. RecoverAgent gets the event straight away.', icon: Storefront, visual: 'Checkout · ₹3,450 · 2 items', chip: 'Checkout abandoned' },
    { title: 'The AI calls the shopper', text: 'It asks what stopped them and answers questions on size, delivery or payment.', icon: PhoneCall, visual: 'Calling +91 99••• ••482', chip: 'Hindi · 1:05' },
    { title: 'It removes the hesitation', text: 'Will buy, needs help, call back later or not interested, captured clearly.', icon: Brain, visual: 'Intent: Will purchase', chip: 'Intent captured' },
    { title: 'The link arrives on WhatsApp', text: 'The checkout link lands on WhatsApp and completion is tracked on your dashboard.', icon: WhatsappLogo, visual: 'Checkout link sent · opened', chip: 'Recovering' },
  ],
  ndr: [
    { title: 'A delivery attempt fails', text: 'Before the courier marks it for return, RecoverAgent picks up the failed attempt.', icon: Truck, visual: 'Shipment #NDR-82 · attempt 1 failed', chip: 'NDR raised' },
    { title: 'The AI calls the buyer', text: 'It finds out what really happened: not home, wrong address, or never contacted.', icon: PhoneCall, visual: 'Calling +91 97••• ••903', chip: 'English · 0:52' },
    { title: 'It agrees the next step', text: 'Reattempt, reschedule, fix the address or cancel, recorded with the reason.', icon: Brain, visual: 'Intent: Reattempt tomorrow', chip: 'Intent captured' },
    { title: 'Your team gets the action', text: 'The next step is shared with your team and the buyer is updated on WhatsApp.', icon: UserSwitch, visual: 'Reattempt requested · buyer notified', chip: 'Saved from RTO' },
  ],
};

export function StorySection({ defaultScenario = 'cod' }: { defaultScenario?: ScenarioKey }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scenario, setScenario] = useState<ScenarioKey>(defaultScenario);
  const [active, setActive] = useState(0);
  const steps = storyByScenario[scenario];
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 30%', 'end 70%'] });
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setActive(Math.max(0, Math.min(steps.length - 1, Math.floor(value * steps.length))));
  });
  const StepIcon = steps[active].icon;
  return <section className={styles.story} id="how" aria-labelledby="story-title">
    <div className={styles.sectionHead}>
      <p className={styles.eyebrowLight}>How it works</p>
      <h2 id="story-title">From order to outcome, without your team picking up a phone.</h2>
      <div className={styles.storyTabs} role="tablist" aria-label="Workflow">
        {scenarioKeys.map((key) => <button key={key} type="button" role="tab" aria-selected={scenario === key} onClick={() => { setScenario(key); trackEvent('workflow_step_clicked', { step: `story_${key}` }); }}>{scenarios[key].label}</button>)}
      </div>
    </div>
    <div className={styles.storyLayout} ref={trackRef}>
      <ol className={styles.storySteps}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          return <li key={`${scenario}-${step.title}`} className={`${styles.storyStep} ${index === active ? styles.storyStepActive : ''} ${index < active ? styles.storyStepDone : ''}`}>
            <span className={styles.storyIndex}>{index < active ? <Check size={16} weight="bold" /> : <Icon size={18} weight="duotone" />}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <div className={styles.storyInlineVisual}><span>{step.chip}</span><strong>{step.visual}</strong></div>
            </div>
          </li>;
        })}
      </ol>
      <div className={styles.storyStickyWrap}>
        <div className={styles.storyConsole}>
          <div className={styles.consoleTop}><i /><i /><i /><span>RecoverAgent · {scenarios[scenario].label}</span></div>
          <AnimatePresence mode="wait">
            <motion.div key={`${scenario}-${active}`} className={styles.consoleBody} initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
              <span className={styles.consoleIcon}><StepIcon size={34} weight="duotone" /></span>
              <p className={styles.consoleChip}>{steps[active].chip}</p>
              <p className={styles.consoleVisual}>{steps[active].visual}</p>
              {active === 1 && <Waveform active />}
              {active === steps.length - 1 && <p className={styles.consoleDone}><CheckCircle size={18} weight="fill" />Done automatically</p>}
            </motion.div>
          </AnimatePresence>
          <div className={styles.consoleSteps} aria-hidden="true">{steps.map((step, index) => <i key={step.title} className={index <= active ? styles.consoleStepOn : ''} />)}</div>
        </div>
      </div>
    </div>
  </section>;
}

/* ───────────────────────── WhatsApp Agent inbox (sample data) ───────────────────────── */

const inboxThreads = [
  {
    id: 'cod', name: 'Rohit S.', preview: 'Ok, I will call back', time: '2m', unread: 2,
    messages: [
      { from: 'brand', time: '10:41', template: 'COD follow-up', text: 'Hi Rohit 👋 We couldn’t reach you to confirm your COD order. Please call us back to confirm, otherwise the order may be cancelled.' },
      { from: 'buyer', time: '10:43', text: 'Sorry I was driving. Ok, I will call back' },
    ],
    order: { id: '#1042', item: 'Cotton checkered shorts · Pack of 3 · XL', value: '₹648', status: 'Pending confirmation', tags: ['COD', 'Call not connected', 'Retry 2'] },
  },
  {
    id: 'exchange', name: 'Kavya M.', preview: 'Can I exchange XL with XXL?', time: '18m', unread: 1,
    messages: [
      { from: 'buyer', time: '4:12', text: 'Hi, I received the order. Can I exchange XL with XXL?' },
      { from: 'brand', time: '4:13', text: 'Of course, Kavya! I have raised an exchange for XXL. Our team will confirm the pickup time here.' },
    ],
    order: { id: '#1038', item: 'Ankle socks · Pack of 4', value: '₹448', status: 'Delivered', tags: ['COD', 'RA_COD_verified', 'Exchange'] },
  },
  {
    id: 'tracking', name: 'Arvind K.', preview: 'अभी तक प्राप्त नहीं हुआ है', time: '1h', unread: 0,
    messages: [
      { from: 'buyer', time: '9:05', text: 'अभी तक प्राप्त नहीं हुआ है' },
      { from: 'brand', time: '9:06', text: 'Sorry for the wait, Arvind ji. Your order is out for delivery today. Track it here: track.example/1029' },
    ],
    order: { id: '#1029', item: 'Round neck T-shirts · Pack of 2', value: '₹499', status: 'Out for delivery', tags: ['COD', 'RA_COD_verified', 'Shipped'] },
  },
  {
    id: 'checkout', name: 'Sneha P.', preview: 'Done, order placed 👍', time: '3h', unread: 0,
    messages: [
      { from: 'brand', time: '6:20', template: 'Cart reminder', text: 'Hi Sneha, your cart is waiting 🛍️ Complete your order here: shop.example/checkout/214' },
      { from: 'buyer', time: '6:34', text: 'Done, order placed 👍' },
    ],
    order: { id: '#1046', item: 'Slim-fit chinos · Beige · 32', value: '₹1,299', status: 'Checkout recovered', tags: ['Abandoned', 'Recovered', 'Prepaid'] },
  },
  {
    id: 'ndr', name: 'Deepak R.', preview: 'Please deliver tomorrow evening', time: '5h', unread: 1,
    messages: [
      { from: 'brand', time: '1:15', template: 'Delivery attempt failed', text: 'Hi Deepak, the courier could not deliver your order today. When should we try again?' },
      { from: 'buyer', time: '1:22', text: 'I was not home. Please deliver tomorrow evening' },
    ],
    order: { id: '#1017', item: 'Cotton checkered shorts · Pack of 3 · M', value: '₹648', status: 'Reattempt requested', tags: ['COD', 'NDR', 'Reattempt'] },
  },
];

export function WhatsAppSection() {
  const [activeId, setActiveId] = useState(inboxThreads[0].id);
  const thread = inboxThreads.find((item) => item.id === activeId) ?? inboxThreads[0];
  return <section className={styles.waSection} id="whatsapp" aria-labelledby="wa-title">
    <div className={styles.sectionHead}>
      <p className={styles.eyebrow}>WhatsApp Agent</p>
      <h2 id="wa-title">Every buyer reply lands in one team inbox.</h2>
      <p>Calls and WhatsApp work together. Follow-ups go out automatically, and when a buyer replies your team sees the chat with their Shopify orders right beside it.</p>
    </div>
    <div className={styles.waApp}>
      <div className={styles.waList} role="tablist" aria-label="Sample conversations">
        <p className={styles.waListHead}>Inbox <span>{inboxThreads.reduce((sum, item) => sum + item.unread, 0)}</span></p>
        {inboxThreads.map((item) => <button key={item.id} type="button" role="tab" aria-selected={item.id === activeId} onClick={() => { setActiveId(item.id); trackEvent('workflow_step_clicked', { step: `wa_${item.id}` }); }}>
          <span className={styles.waAvatar}>{item.name.charAt(0)}</span>
          <span className={styles.waMeta}><strong>{item.name}</strong><small>{item.preview}</small></span>
          <span className={styles.waTime}>{item.time}{item.unread > 0 && <b>{item.unread}</b>}</span>
        </button>)}
      </div>
      <div className={styles.waChat} role="tabpanel" aria-label={`Conversation with ${thread.name}`}>
        <div className={styles.waChatHead}><span className={styles.waAvatar}>{thread.name.charAt(0)}</span><strong>{thread.name}</strong><small><WhatsappLogo size={14} weight="fill" aria-hidden="true" />WhatsApp</small></div>
        <AnimatePresence mode="wait">
          <motion.div key={thread.id} className={styles.waMessages} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {thread.messages.map((message, index) => <motion.div key={index} className={message.from === 'brand' ? styles.waBubbleBrand : styles.waBubbleBuyer} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + index * 0.25 }}>
              {'template' in message && message.template && <small className={styles.waTemplate}>Template · {message.template}</small>}
              <p>{message.text}<span className={styles.waStamp}>{message.time}{message.from === 'brand' && <Checks size={15} weight="bold" aria-label="Read" />}</span></p>
            </motion.div>)}
          </motion.div>
        </AnimatePresence>
      </div>
      <aside className={styles.waOrder} aria-label="Shopify order">
        <p className={styles.waOrderHead}><Storefront size={16} aria-hidden="true" />Shopify order</p>
        <div className={styles.waOrderCard}>
          <div><strong>{thread.order.id}</strong><span>{thread.order.value}</span></div>
          <p>{thread.order.item}</p>
          <p className={styles.waOrderStatus}>{thread.order.status}</p>
          <div className={styles.waTags}>{thread.order.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </aside>
    </div>
    <ul className={styles.waPoints}>
      <li><CheckCircle size={18} weight="fill" aria-hidden="true" />Automatic follow-ups when a call is not answered</li>
      <li><CheckCircle size={18} weight="fill" aria-hidden="true" />Shared inbox for your whole team</li>
      <li><CheckCircle size={18} weight="fill" aria-hidden="true" />Broadcasts and automated flows</li>
    </ul>
    <p className={styles.sampleNote}>Sample conversations for illustration.</p>
  </section>;
}

/* ───────────────────────── Safe for your brand + languages ───────────────────────── */

const languages = [
  { name: 'English', hello: 'Hello' },
  { name: 'Hindi', hello: 'नमस्ते' },
  { name: 'Tamil', hello: 'வணக்கம்' },
  { name: 'Telugu', hello: 'నమస్కారం' },
  { name: 'Kannada', hello: 'ನಮಸ್ಕಾರ' },
  { name: 'Malayalam', hello: 'നമസ്കാരം' },
];

export function SafetySection() {
  const items = [
    { icon: ShieldCheck, title: 'Verified means a clear yes', text: 'An order is marked Verified only when the buyer clearly confirms it. Unclear answers stay unverified for your team to review.' },
    { icon: ClockCountdown, title: 'Quiet hours', text: 'Set the hours when buyers should not be called. Orders placed then wait in a queue and are called once the window ends.' },
    { icon: PhoneCall, title: 'Up to 3 retries', text: 'If a buyer does not pick up, the call is retried at the gaps you choose, and a WhatsApp nudge can go out between attempts.' },
    { icon: Package, title: 'Duplicate orders caught', text: 'Repeat COD orders from the same number are flagged before anyone ships twice.' },
    { icon: UserSwitch, title: 'Human handoff', text: 'Anything the AI should not handle goes to your team as an escalation, with the full context.' },
    { icon: Play, title: 'Every call recorded', text: 'Listen to any call from the dashboard whenever you want to check what was said.' },
  ];
  return <section className={styles.safetySection} id="safety" aria-labelledby="safety-title">
    <div className={styles.sectionHead}>
      <p className={styles.eyebrow}>Safe for your brand</p>
      <h2 id="safety-title">Built so your ops team can trust it.</h2>
    </div>
    <div className={styles.safetyGrid}>
      {items.map((item) => {
        const Icon = item.icon;
        return <article key={item.title}>
          <span className={styles.safetyIcon}><Icon size={22} weight="duotone" aria-hidden="true" /></span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>;
      })}
    </div>
    <div className={styles.languageBand}>
      <p><strong>Calls in 6 languages</strong><span>Buyers hear their own language, not a robot reading a script.</span></p>
      <ul>{languages.map((language, index) => <motion.li key={language.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }}><span lang={language.name === 'English' ? 'en' : undefined}>{language.hello}</span><small>{language.name}</small></motion.li>)}</ul>
    </div>
  </section>;
}

/* ───────────────────────── Live loss calculator ───────────────────────── */

function Slider({ label, value, min, max, step, onChange, format }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; format: (value: number) => string }) {
  const percent = ((value - min) / (max - min)) * 100;
  return <label className={styles.slider}>
    <span className={styles.sliderTop}><span>{label}</span><strong>{format(value)}</strong></span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ '--fill': `${percent}%` } as React.CSSProperties} />
  </label>;
}

const COST_FIELDS = [
  { key: 'forward', label: 'Outbound shipping' },
  { key: 'return', label: 'Return shipping' },
  { key: 'packaging', label: 'Lost packaging' },
  { key: 'acquisition', label: 'Ad cost per order' },
] as const;

export function LossSection() {
  const onTrial = useTrial();
  const [cod, setCod] = useState(1500);
  const [rto, setRto] = useState(25);
  const [aov, setAov] = useState(1200);
  const [cart, setCart] = useState(600);
  const [costs, setCosts] = useState<Record<keyof typeof RTO_COST, string>>(() => ({
    forward: String(RTO_COST.forward), return: String(RTO_COST.return), packaging: String(RTO_COST.packaging), acquisition: String(RTO_COST.acquisition),
  }));
  const [withAgent, setWithAgent] = useState(false);
  const started = useRef(false);
  const markStarted = () => {
    if (!started.current) { started.current = true; trackEvent('calculator_started', { source: 'live_sliders' }); }
  };
  const touch = <T,>(setter: (value: T) => void) => (value: T) => { markStarted(); setter(value); };
  const cost = (key: keyof typeof RTO_COST) => Math.max(0, Number(costs[key]) || 0);
  const costsEdited = COST_FIELDS.some(({ key }) => cost(key) !== RTO_COST[key]);
  const estimate = calculateRecoveryEstimate({ cod, rtoPct: rto, cart, aov, forwardCost: cost('forward'), returnCost: cost('return'), packagingCost: cost('packaging'), acquisitionCost: cost('acquisition'), extraMonthlyCost: 0 });
  const monthlyLoss = estimate.rtoCost;
  // Shipping and packaging avoided per prevented RTO. Ad spend is already paid, so it is never counted as a saving.
  const [low, high] = estimate.outcomes;
  const parcels = 24;
  const redCount = Math.round((rto / 100) * parcels);
  const savedCount = withAgent ? Math.round(redCount * 0.3) : 0;
  return <section className={styles.lossSection} id="calc" aria-labelledby="calc-title">
    <div className={styles.sectionHead}>
      <a href="#calc-sliders" className={styles.challengeBadge}><Calculator size={16} weight="fill" aria-hidden="true" /><span>RTO calculator</span><b>Try it now</b></a>
      <h2 id="calc-title">Move the sliders. Watch your RTO bill.</h2>
      <p>No form, no email. Just your numbers.</p>
    </div>
    <div className={styles.lossGrid} id="calc-sliders">
      <div className={styles.lossControls}>
        <Slider label="COD orders per month" value={cod} min={200} max={10000} step={100} onChange={touch(setCod)} format={(value) => `${value.toLocaleString('en-IN')}${value >= 10000 ? '+' : ''}`} />
        <Slider label="RTO rate on COD" value={rto} min={5} max={60} step={1} onChange={touch(setRto)} format={(value) => `${value}%`} />
        <Slider label="Average order value" value={aov} min={300} max={3000} step={50} onChange={touch(setAov)} format={(value) => `${formatInr(value)}${value >= 3000 ? '+' : ''}`} />
        <Slider label="Abandoned checkouts per month" value={cart} min={0} max={10000} step={50} onChange={touch(setCart)} format={(value) => `${value.toLocaleString('en-IN')}${value >= 10000 ? '+' : ''}`} />
        <details className={styles.costEditor}>
          <summary>Cost per RTO: {formatInr(estimate.costPerRto + estimate.acquisitionCostPerOrder)}{costsEdited ? ' · your numbers' : ' · sample'}<CaretDown size={14} aria-hidden="true" /></summary>
          <div className={styles.costFields}>
            {COST_FIELDS.map(({ key, label }) => <label key={key}>
              <span>{label}</span>
              <span className={styles.costInput}><b aria-hidden="true">₹</b><input type="number" inputMode="numeric" min={0} step={1} value={costs[key]} onChange={(event) => { markStarted(); setCosts((old) => ({ ...old, [key]: event.target.value })); }} /></span>
            </label>)}
          </div>
          {costsEdited && <button type="button" className={styles.costReset} onClick={() => setCosts({ forward: String(RTO_COST.forward), return: String(RTO_COST.return), packaging: String(RTO_COST.packaging), acquisition: String(RTO_COST.acquisition) })}>Reset to sample costs</button>}
        </details>
        <p className={styles.lossAssumption}>Savings count only shipping and packaging, because ad spend is already paid. Assumes a {low.reduction}–{high.reduction}% reduction in RTO{cart > 0 ? ` and ${low.checkoutRecoveryPct}–${high.checkoutRecoveryPct}% of abandoned checkouts recovered` : ''}. Every store is different. The trial measures yours.</p>
      </div>
      <div className={styles.lossResult}>
        <p className={styles.lossLabel}>RTO is costing you</p>
        <p className={styles.lossBig}>{formatInr(monthlyLoss)}<small>/month</small></p>
        <p className={styles.lossYear}>{formatInr(monthlyLoss * 12)} a year · {Math.round(estimate.rtoOrders).toLocaleString('en-IN')} parcels coming back every month</p>
        {estimate.adCostPerDeliveredOrder !== undefined && estimate.reportedRoas !== undefined && estimate.realRoas !== undefined && <dl className={styles.adReality}>
          <div><dt>Ad cost per delivered order</dt><dd>{formatInr(estimate.adCostPerDeliveredOrder)}<small>not {formatInr(estimate.acquisitionCostPerOrder)}</small></dd></div>
          <div><dt>Real ROAS on COD</dt><dd>{estimate.realRoas.toFixed(1)}x<small>Meta shows {estimate.reportedRoas.toFixed(1)}x</small></dd></div>
        </dl>}
        {cart > 0 && <p className={styles.cartLoss}><span>Carts left at checkout</span><strong>{formatInr(estimate.checkoutValue)}<small>/month</small></strong><em>{cart.toLocaleString('en-IN')} abandoned checkouts × {formatInr(aov)}</em></p>}
        <div className={styles.parcelGrid} aria-hidden="true">
          {Array.from({ length: parcels }, (_, index) => {
            const isRed = index < redCount;
            const isSaved = isRed && index < savedCount;
            return <span key={index} className={`${styles.parcel} ${isRed ? styles.parcelRed : ''} ${isSaved ? styles.parcelSaved : ''}`} style={{ transitionDelay: `${index * 18}ms` }}><Package size={18} weight="fill" /></span>;
          })}
        </div>
        <button type="button" className={`${styles.agentToggle} ${withAgent ? styles.agentToggleOn : ''}`} aria-pressed={withAgent} onClick={() => { setWithAgent((value) => !value); trackEvent('calculator_completed', { source: 'live_sliders', cod, rto, aov, cart, costs_edited: costsEdited }); }}>
          <span className={styles.toggleKnob} />{withAgent ? 'With RecoverAgent' : 'Show me with RecoverAgent'}
        </button>
        <AnimatePresence>
          {withAgent && <motion.div className={styles.savings} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <dl className={styles.savingsRows}>
              <div><dt>RTO shipping & packaging saved</dt><dd>{formatInr(low.rtoSavings)} – {formatInr(high.rtoSavings)}</dd></div>
              {cart > 0 && <div><dt>Abandoned carts recovered ({Math.round(low.recoveredCheckouts).toLocaleString('en-IN')}–{Math.round(high.recoveredCheckouts).toLocaleString('en-IN')} orders)</dt><dd>{formatInr(low.recoveredRevenue)} – {formatInr(high.recoveredRevenue)} in sales</dd></div>}
              <div><dt>{estimate.plan.tier.name} plan fee</dt><dd>− {formatInr(estimate.plan.cost)}</dd></div>
            </dl>
            <p>{cart > 0 ? 'Back each month, before the plan fee' : 'Estimated saving after the plan fee'}</p>
            <strong>{cart > 0 ? `${formatInr(low.recoveryValue)} – ${formatInr(high.recoveryValue)}` : `${formatInr(Math.max(0, low.rtoSavings - estimate.plan.cost))} – ${formatInr(Math.max(0, high.rtoSavings - estimate.plan.cost))}`}<small>/month</small></strong>
          </motion.div>}
        </AnimatePresence>
        <TrialButton onClick={() => { trackEvent('calculator_cta_clicked', { source: 'live_sliders' }); onTrial(); }} source="calculator">Measure it on my orders, free</TrialButton>
      </div>
    </div>
  </section>;
}

/* ───────────────────────── Trial plan ───────────────────────── */

export function TrialSection() {
  const onTrial = useTrial();
  const steps = [
    { day: 'Day 1', title: 'Connect your store', text: 'Share your Shopify or WooCommerce store. On a short setup call we agree your language, call timing and rules.', icon: Storefront },
    { day: 'Day 2–3', title: 'Go live on real orders', text: 'The AI starts calling your COD buyers. Every call, recording and outcome appears on your dashboard.', icon: Lightning },
    { day: 'Day 4–13', title: 'Watch RTO move', text: 'See confirmed, cancelled and unreachable orders before they ship. Your team only handles exceptions.', icon: ChartLineUp },
    { day: 'Day 14', title: 'Decide with real numbers', text: 'We review your results with you. Continue only if the numbers work for your store.', icon: CalendarCheck },
  ];
  return <section className={styles.trialSection} id="trial" aria-labelledby="trial-title">
    <div className={styles.sectionHead}>
      <p className={styles.eyebrowLight}>14-day free trial</p>
      <h2 id="trial-title">Don’t take our word for it. Take your own numbers.</h2>
      <p>A demo shows you our results. A trial shows you yours. Here is exactly what happens.</p>
    </div>
    <ol className={styles.trialTimeline}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        return <motion.li key={step.day} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: index * 0.1, duration: 0.5 }}>
          <span className={styles.trialIcon}><Icon size={22} weight="duotone" /></span>
          <small>{step.day}</small>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </motion.li>;
      })}
    </ol>
    <div className={styles.trialCta}>
      <TrialButton onClick={onTrial} source="trial_section" />
      <ul className={styles.trustRow}>
        <li><ShieldCheck size={17} weight="fill" aria-hidden="true" />Zero setup fee</li>
        <li><ShieldCheck size={17} weight="fill" aria-hidden="true" />No annual lock-in</li>
        <li><UserSwitch size={17} weight="fill" aria-hidden="true" />Human handoff for any escalation</li>
      </ul>
    </div>
  </section>;
}

/* ───────────────────────── Quotes (hidden until real quotes exist) ───────────────────────── */

export function QuotesSection() {
  if (!CUSTOMER_QUOTES.length) return null;
  return <section className={styles.quotesSection} aria-labelledby="quotes-title">
    <div className={styles.sectionHead}><p className={styles.eyebrow}>From D2C teams</p><h2 id="quotes-title">What founders and ops teams say.</h2></div>
    <div className={styles.quoteGrid}>
      {CUSTOMER_QUOTES.map((quote) => <figure key={quote.name} className={styles.quoteCard}>
        {quote.metric && <p className={styles.quoteMetric}>{quote.metric}</p>}
        <blockquote>“{quote.quote}”</blockquote>
        <figcaption>{quote.photo && <Image src={quote.photo} width={44} height={44} alt="" />}<span><strong>{quote.name}</strong><small>{quote.role}, {quote.brand}</small></span></figcaption>
      </figure>)}
    </div>
  </section>;
}

/* ───────────────────────── Pricing ───────────────────────── */

export function PricingSection() {
  const onTrial = useTrial();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  useEffect(() => { if (inView) trackEvent('pricing_viewed'); }, [inView]);
  const taglines = { starter: 'Verify COD before dispatch', growth: 'Verify COD + recover checkouts', scale: 'COD, checkout + failed delivery recovery' };
  return <section ref={ref} className={styles.pricingSection} id="pricing" aria-labelledby="pricing-title">
    <div className={styles.sectionHead}>
      <p className={styles.eyebrow}>Pricing</p>
      <h2 id="pricing-title">Every plan starts with 14 days free.</h2>
      <p>Priced per order. Pick the workflows your store needs. Zero setup fee and no annual lock-in.</p>
    </div>
    <div className={styles.pricingGrid}>
      {PRICING_TIERS.map((tier) => <article key={tier.id} className={`${styles.pricingCard} ${tier.recommended ? styles.pricingRecommended : ''}`}>
        <div className={styles.pricingTitle}><h3>{tier.name}</h3>{tier.recommended && <span>Most popular</span>}</div>
        <p className={styles.pricingTagline}>{taglines[tier.id]}</p>
        <p className={styles.pricingPrice}>₹{tier.base.toLocaleString('en-IN')}<span>/month</span></p>
        <p className={styles.pricingAllowance}>{tier.includedCalls.toLocaleString('en-IN')} orders included · ₹{tier.overagePerOrder} per extra order</p>
        <ul className={styles.pricingFeatures}>
          {PLAN_FEATURE_ROWS.map((row) => {
            const included = PLAN_FEATURES[tier.id][row.key];
            return <li key={row.key} className={included ? '' : styles.pricingOff}>
              {included ? <Check size={16} weight="bold" aria-hidden="true" /> : <X size={14} aria-hidden="true" />}
              <span>{row.label}{!included && <span className={styles.srOnly}> (not included)</span>}</span>
            </li>;
          })}
        </ul>
        <button type="button" className={tier.recommended ? styles.trialButton : styles.outlineButton} onClick={() => { trackEvent('cta_clicked', { cta: 'start_trial', source: 'pricing', tier: tier.id }); onTrial(); }}>Start free trial <ArrowRight size={16} aria-hidden="true" /></button>
      </article>)}
    </div>
    <div className={styles.whatsappIncluded}>
      <p><WhatsappLogo size={20} weight="fill" aria-hidden="true" /><strong>WhatsApp flows in every plan:</strong></p>
      <ul>{ALL_PLANS_WHATSAPP.map((feature) => <li key={feature}>{feature}</li>)}</ul>
    </div>
    <p className={styles.pricingNote}>Each COD order or abandoned checkout counts once for billing. Doing more than 1,800 orders a month? Start a trial and we will size a plan to your volume.</p>
  </section>;
}

/* ───────────────────────── FAQ ───────────────────────── */

const trialFaqs = [
  { q: 'What do I get in the 14-day free trial?', a: 'AI calls on your real COD orders, WhatsApp follow-up and the full dashboard, set up with your team on a short call. You see confirmed, cancelled and unreachable orders from your own store, with zero setup fee.' },
  { q: 'What happens after 14 days?', a: 'We review your trial results with you. If the numbers work, you choose a plan and continue. There is no annual lock-in.' },
  { q: 'Who can start a trial?', a: 'Shopify and WooCommerce stores doing 500 or more orders a month go straight to a setup call. Smaller stores can request an onboarding call to explore WhatsApp recovery.' },
];

// Answers confirmed against the product; they replace the generic shared versions on this page.
const faqOverrides: Record<string, string> = {
  'Can it speak Indian languages?': 'Yes. Calls run in English, Hindi, Tamil, Telugu, Kannada and Malayalam. The language and voice are set up for your store during onboarding.',
  'Does Recover Agent work with Shopify and WooCommerce?': 'Yes. Shopify connects in one click and WooCommerce is supported too. Abandoned checkouts can also come from GoKwik and Fastrr. For failed deliveries we work with Shiprocket and Delhivery.',
  'What happens when a call is unanswered?': 'For COD and failed deliveries the call is retried up to 3 times at the gaps you choose, and a WhatsApp follow-up can go out in between. If the buyer is still unreachable, the order is marked for your team. Your team always controls what ships.',
};

export function FaqSection() {
  const items = [...trialFaqs, ...faqs.filter((item) => item.question !== 'Who can book a live demo?').map((item) => ({ q: item.question, a: faqOverrides[item.question] ?? item.answer }))];
  return <section className={styles.faqSection} id="faq" aria-labelledby="faq-title">
    <div className={styles.sectionHead}><p className={styles.eyebrow}>FAQ</p><h2 id="faq-title">Questions founders and ops teams ask.</h2></div>
    <div className={styles.faqList}>
      {items.map((item) => <details key={item.q} onToggle={(event) => { if ((event.currentTarget as HTMLDetailsElement).open) trackEvent('faq_opened', { question: item.q }); }}>
        <summary>{item.q}<CaretDown size={18} aria-hidden="true" /></summary>
        <p>{item.a}</p>
      </details>)}
    </div>
  </section>;
}

/* ───────────────────────── Final CTA with inline form ───────────────────────── */

export function FinalSection() {
  return <section className={styles.finalSection} id="start" aria-labelledby="final-title">
    <div className={styles.finalInner}>
      <div className={styles.finalCopy}>
        <p className={styles.eyebrowLight}>Start today</p>
        <h2 id="final-title">See your RTO drop on your own orders, free for 14 days.</h2>
        <ul>
          <li><CheckCircle size={20} weight="fill" aria-hidden="true" />AI calls on your real COD orders</li>
          <li><CheckCircle size={20} weight="fill" aria-hidden="true" />WhatsApp follow-up and full dashboard</li>
          <li><CheckCircle size={20} weight="fill" aria-hidden="true" />Results reviewed with you on day 14</li>
          <li><CheckCircle size={20} weight="fill" aria-hidden="true" />Zero setup fee · No annual lock-in</li>
        </ul>
        <a className={styles.finalCall} href="tel:+919788274333"><PhoneCall size={18} weight="bold" aria-hidden="true" />Prefer to talk first? Call +91 97882 74333</a>
      </div>
      <div className={styles.finalForm}><DemoBooking compact mode="trial" sectionId="inline-trial-signup" /></div>
    </div>
  </section>;
}

/* ───────────────────────── Trial dialog ───────────────────────── */

function TrialDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
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
  return <AnimatePresence>{open && <motion.div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="trial-dialog-title" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.div ref={dialogRef} className={styles.dialogShell} initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
      <button ref={closeRef} type="button" className={styles.dialogClose} onClick={onClose} aria-label="Close"><X size={21} /></button>
      <div className={styles.dialogIntro}>
        <p className={styles.eyebrowLight}>14-day free trial</p>
        <h2 id="trial-dialog-title">Start recovering orders this week.</h2>
        <ul>
          <li><ClockCountdown size={17} aria-hidden="true" />Short setup call with our team</li>
          <li><PhoneCall size={17} aria-hidden="true" />AI calls on your real COD orders</li>
          <li><ChartLineUp size={17} aria-hidden="true" />Results reviewed with you on day 14</li>
        </ul>
      </div>
      <div className={styles.dialogForm}><DemoBooking compact mode="trial" sectionId="dialog-trial-signup" /></div>
    </motion.div>
  </motion.div>}</AnimatePresence>;
}

/* ───────────────────────── Site footer ───────────────────────── */

const footerColumns = [
  { title: 'Product', links: [['How it works', '/how-it-works'], ['Hear a call', '/hear-a-call'], ['Control room', '/control-room'], ['Voice + WhatsApp', '/why-calling'], ['WhatsApp Agent', '/whatsapp']] },
  { title: 'Use cases', links: [['COD verification', '/cod-verification'], ['Abandoned checkout recovery', '/abandoned-checkout-recovery'], ['NDR recovery', '/ndr-recovery'], ['Where brands leak', '/where-you-leak']] },
  { title: 'Plan', links: [['Pricing', '/plans'], ['RTO calculator', '/loss-calculator'], ['Free trial', '/book-demo'], ['Onboarding', '/go-live'], ['FAQ', '/faq']] },
  { title: 'Resources', links: [['Guides', '/blog'], ['Contact', 'mailto:hello@recoveragent.ai'], ['Call +91 97882 74333', 'tel:+919788274333']] },
] as const;

export function SiteFooter() {
  return <footer className={styles.siteFooter}>
    <div className={styles.footerInner}>
      <div className={styles.footerBrand}>
        <Image src="/recover-agent-logo-transparent.png" width={500} height={250} alt="RecoverAgent" />
        <p>AI calls and WhatsApp that stop RTO before it ships. Built for Indian D2C brands.</p>
        <p className={styles.footerTrial}><span className={styles.pulseDot} />14-day free trial on every plan</p>
      </div>
      {footerColumns.map((column) => <nav key={column.title} aria-label={column.title}>
        <p>{column.title}</p>
        {column.links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>)}
    </div>
    <p className={styles.footerBottom}>© {new Date().getFullYear()} RecoverAgent. All rights reserved.</p>
  </footer>;
}

/* ───────────────────────── Shared frame: header, footer, sticky bar, trial dialog ───────────────────────── */

export function TrialSiteFrame({ children, isHome = false }: { children: React.ReactNode; isHome?: boolean }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const openTrial = useCallback(() => setDialogOpen(true), []);
  const closeTrial = useCallback(() => setDialogOpen(false), []);

  useEffect(() => {
    // Hide the sticky bar while the page top or the final sign-up form is on screen.
    const watched = ['top', 'start'].map((id) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
    const visible = new Map<Element, boolean>();
    const update = () => setShowSticky(window.scrollY > 320 && !watched.some((element) => visible.get(element)));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target, entry.isIntersecting));
      update();
    }, { threshold: 0.05 });
    watched.forEach((element) => observer.observe(element));
    window.addEventListener('scroll', update, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener('scroll', update); };
  }, []);

  return <TrialContext.Provider value={openTrial}>
    <div className={styles.page}>
      <div inert={dialogOpen ? true : undefined}>
        <Header isHome={isHome} />
        <main>{children}</main>
        <SiteFooter />
        <div className={`${styles.mobileSticky} ${showSticky ? styles.mobileStickyVisible : ''}`} aria-hidden={!showSticky}>
          <button type="button" onClick={() => { trackEvent('sticky_cta_clicked', { cta: 'start_trial' }); openTrial(); }} tabIndex={showSticky ? 0 : -1}>Start 14-day free trial <ArrowRight size={16} aria-hidden="true" /></button>
          <a href="tel:+919788274333" aria-label="Call +91 97882 74333" tabIndex={showSticky ? 0 : -1}><PhoneCall size={22} weight="bold" aria-hidden="true" /></a>
        </div>
      </div>
      <TrialDialog open={dialogOpen} onClose={closeTrial} />
    </div>
  </TrialContext.Provider>;
}

/* ───────────────────────── Sub page header ───────────────────────── */

export function PageHero({ eyebrow, title, description, crumbs, showCtas = true }: { eyebrow?: string; title: string; description?: string; crumbs: Array<{ href?: string; label: string }>; showCtas?: boolean }) {
  const onTrial = useTrial();
  return <section className={styles.pageHero} id="top">
    <div className={styles.heroGrid} aria-hidden="true" />
    <div className={styles.pageHeroInner}>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        {crumbs.map((crumb, index) => <span key={crumb.label}>
          {index > 0 && <span aria-hidden="true">/</span>}
          {crumb.href ? <a href={crumb.href}>{crumb.label}</a> : <span aria-current="page">{crumb.label}</span>}
        </span>)}
      </nav>
      {eyebrow && <p className={styles.eyebrowLight}>{eyebrow}</p>}
      <h1>{title}</h1>
      {description && <p className={styles.pageHeroLead}>{description}</p>}
      {showCtas && <div className={styles.heroActions}>
        <TrialButton onClick={onTrial} source="page_hero" />
        <Link className={styles.ghostButton} href="/hear-a-call"><Play size={17} weight="fill" aria-hidden="true" />Hear a real call</Link>
      </div>}
    </div>
  </section>;
}

/* ───────────────────────── Homepage ───────────────────────── */

export function TrialHomepage() {
  return <TrialSiteFrame isHome>
    <Hero />
    <IntegrationStrip />
    <ProofBand />
    <CaseStudySection />
    <ProblemSection />
    <ShipOrHoldGame />
    <StorySection />
    <WhatsAppSection />
    <LossSection />
    <SafetySection />
    <TrialSection />
    <QuotesSection />
    <PricingSection />
    <FaqSection />
    <FinalSection />
  </TrialSiteFrame>;
}
