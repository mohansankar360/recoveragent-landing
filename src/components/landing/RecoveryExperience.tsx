'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight, Brain, CaretDown, ChartLineUp, Check, CheckCircle,
  ClockCountdown, Headphones, List, Pause, PhoneCall, Play,
  Storefront, WhatsappLogo, X,
} from '@phosphor-icons/react';
import { DemoBooking } from './DemoBooking';
import styles from './RecoveryExperience.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type UseCaseKey = 'cod' | 'checkout' | 'ndr';
type ControlFilter = 'all' | 'calling' | 'recovered' | 'followup';

const useCases: Record<UseCaseKey, { short: string; title: string; problem: string; response: string; action: string; metric: string }> = {
  cod: { short: 'COD confirmation', title: 'Stop avoidable RTO before fulfilment.', problem: 'New COD orders enter a queue while intent is still fresh.', response: 'The agent calls in the customer\'s language and handles common objections.', action: 'Confirmed orders stay. Risky orders route to WhatsApp or review.', metric: 'Confirm intent before dispatch' },
  checkout: { short: 'Checkout recovery', title: 'Bring high-intent shoppers back to checkout.', problem: 'A payment or trust question interrupts a nearly completed purchase.', response: 'The agent calls at the right moment and answers the specific hesitation.', action: 'A secure checkout link is shared on WhatsApp while intent is live.', metric: 'Recover revenue while intent is warm' },
  ndr: { short: 'NDR rescue', title: 'Resolve failed deliveries while they are recoverable.', problem: 'A failed attempt creates delay, support work and return risk.', response: 'The agent confirms availability, address detail or a new delivery window.', action: 'The response updates the delivery workflow for the operations team.', metric: 'Turn failed attempts into redeliveries' },
};

const controlRows = [
  { id: '#RA-4821', customer: 'Ananya S.', type: 'COD confirmation', status: 'calling', value: '₹1,849', time: 'Live now' },
  { id: '#RA-4818', customer: 'Rohit M.', type: 'Checkout recovery', status: 'recovered', value: '₹2,430', time: '4 min ago' },
  { id: '#RA-4814', customer: 'Meera P.', type: 'NDR rescue', status: 'followup', value: '₹1,299', time: '11 min ago' },
  { id: '#RA-4809', customer: 'Kabir A.', type: 'COD confirmation', status: 'recovered', value: '₹3,180', time: '18 min ago' },
] as const;

const transcript = [
  { speaker: 'Agent', line: 'Namaste, aapne Urban Loom par ₹1,849 ka order place kiya tha.' },
  { speaker: 'Customer', line: 'Haan, size ko lekar ek doubt tha.' },
  { speaker: 'Agent', line: 'Main size guide WhatsApp par share kar rahi hoon. Kya main order confirm kar doon?' },
  { speaker: 'Customer', line: 'Yes, please confirm it.' },
];

function Mark() {
  return <span className={styles.mark} aria-hidden="true"><i /><i /><i /><i /><i /></span>;
}

function BookButton({ onClick, className = '', children = 'Book a demo' }: { onClick: () => void; className?: string; children?: React.ReactNode }) {
  const magneticAttributes = { string: 'magnetic', 'string-strength': '0.12', 'string-radius': '120' } as Record<string, string>;
  return <button {...magneticAttributes} type="button" className={`${styles.primaryButton} ${className}`} onClick={onClick}>{children}<ArrowRight size={16} weight="bold" /></button>;
}

function Art({ src, alt, position = 'center', priority = false }: { src: string; alt: string; position?: string; priority?: boolean }) {
  return <figure className={styles.art} data-art><Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 900px) 94vw, 52vw" style={{ objectPosition: position }} /></figure>;
}

function Header({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className={styles.header}>
    <a className={styles.brand} href="#top" aria-label="RecoverAgent home" onClick={close}><Mark /><span>RecoverAgent</span></a>
    <nav className={styles.desktopNav} aria-label="Primary navigation"><a href="#how-it-works">How it works</a><a href="#call">Hear a call</a><a href="#use-cases">Use cases</a><a href="#roi">ROI</a></nav>
    <BookButton onClick={onBook} className={styles.headerCta} />
    <button className={styles.menuButton} type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X size={22} /> : <List size={22} />}</button>
    {open && <nav className={styles.mobileNav} aria-label="Mobile navigation"><a href="#how-it-works" onClick={close}>How it works</a><a href="#call" onClick={close}>Hear a call</a><a href="#use-cases" onClick={close}>Use cases</a><a href="#roi" onClick={close}>ROI model</a><button type="button" onClick={() => { close(); onBook(); }}>Book a demo <ArrowRight size={16} /></button></nav>}
  </header>;
}

function Hero({ onBook }: { onBook: () => void }) {
  const [runState, setRunState] = useState<'ready' | 'calling' | 'resolved'>('ready');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const runCall = () => { if (timer.current) clearTimeout(timer.current); setRunState('calling'); timer.current = setTimeout(() => setRunState('resolved'), 1800); };
  return <section className={styles.hero} id="top">
    <div className={styles.heroGlow} aria-hidden="true" />
    <div className={styles.heroCopy} data-reveal><p className={styles.kicker}>AI voice recovery for D2C</p><h1>Recover leaked D2C revenue.</h1><p className={styles.heroLead}>AI calls after COD, checkout and NDR events, then pushes the next action into your workflow.</p><div className={styles.heroActions}><BookButton onClick={onBook} /><a className={styles.secondaryButton} href="#call"><Headphones size={17} /> Hear a sample call</a></div></div>
    <div className={styles.heroProduct} data-reveal>
      <Art src="/media/recoveragent-hero-v2.png" alt="A D2C parcel connected to an active AI voice call." position="68% center" priority />
      <div className={styles.liveConsole}><div className={styles.consoleHeader}><span className={styles.liveDot} />Sample recovery <small>Order #RA-4821</small></div><div className={styles.customerRow}><span className={styles.avatar}>AS</span><span><strong>Ananya Sharma</strong><small>COD / ₹1,849 / Hindi</small></span><PhoneCall size={20} /></div><div className={styles.consoleSteps}><span className={runState !== 'ready' ? styles.stepDone : ''}><Check size={13} /> Order received</span><span className={runState === 'calling' ? styles.stepActive : runState === 'resolved' ? styles.stepDone : ''}><PhoneCall size={13} /> AI call</span><span className={runState === 'resolved' ? styles.stepDone : ''}><WhatsappLogo size={13} /> Action synced</span></div><button type="button" onClick={runCall} disabled={runState === 'calling'}>{runState === 'ready' && <>Run sample call <ArrowRight size={15} /></>}{runState === 'calling' && <><span className={styles.callPulse} /> Calling customer...</>}{runState === 'resolved' && <><CheckCircle size={17} weight="fill" /> Order confirmed</>}</button></div>
    </div>
  </section>;
}

function Coverage() {
  return <section className={styles.coverage} aria-label="RecoverAgent product coverage" data-reveal><span><Storefront size={18} />Shopify and WooCommerce events</span><span><PhoneCall size={18} />Hindi and English voice calls</span><span><WhatsappLogo size={18} />WhatsApp follow-up actions</span></section>;
}

function Roi({ onBook }: { onBook: () => void }) {
  const [orders, setOrders] = useState(3000); const [rto, setRto] = useState(22); const [aov, setAov] = useState(1350);
  const result = useMemo(() => { const exposed = orders * (rto / 100) * aov; return { low: Math.round(exposed * 0.16), high: Math.round(exposed * 0.25), exposed: Math.round(exposed) }; }, [orders, rto, aov]);
  const money = (value: number) => `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}`;
  return <section className={`${styles.section} ${styles.roi}`} id="roi"><div className={styles.sectionHeading} data-reveal><h2>See the leak before you solve it.</h2><p>Use your current order volume, RTO rate and AOV. The assumption stays visible.</p></div><div className={styles.roiGrid}><div className={styles.calculator} data-reveal><div className={styles.modelTop}><span>Recovery model</span><span>Editable</span></div><label><span>Monthly orders <strong>{orders.toLocaleString('en-IN')}</strong></span><input aria-label="Monthly orders" type="range" min="500" max="20000" step="100" value={orders} onChange={(event) => setOrders(Number(event.target.value))} /></label><label><span>RTO rate <strong>{rto}%</strong></span><input aria-label="RTO rate" type="range" min="5" max="45" value={rto} onChange={(event) => setRto(Number(event.target.value))} /></label><label><span>Average order value <strong>{money(aov)}</strong></span><input aria-label="Average order value" type="range" min="300" max="5000" step="50" value={aov} onChange={(event) => setAov(Number(event.target.value))} /></label><div className={styles.exposure}><span>Revenue exposed to RTO</span><strong>{money(result.exposed)} / month</strong></div><div className={styles.protected}><span>Modeled revenue protected</span><strong>{money(result.low)} to {money(result.high)}</strong><small>Illustrative range using a 16% to 25% recovery assumption.</small></div><BookButton onClick={onBook} /></div><aside className={styles.roiContext} data-reveal><p>What this model tells you</p><h3>The size of the opportunity, before a sales call.</h3><ol><li><span>01</span><strong>Your inputs</strong><small>Nothing is hidden behind a benchmark.</small></li><li><span>02</span><strong>A visible assumption</strong><small>Change the range during the demo.</small></li><li><span>03</span><strong>A rollout decision</strong><small>Start with the leak carrying the most exposure.</small></li></ol></aside></div></section>;
}

function CallStudio() {
  const audioRef = useRef<HTMLAudioElement>(null); const [playing, setPlaying] = useState(false); const [current, setCurrent] = useState(0); const [duration, setDuration] = useState(20);
  const activeLine = Math.min(transcript.length - 1, Math.floor((current / Math.max(duration, 1)) * transcript.length));
  const format = (seconds: number) => `0:${Math.floor(seconds).toString().padStart(2, '0')}`;
  const toggle = async () => { const audio = audioRef.current; if (!audio) return; if (audio.paused) { try { await audio.play(); } catch { setPlaying(false); } } else audio.pause(); };
  return <section className={`${styles.section} ${styles.callSection}`} id="call"><div className={styles.callGrid}><div className={styles.callCopy} data-reveal><p className={styles.kicker}>Hear the product</p><h2>Listen before you book.</h2><p>Play a sample Hindi checkout call. Follow the transcript from hesitation to confirmed intent.</p><div className={styles.callOutcome}><CheckCircle size={22} weight="fill" /><span><strong>Intent detected</strong><small>Size concern resolved. Order confirmed.</small></span></div></div><div className={styles.player} data-reveal><div className={styles.playerTop}><span><span className={styles.liveDot} /> Sample checkout recovery</span><span>Hindi</span></div><div className={styles.waveform} aria-hidden="true">{Array.from({ length: 42 }, (_, index) => <i key={index} className={index / 42 <= current / Math.max(duration, 1) ? styles.wavePlayed : ''} style={{ height: `${16 + ((index * 17) % 39)}%` }} />)}</div><div className={styles.playerControls}><button type="button" onClick={toggle} aria-label={playing ? 'Pause call recording' : 'Play call recording'}>{playing ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}</button><input aria-label="Call progress" type="range" min="0" max={duration || 20} step="0.1" value={current} onChange={(event) => { const next = Number(event.target.value); if (audioRef.current) audioRef.current.currentTime = next; setCurrent(next); }} /><span>{format(current)} / {format(duration)}</span></div><div className={styles.transcript} aria-live="polite">{transcript.map((item, index) => <div key={item.line} className={index === activeLine ? styles.transcriptActive : ''}><span>{item.speaker}</span><p>{item.line}</p></div>)}</div><audio ref={audioRef} src="/audio/abandoned_hindi.mp3" preload="metadata" onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 20)} onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setCurrent(0); }} /></div></div></section>;
}

function HowItWorks() {
  const [active, setActive] = useState(0);
  const steps = [{ icon: Storefront, title: 'A store event starts the recovery', body: 'New COD, abandoned checkout or failed delivery data enters the right workflow.' }, { icon: PhoneCall, title: 'The AI agent speaks with the customer', body: 'Natural voice handles language, questions and interruptions without a rigid script.' }, { icon: Brain, title: 'Intent becomes an operational action', body: 'Confirm, reschedule, share a link or route an exception with the full context attached.' }];
  return <section className={`${styles.section} ${styles.mechanism}`} id="how-it-works"><div className={styles.mechanismSticky} data-process-visual><div className={styles.sectionHeading} data-reveal><h2>The call is only the middle.</h2><p>RecoverAgent connects the store event, customer conversation and operational action.</p></div><div className={styles.processVisual} aria-live="polite"><span>{active + 1} / {steps.length}</span>{(() => { const Icon = steps[active].icon; return <Icon size={38} weight="duotone" />; })()}<strong>{steps[active].title}</strong><p>{steps[active].body}</p></div></div><div className={styles.stepRail}>{steps.map((step, index) => { const Icon = step.icon; return <button key={step.title} type="button" className={active === index ? styles.activeStep : ''} onClick={() => setActive(index)} data-process-step data-step={index}><span className={styles.stepNumber}>0{index + 1}</span><Icon size={26} /><span><strong>{step.title}</strong><small>{step.body}</small></span><ArrowRight size={18} /></button>; })}</div></section>;
}

function UseCases() {
  const [active, setActive] = useState<UseCaseKey>('cod');
  return <section className={`${styles.section} ${styles.useCaseSection}`} id="use-cases"><div className={styles.sectionHeading} data-reveal><h2>Use voice where delay costs revenue.</h2><p>Choose a workflow to see the trigger, conversation and action.</p></div><div className={styles.useCaseGrid} data-reveal><div className={styles.useTabs} role="tablist" aria-label="Recovery workflows">{(Object.keys(useCases) as UseCaseKey[]).map((key) => <button key={key} type="button" role="tab" aria-selected={active === key} className={active === key ? styles.useTabActive : ''} onClick={() => setActive(key)}><span>{useCases[key].short}</span><CaretDown size={17} /></button>)}</div><div className={styles.usePanel} role="tabpanel"><p className={styles.metric}>{useCases[active].metric}</p><h3>{useCases[active].title}</h3><ol><li><span>Trigger</span>{useCases[active].problem}</li><li><span>Conversation</span>{useCases[active].response}</li><li><span>Action</span>{useCases[active].action}</li></ol></div></div></section>;
}

function ControlRoom() {
  const [filter, setFilter] = useState<ControlFilter>('all'); const filtered = controlRows.filter((row) => filter === 'all' || row.status === filter);
  return <section className={`${styles.section} ${styles.controlSection}`} id="control-room"><div className={styles.sectionHeading} data-reveal><h2>Know what happened after every call.</h2><p>Filter recoveries, inspect intent and see the next action from one working view.</p></div><div className={styles.controlLayout}><div className={styles.controlBoard} data-reveal><div className={styles.controlTop}><span><Mark />Live control room</span><small>Sample product view</small></div><div className={styles.filterTabs} role="tablist" aria-label="Filter recovery activity">{(['all', 'calling', 'recovered', 'followup'] as ControlFilter[]).map((key) => <button key={key} type="button" role="tab" aria-selected={filter === key} onClick={() => setFilter(key)}>{key === 'all' ? 'All activity' : key === 'followup' ? 'Follow up' : key[0].toUpperCase() + key.slice(1)}</button>)}</div><div className={styles.controlRows} aria-live="polite">{filtered.map((row) => <article key={row.id}><span className={styles.rowIcon}>{row.status === 'calling' ? <PhoneCall size={18} /> : row.status === 'recovered' ? <CheckCircle size={18} weight="fill" /> : <ClockCountdown size={18} />}</span><span><strong>{row.customer}</strong><small>{row.id} / {row.type}</small></span><span className={`${styles.status} ${styles[`status_${row.status}`]}`}>{row.status === 'followup' ? 'Follow up' : row.status}</span><span><strong>{row.value}</strong><small>{row.time}</small></span></article>)}</div><div className={styles.controlStats}><span><small>Connected today</small><strong>184</strong></span><span><small>Recovered</small><strong>₹74,280</strong></span><span><small>Needs review</small><strong>12</strong></span></div></div><aside className={styles.controlNote} data-reveal><ChartLineUp size={34} weight="duotone" /><h3>Conversation context stays attached to the order.</h3><p>Your team sees the outcome, the customer&apos;s intent and the next action without checking separate call logs.</p><small>Illustrative product data</small></aside></div></section>;
}

function Orchestration({ onBook }: { onBook: () => void }) {
  const [store, setStore] = useState<'shopify' | 'woocommerce'>('shopify');
  const nodes = [{ icon: Storefront, label: store === 'shopify' ? 'Shopify event' : 'WooCommerce event' }, { icon: PhoneCall, label: 'AI voice call' }, { icon: Brain, label: 'Intent detected' }, { icon: WhatsappLogo, label: 'WhatsApp action' }, { icon: ChartLineUp, label: 'Outcome tracked' }];
  return <section className={`${styles.section} ${styles.orchestration}`}><div className={styles.orchestrationCopy} data-reveal><h2>It fits the stack your team already runs.</h2><p>Choose your store. RecoverAgent listens for the event, runs the conversation and sends the outcome back.</p><div className={styles.storeSwitch} role="group" aria-label="Choose ecommerce platform"><button type="button" className={store === 'shopify' ? styles.storeActive : ''} onClick={() => setStore('shopify')}>Shopify</button><button type="button" className={store === 'woocommerce' ? styles.storeActive : ''} onClick={() => setStore('woocommerce')}>WooCommerce</button></div><BookButton onClick={onBook} /></div><div className={styles.flow} data-reveal>{nodes.map((node, index) => { const Icon = node.icon; return <div className={styles.flowNode} key={node.label}><span><Icon size={22} /></span><strong>{node.label}</strong>{index < nodes.length - 1 && <ArrowRight className={styles.flowArrow} size={17} />}</div>; })}</div></section>;
}

function FinalCta({ onBook }: { onBook: () => void }) {
  return <section className={styles.finalSection} id="demo-booking"><div className={styles.finalCopy} data-reveal><h2>Bring one revenue leak.</h2><p>In 30 minutes, we will map the trigger, customer conversation and operational action using your numbers.</p><BookButton onClick={onBook} /><small>No generic deck. You will leave with a clear first workflow.</small></div></section>;
}

function BookingDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute('hidden'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleDialogKeys);
    window.setTimeout(() => closeRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleDialogKeys);
      previousFocus?.focus();
    };
  }, [open, onClose]);
  if (!open) return null;
  return <div className={styles.bookingDialog} role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title" aria-describedby="booking-dialog-description" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div ref={dialogRef} className={styles.dialogShell}><button ref={closeRef} type="button" className={styles.dialogClose} onClick={onClose} aria-label="Close demo booking"><X size={22} /></button><div className={styles.dialogIntro}><Mark /><p className={styles.kicker}>Live product walkthrough</p><h2 id="booking-dialog-title">Let&apos;s map your biggest recovery leak.</h2><p id="booking-dialog-description">Bring your COD volume, checkout drop-off or NDR workflow. We will use your numbers, not a generic deck.</p><ul><li><Check size={15} />30-minute working session</li><li><Check size={15} />Your real order flow</li><li><Check size={15} />Clear rollout path</li></ul></div><div className={styles.dialogForm}><DemoBooking compact /></div></div></div>;
}

function Footer() { return <footer className={styles.footer}><a className={styles.brand} href="#top"><Mark /><span>RecoverAgent</span></a><p>AI voice recovery for ambitious D2C teams.</p><div><a href="mailto:hello@recoveragent.ai">Contact</a><a href="#top">Back to top</a></div></footer>; }

export function RecoveryExperience() {
  const pageRef = useRef<HTMLElement>(null); const [bookingOpen, setBookingOpen] = useState(false); const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const runtimeWindow = window as typeof window & { __recoverAgentStringTuneStarted?: boolean };
    if (runtimeWindow.__recoverAgentStringTuneStarted || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    runtimeWindow.__recoverAgentStringTuneStarted = true;
    void import('@fiddle-digital/string-tune').then(({ StringMagnetic, StringTune }) => {
      const stringTune = StringTune.getInstance();
      if (!stringTune.reuse(StringMagnetic)) stringTune.use(StringMagnetic, { strength: 0.12, radius: 120 });
      stringTune.scrollDesktopMode = 'default';
      stringTune.scrollMobileMode = 'default';
      stringTune.start(60);
    });
  }, []);
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => gsap.from(element, { opacity: 0, y: 34, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } }));
    gsap.utils.toArray<HTMLElement>('[data-art]').forEach((element) => gsap.fromTo(element, { yPercent: -2 }, { yPercent: 2, ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 1 } }));
  }, { scope: pageRef });
  useEffect(() => { const hero = document.getElementById('top'); if (!hero) return; const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0.12 }); observer.observe(hero); return () => observer.disconnect(); }, []);
  return <main ref={pageRef} className={styles.page}><Header onBook={() => setBookingOpen(true)} /><Hero onBook={() => setBookingOpen(true)} /><Coverage /><Roi onBook={() => setBookingOpen(true)} /><CallStudio /><HowItWorks /><UseCases /><ControlRoom /><Orchestration onBook={() => setBookingOpen(true)} /><FinalCta onBook={() => setBookingOpen(true)} /><Footer /><button type="button" className={`${styles.mobileSticky} ${showSticky ? styles.mobileStickyVisible : ''}`} onClick={() => setBookingOpen(true)}>Book a demo <ArrowRight size={16} /></button><BookingDialog open={bookingOpen} onClose={() => setBookingOpen(false)} /></main>;
}
