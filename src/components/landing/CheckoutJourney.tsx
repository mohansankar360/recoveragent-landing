import { ChatCircleDots, CheckCircle, PhoneCall, Storefront, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import styles from './CheckoutJourney.module.css';

const steps = [
  {
    number: '01',
    label: 'THE MISSED CHECKOUT',
    title: 'A shopper leaves checkout',
    description: 'RecoverAgent receives the abandoned checkout from your connected store or checkout provider.',
    icon: Storefront,
    visual: <><span className={styles.visualLabel}>CHECKOUT ACTIVITY</span><div className={styles.eventRow}><span className={styles.eventIcon}><Storefront size={22} /></span><div><strong>Checkout abandoned</strong><small>A shopper left before ordering</small></div></div><div className={styles.status}><span /> Ready for follow-up</div></>,
  },
  {
    number: '02',
    label: 'THE AI CALL',
    title: 'The AI makes the call',
    description: 'It talks to the shopper in their language, answers questions and helps them take the next step.',
    icon: PhoneCall,
    visual: <><span className={styles.visualLabel}>AI CONVERSATION</span><div className={styles.bubble}>Is cash on delivery available?</div><div className={styles.reply}>Yes, COD is available. Would you like to complete your order?</div><div className={styles.status}><PhoneCall size={14} weight="fill" /> AI call in progress</div></>,
  },
  {
    number: '03',
    label: 'THE FOLLOW-UP',
    title: 'Follow up on WhatsApp',
    description: 'A checkout link can be shared on WhatsApp, with outcomes visible to your team.',
    icon: WhatsappLogo,
    visual: <><span className={styles.visualLabel}>WHATSAPP FOLLOW-UP</span><div className={styles.eventRow}><span className={styles.whatsappIcon}><WhatsappLogo size={23} weight="fill" /></span><div><strong>Continue your order</strong><small>Checkout link shared on WhatsApp</small></div></div><div className={styles.status}><CheckCircle size={15} weight="fill" /> Outcome visible to your team</div></>,
  },
];

export function CheckoutJourney() {
  return <section className={styles.section} aria-labelledby="journey-title">
    <div className={styles.wrap}>
      <div className={styles.heading}><p className={styles.eyebrow}>HOW IT WORKS</p><h2 id="journey-title">From abandoned checkout to a conversation.</h2><p>Three steps to give shoppers a way back.</p></div>
      <div className={styles.track}>
        {steps.map(({ number, label, title, description, icon: Icon, visual }) => <article className={styles.step} key={number}>
          <div className={styles.copy}><div className={styles.topline}><span className={styles.stepIcon}><Icon size={21} weight="duotone" /></span><span>{label}</span><span className={styles.number}>{number} / 03</span></div><h3>{title}</h3><p>{description}</p></div>
          <div className={styles.visual} aria-hidden="true">{visual}</div>
        </article>)}
      </div>
      <p className={styles.note}><ChatCircleDots size={17} /> A conversation can make the difference.</p>
    </div>
  </section>;
}
