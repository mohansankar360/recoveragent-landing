'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle, Package, PhoneCall, Storefront, TShirt, Truck, WhatsappLogo, Waveform } from '@phosphor-icons/react';
import page from './ConversionHomepage.module.css';
import styles from './ShopifyWorkflow.module.css';

const steps = [
  { icon: Storefront, label: 'Order', title: 'Order received.', detail: 'Shopify starts the workflow.', status: 'Order received' },
  { icon: PhoneCall, label: 'AI call', title: 'AI confirms the order.', detail: 'Check purchase intent and address.', status: 'Buyer confirmed' },
  { icon: WhatsappLogo, label: 'WhatsApp', title: 'WhatsApp follow-up.', detail: 'Send the buyer their order details.', status: 'Confirmation shared' },
  { icon: CheckCircle, label: 'Intent', title: 'Intent captured.', detail: 'Save the buyer’s decision.', status: 'Intent captured' },
  { icon: Truck, label: 'Outcome', title: 'Ready for your team.', detail: 'Review the outcome and recording.', status: 'Ready for review' },
];

function OrderTicket({ confirmed = false }: { confirmed?: boolean }) {
  return <div className={styles.ticket}>
    <span className={styles.product}><TShirt size={42} weight="duotone" /></span>
    <div><small>Order #1042</small><strong>Everyday cotton tee</strong><span>₹1,499 · Cash on delivery</span></div>
    {confirmed && <CheckCircle className={styles.ticketCheck} size={23} weight="fill" aria-label="Confirmed" />}
  </div>;
}

function Stage({ active }: { active: number }) {
  if (active === 0) return <div className={styles.orderScene}>
    <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" className={styles.shopify} aria-label="Shopify (opens in a new tab)"><Image src="/shopify-logo.svg" width={126} height={36} alt="Shopify" /></a>
    <div className={styles.connector} aria-hidden="true"><span /><span /><span /></div>
    <OrderTicket />
    <div className={styles.received}><span /><span /><span /><small>Added to COD recovery</small><ArrowRight size={16} /></div>
  </div>;
  if (active === 1) return <div className={styles.callScene}>
    <div className={styles.voice}><span className={styles.voiceAvatar}><Waveform size={28} weight="bold" /></span><div><strong>RecoverAgent</strong><small>AI voice · COD confirmation</small></div><PhoneCall size={21} /></div>
    <div className={styles.waveform} aria-hidden="true">{[18,32,22,45,60,36,52,26,44,66,40,24,54,34,18,42,28,56,36,20,32,16].map((height, i) => <i key={i} style={{ height, animationDelay: `${i * .09}s` }} />)}</div>
    <div className={styles.agentBubble}>“Shall we ship your order?”</div>
    <div className={styles.buyerBubble}>“Yes. The address is correct.” <Check size={16} /></div>
    <div className={styles.miniOrder}><Package size={16} /> Order #1042 <span>Buyer confirmed</span></div>
  </div>;
  if (active === 2) return <div className={styles.messageScene}>
    <div className={styles.whatsappHeader}><WhatsappLogo size={30} weight="duotone" /><div><strong>RecoverAgent</strong><small>Order update</small></div></div>
    <div className={styles.message}><div className={styles.confirmStamp}><CheckCircle size={26} weight="fill" /><strong>Order confirmed</strong></div><OrderTicket confirmed /><p>Your COD order is confirmed.</p><span className={styles.messageLink}>View order details <ArrowRight size={17} /></span><small>Just now <Check size={14} /><Check size={14} /></small></div>
  </div>;
  if (active === 3) return <div className={styles.intentScene}>
    <div className={styles.intentSymbol}><Waveform size={33} /><ArrowRight size={20} /><CheckCircle size={38} weight="fill" /></div>
    <OrderTicket confirmed />
    <div className={styles.checklist}>{['Purchase intent confirmed', 'Delivery address verified', 'Fulfilment review next'].map(label => <div key={label}><CheckCircle size={22} weight="fill" /><span>{label}</span></div>)}</div>
  </div>;
  return <div className={styles.outcomeScene}>
    <div className={styles.queueHeading}><Truck size={28} weight="duotone" /><strong>Fulfilment review</strong><span>1 ready</span></div>
    <div className={styles.queue}><div className={styles.queueGhost} aria-hidden="true" /><OrderTicket confirmed /><div className={styles.queueGhost} aria-hidden="true" /></div>
    <div className={styles.evidence}><span><PhoneCall size={16} /> Recording</span><span><Waveform size={16} /> Transcript</span></div>
    <p className={styles.teamStatus}><CheckCircle size={19} weight="fill" /> Ready for review</p>
  </div>;
}

export function ShopifyWorkflow({ onBook }: { onBook: () => void }) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const mobile = window.innerWidth <= 900;
      const preferredTop = mobile ? 88 : 104;
      // Keep the controls reachable on short screens without disabling the
      // scroll sequence. The mobile layout shrinks the scene to fit phones.
      const top = Math.min(preferredTop, window.innerHeight - pin.offsetHeight - 16);
      const enabled = !reduceMotion;
      track.dataset.scroll = String(enabled);
      track.style.setProperty('--story-top', `${top}px`);
      if (!enabled) {
        track.style.removeProperty('height');
        pin.style.setProperty('--story-drift', '0px');
        return;
      }
      const distance = window.innerHeight * 2.4;
      track.style.height = `${pin.offsetHeight + distance}px`;
      const progress = Math.max(0, Math.min(1, (top - track.getBoundingClientRect().top) / distance));
      setActive(Math.min(steps.length - 1, Math.floor(progress * steps.length)));
      const stageProgress = progress === 1 ? 1 : (progress * steps.length) % 1;
      // Separate depth planes follow scroll continuously, between step changes.
      pin.style.setProperty('--story-drift', `${(26 - stageProgress * 52).toFixed(2)}px`);
      pin.style.setProperty('--story-scale', `${(.96 + stageProgress * .065).toFixed(4)}`);
      pin.style.setProperty('--story-near', `${(18 - stageProgress * 36).toFixed(2)}px`);
      pin.style.setProperty('--story-back', `${(70 - progress * 140).toFixed(2)}px`);
      pin.style.setProperty('--story-mid', `${(-24 + stageProgress * 48).toFixed(2)}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(pin);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      track.style.removeProperty('height');
      track.dataset.scroll = 'false';
    };
  }, [reduceMotion]);

  const select = (index: number, focus = false) => {
    setActive(index);
    const track = trackRef.current;
    const pin = pinRef.current;
    if (track?.dataset.scroll === 'true' && pin) {
      const top = Number.parseFloat(track.style.getPropertyValue('--story-top'));
      const distance = track.offsetHeight - pin.offsetHeight;
      const start = window.scrollY + track.getBoundingClientRect().top - top;
      // Land inside the selected stage so scroll and tap always agree.
      window.scrollTo({ top: start + distance * ((index + .35) / steps.length), behavior: 'instant' });
    }
    if (focus) document.getElementById(`recovery-step-${index}`)?.focus();
  };
  return <section className={`${page.section} ${styles.section}`} id="shopify">
    <div className={`${page.sectionHeading} ${styles.heading}`} data-reveal><p className={styles.eyebrow}>Shopify workflow</p><h2>From order to confirmation.</h2><p>Follow a sample COD order through recovery.</p></div>
    <div className={styles.scrollTrack} ref={trackRef} id="product">
    <div className={styles.pinnedStory} ref={pinRef}>
    <p className={styles.scrollHint}>Scroll to follow the order <ArrowRight size={14} aria-hidden="true" /></p>
    <div className={styles.story}>
      <div className={styles.steps} role="tablist" aria-label="COD recovery steps">{steps.map((step, index) => {
        const Icon = step.icon;
        return <button key={step.label} id={`recovery-step-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls="recovery-stage" tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={event => {
          let target: number | undefined;
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = (index + 1) % steps.length;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target = (index + steps.length - 1) % steps.length;
          if (event.key === 'Home') target = 0;
          if (event.key === 'End') target = steps.length - 1;
          if (target !== undefined) { event.preventDefault(); select(target, true); }
        }}><span className={styles.stepIcon}><Icon size={23} weight={active === index ? 'fill' : 'regular'} /></span><span className={styles.stepText}><small>0{index + 1}</small><strong>{step.label}</strong></span><span className={styles.stepEnd} aria-hidden="true">{index < active ? <Check size={17} /> : <ArrowRight size={17} />}</span></button>;
      })}</div>
      <div className={styles.stage} role="tabpanel" id="recovery-stage" aria-labelledby={`recovery-step-${active}`} tabIndex={0}>
        <div className={styles.stageTop}><span>Order #1042</span><span className={styles.status}><i />{steps[active].status}</span></div>
        <div className={styles.canvas}>
          <div className={styles.depthBack} aria-hidden="true"><span /><span /></div>
          <div className={styles.depthMid} aria-hidden="true"><Package size={24} weight="duotone" /><CheckCircle size={25} weight="duotone" /></div>
          <div className={styles.drift}><AnimatePresence initial={false} mode="wait"><motion.div className={styles.scene} key={active} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .16 }}><Stage active={active} /></motion.div></AnimatePresence></div>
        </div>
        <div className={styles.caption}>
          <div><h3>{steps[active].title}</h3><p>{steps[active].detail}</p></div>
          <div className={styles.captionAction}>
            <AnimatePresence>
              {active === 4 && <motion.div key="store-demo" initial={reduceMotion ? false : { opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .35, ease: [.16, 1, .3, 1] }}>
                <button type="button" className={page.primaryButton} onClick={onBook}>See it for your store <ArrowRight size={17} weight="bold" /></button>
              </motion.div>}
            </AnimatePresence>
          </div>
        </div>
        <div className={styles.controls}><button type="button" aria-label="Previous recovery step" disabled={active === 0} onClick={() => select(active - 1)}><ArrowLeft size={19} /></button><span>0{active + 1} <span>/ 05</span></span><button type="button" aria-label={active === 4 ? 'Replay recovery workflow' : 'Next recovery step'} onClick={() => select((active + 1) % steps.length)}>{active === 4 ? 'Replay' : 'Next'}<ArrowRight size={18} /></button></div>
      </div>
    </div>
    </div>
    </div>
    <div className={styles.footer}><small>Sample order and conversation</small></div>
  </section>;
}
