'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CalendarCheck,
  ChatCircleText,
  CheckCircle,
  ClockCountdown,
  IdentificationCard,
  Package,
  Pause,
  Phone,
  Play,
  ShieldCheck,
  Storefront,
  Translate,
  Truck,
  WhatsappLogo,
} from '@phosphor-icons/react';
import { LeadCaptureForm } from '@/components/landing/LeadCaptureForm';
import { CALL_CAPTIONS, CALL_CAPTION_NOTES } from '@/lib/call-captions';
import { trackEvent } from '@/lib/analytics';
import styles from './LeadsLanding.module.css';

type CallKey = 'cod' | 'checkout' | 'ndr';

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
};

const CALL_KEYS = Object.keys(CALLS) as CallKey[];

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
  { icon: ClockCountdown, title: 'Calls within minutes', detail: 'Starts calling as soon as an order, cart or NDR event comes in.' },
  { icon: WhatsappLogo, title: 'Follows up on WhatsApp', detail: 'Sends product links, payment links and confirmations after the call.' },
  { icon: ShieldCheck, title: 'Your team stays in control', detail: 'Every call is recorded, tagged and visible. You decide what ships.' },
] as const;

const STEPS = [
  { icon: IdentificationCard, title: 'Share your details', detail: 'Takes under 30 seconds.' },
  { icon: CalendarCheck, title: 'Pick a demo time', detail: 'The calendar opens right after the form.' },
  { icon: Phone, title: 'Hear it on your orders', detail: 'We show the AI agent calling for your store, in your buyers’ language.' },
] as const;

const FAQS = [
  {
    q: 'Does it really sound like a person?',
    a: 'Play the recordings above — they are real calls made by the agent. Voice, language and script are set up for your brand during onboarding.',
  },
  {
    q: 'Which stores is this for?',
    a: 'Shopify and WooCommerce brands in India. Live demos are for stores doing 500+ orders a month; smaller stores can request an onboarding call.',
  },
  {
    q: 'What if the buyer doesn’t pick up?',
    a: 'The call is marked unreachable. You set retry timing and WhatsApp follow-up, and your team decides what happens to the order.',
  },
  {
    q: 'Is the demo free?',
    a: 'Yes. It is a free 30-minute call — no credit card and no commitment.',
  },
] as const;

function scrollToForm(source: string) {
  trackEvent('cta_clicked', { location: source, page: 'leads' });
  document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const formatTime = (value: number) => `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, '0')}`;

function CallPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [active, setActive] = useState<CallKey>('cod');
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const call = CALLS[active];
  const captions = CALL_CAPTIONS[active];
  const captionIndex = captions.reduce((found, line, index) => (line.at <= time ? index : found), 0);
  const caption = captions[captionIndex];

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
        {CALL_KEYS.map((key) => (
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
        <span className={styles.speaker} data-agent={caption.speaker === 'agent' || undefined}>
          {caption.speaker === 'agent' ? 'AI agent' : 'Buyer'}
        </span>
        <p>{time > 0 || playing ? caption.text : 'Press play to hear the call with live captions.'}</p>
        <small>{CALL_CAPTION_NOTES[active] === 'From Hindi' ? 'Captions translated from Hindi' : 'Transcript'}</small>
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
      <header className={styles.header}>
        <div className={styles.wrap}>
          <Image src="/recover-agent-logo-transparent.png" alt="Recover Agent" width={152} height={38} priority className={styles.logo} />
          <button type="button" className={styles.headerCta} onClick={() => scrollToForm('header')}>
            Book free demo
          </button>
        </div>
      </header>

      <section className={`${styles.wrap} ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <Phone size={14} weight="fill" aria-hidden /> AI voice agent for Indian D2C brands
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
            <li><CheckCircle size={18} weight="fill" aria-hidden /> Calls 24×7, follows up on WhatsApp</li>
            <li><CheckCircle size={18} weight="fill" aria-hidden /> Free 30-minute demo on your own orders</li>
          </ul>
          <CallPlayer />
        </div>

        <div id="book" className={styles.formCol}>
          <LeadCaptureForm />
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
            <h2 className={styles.h2}>Sounds like your team. Works like software.</h2>
            <p className={styles.lead}>
              Your buyers get a polite, natural call in their own language. Your team gets a clean result on every
              order — confirmed, cancelled, rescheduled or needs review.
            </p>
            <button type="button" className={styles.primary} onClick={() => scrollToForm('traits')}>
              Book my free demo <ArrowRight size={18} weight="bold" aria-hidden />
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
          <h2 className={styles.h2}>How the demo works</h2>
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

      <section className={styles.wrap}>
        <h2 className={styles.h2}>Questions</h2>
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
          <h2>Hear the AI agent call for your store.</h2>
          <p>Free 30-minute demo. No credit card. Pick a time that suits you.</p>
          <button type="button" className={styles.primary} onClick={() => scrollToForm('final')}>
            Book my free demo <ArrowRight size={18} weight="bold" aria-hidden />
          </button>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.wrap}>© {new Date().getFullYear()} Recover Agent</div>
      </footer>

      <div className={styles.sticky} data-show={showSticky || undefined}>
        <button type="button" className={styles.primary} onClick={() => { trackEvent('sticky_cta_clicked', { page: 'leads' }); scrollToForm('sticky'); }}>
          Book free demo <ArrowRight size={18} weight="bold" aria-hidden />
        </button>
      </div>
    </main>
  );
}
