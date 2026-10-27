'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CalendarCheck,
  ChatCircleText,
  CheckCircle,
  CurrencyInr,
  IdentificationCard,
  ListChecks,
  List,
  X,
  Package,
  Pause,
  Phone,
  PhoneCall,
  Play,
  Prohibit,
  ShieldCheck,
  Storefront,
  Translate,
  TrendDown,
  Truck,
  WhatsappLogo,
} from '@phosphor-icons/react';
import { LeadCaptureForm } from '@/components/landing/LeadCaptureForm';
import { CALL_CAPTIONS, CALL_CAPTION_NOTES } from '@/lib/call-captions';
import { CASE_STUDY, COST_PER_RTO } from '@/lib/case-study';
import { PRICING_TIERS, formatInr } from '@/lib/calculator';
import { PLAN_FEATURES, PLAN_FEATURE_ROWS } from '@/lib/pricing-plans';
import { trackEvent } from '@/lib/analytics';
import styles from './LeadsLanding.module.css';

type CallKey = 'cod' | 'checkout' | 'ndr' | 'regional';

const CALLS: Record<CallKey, { tab: string; title: string; audio: string; language: string; outcome: string }> = {
  cod: {
    tab: 'COD check',
    title: 'Confirming a COD order before dispatch',
    audio: '/audio/COD_hindi.mp4',
    language: 'Hindi',
    outcome: 'Buyer denied the order — held before it shipped',
  },
  checkout: {
    tab: 'Abandoned cart',
    title: 'Calling a buyer who left at checkout',
    audio: '/audio/abandoned_hindi.mp3',
    language: 'Hindi',
    outcome: 'Order placed on the call — ₹899 COD',
  },
  ndr: {
    tab: 'Failed delivery',
    title: 'Rescheduling a failed delivery',
    audio: '/audio/NDR_english.mp4',
    language: 'English',
    outcome: 'Delivery rescheduled for the next day',
  },
  // Tab appears only once this recording exists in public/audio; add its captions in call-captions.ts.
  regional: {
    tab: 'Tamil',
    title: 'Confirming a COD order in Tamil',
    audio: '/audio/COD_tamil.mp3',
    language: 'Tamil',
    outcome: 'Order and address confirmed — ready to ship',
  },
};

const CALL_KEYS = Object.keys(CALLS) as CallKey[];
const BASE_CALL_KEYS = CALL_KEYS.filter((key) => key !== 'regional');

// Same live dashboard data as the homepage case study.
const PROOF = [
  { icon: PhoneCall, value: CASE_STUDY.orders.toLocaleString('en-IN'), label: 'COD orders called in 30 days' },
  { icon: Prohibit, value: CASE_STUDY.cancelled.toLocaleString('en-IN'), label: 'Unwanted orders stopped before shipping' },
  { icon: CurrencyInr, value: formatInr(CASE_STUDY.cancelled * COST_PER_RTO), label: 'RTO cost avoided in a month', tone: 'saved' },
] as const;

const STARTER = PRICING_TIERS[0];
const BREAK_EVEN_RTOS = Math.ceil(STARTER.base / COST_PER_RTO);

const JOBS = [
  {
    icon: Package,
    title: 'Confirms every COD order',
    detail: 'Calls the buyer before you ship, confirms the order and address, and flags orders nobody wants.',
    result: 'Fewer fake and impulse COD orders',
  },
  {
    icon: Storefront,
    title: 'Recovers abandoned checkouts',
    detail: 'Calls buyers who left at checkout, answers their questions and places the order or sends a payment link.',
    result: 'Lost carts turned into orders',
  },
  {
    icon: Truck,
    title: 'Saves failed deliveries',
    detail: 'Calls the buyer after a failed attempt, finds out what went wrong and books a re-attempt.',
    result: 'Fewer parcels coming back as RTO',
  },
] as const;

const TRAITS = [
  { icon: Translate, title: 'Speaks your buyer’s language', detail: 'Hindi, English and other Indian languages, including mixed Hinglish.' },
  { icon: ListChecks, title: 'No order slips through', detail: 'Every COD order, abandoned cart and NDR case is called. Unreachable buyers get retries and a WhatsApp follow-up.' },
  { icon: WhatsappLogo, title: 'Follows up on WhatsApp', detail: 'Sends product links, payment links and confirmations after the call.' },
  { icon: ShieldCheck, title: 'Your team stays in control', detail: 'Every call is recorded, tagged and visible. You decide what ships.' },
] as const;

const STEPS = [
  { icon: IdentificationCard, title: 'Share your details', detail: 'Takes under 30 seconds.' },
  { icon: CalendarCheck, title: 'Choose your demo time', detail: 'See the calls, WhatsApp follow-ups and dashboard with our team.' },
  { icon: Phone, title: 'Try it when you’re ready', detail: 'After your demo, decide whether to start a 14-day free trial. Our team helps you connect your store.' },
] as const;

const FAQS = [
  {
    q: 'Does it really sound like a person?',
    a: 'Play the recordings above — they are real calls made by the agent. Voice, language and script are set up for your brand during onboarding.',
  },
  {
    q: 'Which stores is this for?',
    a: 'Shopify and WooCommerce brands in India. Stores doing 500+ orders a month can book a demo; smaller stores can request an onboarding call.',
  },
  {
    q: 'What if the buyer doesn’t pick up?',
    a: 'The call is marked unreachable. You set retry timing and WhatsApp follow-up, and your team decides what happens to the order.',
  },
  {
    q: 'What do I get in the 14-day free trial?',
    a: 'AI calls on your real COD orders, WhatsApp follow-up and the full dashboard, set up with your team on a short call. No setup fee.',
  },
  {
    q: 'What happens after 14 days?',
    a: `We review your trial results with you. If the numbers work, you choose a plan — from ${formatInr(STARTER.base)}/month — and continue. There is no annual lock-in.`,
  },
] as const;

function scrollToForm(source: string) {
  trackEvent('cta_clicked', { cta: 'book_demo', source, page: 'leads' });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('book')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
}

const formatTime = (value: number) => `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, '0')}`;

function CallPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [active, setActive] = useState<CallKey>('cod');
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const [keys, setKeys] = useState<CallKey[]>(BASE_CALL_KEYS);
  const call = CALLS[active];
  const captions = CALL_CAPTIONS[active];
  const captionIndex = captions.reduce((found, line, index) => (line.at <= time ? index : found), 0);
  const caption = captions[captionIndex];

  useEffect(() => {
    // Show the regional-language tab only when its recording has been added.
    fetch(CALLS.regional.audio, { method: 'HEAD' })
      .then((res) => { if (res.ok) setKeys(CALL_KEYS); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPlaying(false); setTime(0); setError('');
    const audio = audioRef.current;
    // Metadata can arrive before React attaches handlers, so read it directly too.
    const sync = () => setDuration(audio && Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0);
    sync();
    audio?.addEventListener('durationchange', sync);
    return () => audio?.removeEventListener('durationchange', sync);
  }, [active]);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    setError('');
    if (audio.ended) audio.currentTime = 0;
    try {
      await audio.play();
      trackEvent('call_sample_played', { scenario: active, page: 'leads' });
    } catch {
      setError('Tap again to play the call.');
    }
  }, [active]);

  return (
    <div className={styles.player}>
      <div className={styles.playerHead}>
        <span className={styles.liveDot} data-on={playing || undefined} aria-hidden />
        <span>Real call by the AI agent</span>
        <span className={styles.lang}>{call.language}</span>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Sample calls">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={key === active}
            className={styles.tab}
            onClick={() => setActive(key)}
          >
            {CALLS[key].tab}
          </button>
        ))}
      </div>

      <p className={styles.callTitle}>{call.title}</p>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.playBtn}
          onClick={toggle}
          aria-label={playing ? 'Pause call' : 'Play call'}
        >
          {playing ? <Pause size={22} weight="fill" /> : <Play size={22} weight="fill" />}
        </button>
        <div className={styles.track}>
          <div className={styles.wave} data-on={playing || undefined} aria-hidden>
            {Array.from({ length: 28 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 7) * 0.09}s` }} />)}
          </div>
          <div className={styles.progress} aria-hidden>
            <span style={{ width: duration ? `${Math.min(100, (time / duration) * 100)}%` : '0%' }} />
          </div>
          <div className={styles.times}>
            <span>{formatTime(time)}</span>
            <span>{duration ? formatTime(duration) : '--:--'}</span>
          </div>
        </div>
      </div>

      <div className={styles.caption} aria-live="polite">
        {caption && (
          <span className={styles.speaker} data-agent={caption.speaker === 'agent' || undefined}>
            {caption.speaker === 'agent' ? 'AI agent' : 'Buyer'}
          </span>
        )}
        <p>{caption && (time > 0 || playing) ? caption.text : 'Press play to hear the call with live captions.'}</p>
        <small>{CALL_CAPTION_NOTES[active].startsWith('From ') ? `Captions translated ${CALL_CAPTION_NOTES[active].toLowerCase()}` : 'Transcript'}</small>
      </div>

      <p className={styles.outcome}>
        <CheckCircle size={16} weight="fill" aria-hidden /> {call.outcome}
      </p>
      {error && <p className={styles.error} role="alert">{error}</p>}

      <audio
        ref={audioRef}
        src={call.audio}
        preload="metadata"
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => { const value = e.currentTarget.duration; setDuration(Number.isFinite(value) ? value : 0); }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); trackEvent('call_sample_completed', { scenario: active, page: 'leads' }); }}
        onError={() => setError('Recording unavailable right now.')}
      />
    </div>
  );
}

export function LeadsLanding() {
  const [showSticky, setShowSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const form = document.getElementById('book');
    if (!form) return;
    // Hide the mobile CTA while the form is on screen.
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting && window.scrollY > 300), { threshold: 0.1 });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.page}>
      <header ref={headerRef} className={styles.header}>
        <div className={styles.wrap}>
          <Image src="/recover-agent-logo-transparent.png" alt="Recover Agent" width={152} height={38} priority className={styles.logo} />
          <button type="button" className={styles.headerCta} onClick={() => scrollToForm('header')}>
            <span className={styles.ctaCopy}><span>Book a demo</span><small>14-day free trial</small></span>
          </button>
          <button ref={menuButtonRef} type="button" className={styles.menuButton} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="leads-navigation" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} aria-hidden /> : <List size={22} aria-hidden />}
          </button>
        </div>
        {menuOpen && <nav id="leads-navigation" className={styles.pageNavigation} aria-label="Page navigation">
          {[['Hear a real call', '#sample-calls'], ['How it works', '#how-it-works'], ['Pricing', '#pricing'], ['Questions', '#questions']].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={16} aria-hidden /></a>)}
        </nav>}
      </header>

      <section className={`${styles.wrap} ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <Phone size={14} weight="fill" aria-hidden /> For Indian D2C brands selling on COD
          </p>
          <h1>
            An AI voice agent that <em>calls your buyers</em> before you lose the order.
          </h1>
          <p className={styles.sub}>
            It confirms COD orders, recovers abandoned carts and reschedules failed deliveries — in Hindi, English and
            other Indian languages. No calling team needed.
          </p>
          <ul className={styles.ticks}>
            <li><CheckCircle size={18} weight="fill" aria-hidden /> Works with Shopify &amp; WooCommerce</li>
            <li><CheckCircle size={18} weight="fill" aria-hidden /> Calls every COD order before it ships</li>
            <li><CheckCircle size={18} weight="fill" aria-hidden /> Talks in Hindi, English, Tamil, Telugu, Malayalam and Kannada</li>
          </ul>
          <div id="sample-calls" className={styles.menuTarget}><CallPlayer /></div>
        </div>

        <div id="book" className={styles.formCol}>
          <LeadCaptureForm />
        </div>
      </section>

      <section className={styles.proof} aria-labelledby="proof-title">
        <div className={styles.wrap}>
          <p id="proof-title" className={styles.proofTitle}>
            <span className={styles.liveDot} data-on aria-hidden /> Live dashboard data · men’s apparel D2C brand, last 30 days
          </p>
          <ul className={styles.proofStats}>
            {PROOF.map(({ icon: Icon, value, label, ...rest }) => (
              <li key={label} data-tone={'tone' in rest ? rest.tone : undefined}>
                <span className={styles.proofIcon} aria-hidden><Icon size={20} weight="duotone" /></span>
                <strong>{value}</strong>
                <p>{label}</p>
              </li>
            ))}
            <li data-tone="rto">
              <span className={styles.proofIcon} aria-hidden><TrendDown size={20} weight="duotone" /></span>
              <strong>
                <s>32%</s> <ArrowRight size={18} weight="bold" aria-label="down to" /> <em>17%</em>
              </strong>
              <p>Average RTO across brands on Recover Agent</p>
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.band}>
        <div className={styles.wrap}>
          <h2 className={styles.h2}>One AI agent, three calls that save you money</h2>
          <div className={styles.jobs}>
            {JOBS.map(({ icon: Icon, title, detail, result }) => (
              <article key={title} className={styles.job}>
                <span className={styles.jobIcon} aria-hidden><Icon size={22} weight="duotone" /></span>
                <h3>{title}</h3>
                <p>{detail}</p>
                <strong>{result}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.wrap}>
        <div className={styles.split}>
          <div>
            <h2 className={styles.h2}>Sounds like your team. Works for your team.</h2>
            <p className={styles.lead}>
              Your buyers get a polite, natural call in their own language. Your team gets a clean result on every
              order — confirmed, cancelled, rescheduled or needs review.
            </p>
            <button type="button" className={styles.primary} onClick={() => scrollToForm('traits')}>
              <span className={styles.ctaCopy}><span>Book a demo</span><small>14-day free trial</small></span> <ArrowRight size={18} weight="bold" aria-hidden />
            </button>
          </div>
          <ul className={styles.traits}>
            {TRAITS.map(({ icon: Icon, title, detail }) => (
              <li key={title}>
                <span aria-hidden><Icon size={20} weight="duotone" /></span>
                <div><strong>{title}</strong><p>{detail}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.band}>
        <div className={styles.wrap}>
          <h2 id="how-it-works" className={`${styles.h2} ${styles.menuTarget}`}>From demo to your first recovered order</h2>
          <ol className={styles.steps}>
            {STEPS.map(({ icon: Icon, title, detail }, index) => (
              <li key={title}>
                <span className={styles.stepNum}>{index + 1}</span>
                <Icon size={22} weight="duotone" aria-hidden />
                <strong>{title}</strong>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${styles.wrap} ${styles.menuTarget}`} id="pricing">
        <h2 className={styles.h2}>Simple pricing after your free trial</h2>
        <p className={styles.lead}>Monthly plans priced per order. No setup fee and no annual lock-in.</p>
        <div className={styles.plans}>
          {PRICING_TIERS.map((tier) => (
            <article key={tier.id} className={styles.plan} data-recommended={tier.recommended || undefined}>
              <div className={styles.planHead}>
                <h3>{tier.name}</h3>
                {tier.recommended && <span>Recommended</span>}
              </div>
              <p className={styles.planPrice}>{formatInr(tier.base)}<small>/month</small></p>
              <p className={styles.planMeta}>
                {tier.includedCalls.toLocaleString('en-IN')} orders included, then ₹{tier.overagePerOrder.toFixed(Number.isInteger(tier.overagePerOrder) ? 0 : 2)} per order
              </p>
              <ul>
                {PLAN_FEATURE_ROWS.filter(({ key }) => PLAN_FEATURES[tier.id][key]).map(({ label }) => (
                  <li key={label}><CheckCircle size={16} weight="fill" aria-hidden /> {label}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className={styles.planNote}>
          <strong>Starter pays for itself if it stops {BREAK_EVEN_RTOS} returned orders a month</strong>{' '}
          (about ₹{COST_PER_RTO} lost per RTO in shipping, packaging and ad spend). Taxes and WhatsApp messaging charges
          are confirmed on your setup call.
        </p>
        <button type="button" className={styles.primary} onClick={() => scrollToForm('pricing')}>
          <span className={styles.ctaCopy}><span>Book a demo</span><small>14-day free trial</small></span> <ArrowRight size={18} weight="bold" aria-hidden />
        </button>
      </section>

      <section className={styles.wrap}>
        <h2 id="questions" className={`${styles.h2} ${styles.menuTarget}`}>Questions</h2>
        <div className={styles.faqs}>
          {FAQS.map(({ q, a }) => (
            <details key={q} className={styles.faq} onToggle={(e) => { if (e.currentTarget.open) trackEvent('faq_opened', { question: q, page: 'leads' }); }}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.final}>
        <div className={styles.wrap}>
          <ChatCircleText size={32} weight="duotone" aria-hidden />
          <h2>See what Recover Agent can do for your store.</h2>
          <p>Book a demo, then decide if a 14-day free trial is right for you.</p>
          <button type="button" className={styles.primary} onClick={() => scrollToForm('final')}>
            <span className={styles.ctaCopy}><span>Book a demo</span><small>14-day free trial</small></span> <ArrowRight size={18} weight="bold" aria-hidden />
          </button>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.wrap}>© {new Date().getFullYear()} Recover Agent</div>
      </footer>

      <div className={styles.sticky} data-show={showSticky || undefined}>
        <button type="button" className={styles.primary} onClick={() => { trackEvent('sticky_cta_clicked', { page: 'leads' }); scrollToForm('sticky'); }}>
          <span className={styles.ctaCopy}><span>Book a demo</span><small>14-day free trial</small></span> <ArrowRight size={18} weight="bold" aria-hidden />
        </button>
      </div>
    </main>
  );
}
