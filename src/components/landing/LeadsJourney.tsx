import { CheckCircle, PhoneCall, Storefront, Truck } from "@phosphor-icons/react/dist/ssr";
import styles from "./CheckoutJourney.module.css";

const steps = [
  {
    number: "01",
    label: "COD CONFIRMATION",
    title: "Confirm COD orders",
    description: "Call buyers before dispatch to confirm their order and flag orders that need attention.",
    icon: PhoneCall,
    visual: <><span className={styles.visualLabel}>COD ORDER</span><div className={styles.eventRow}><span className={styles.eventIcon}><PhoneCall size={22} /></span><div><strong>Confirm before dispatch</strong><small>The buyer gets an AI call</small></div></div><div className={styles.status}><CheckCircle size={15} weight="fill" /> Order outcome recorded</div></>,
  },
  {
    number: "02",
    label: "ABANDONED CHECKOUT",
    title: "Recover abandoned checkouts",
    description: "Follow up with shoppers who leave checkout and help them find their way back.",
    icon: Storefront,
    visual: <><span className={styles.visualLabel}>CHECKOUT FOLLOW-UP</span><div className={styles.bubble}>Is cash on delivery available?</div><div className={styles.reply}>Yes, COD is available. Would you like to complete your order?</div><div className={styles.status}><PhoneCall size={14} weight="fill" /> AI call in progress</div></>,
  },
  {
    number: "03",
    label: "FAILED DELIVERY",
    title: "Follow up on failed deliveries",
    description: "Contact buyers after a failed delivery attempt and understand what needs to happen next.",
    icon: Truck,
    visual: <><span className={styles.visualLabel}>DELIVERY FOLLOW-UP</span><div className={styles.eventRow}><span className={styles.eventIcon}><Truck size={22} /></span><div><strong>Delivery attempt missed</strong><small>Contact the buyer to understand why</small></div></div><div className={styles.status}><CheckCircle size={15} weight="fill" /> Outcome visible to your team</div></>,
  },
];

export function LeadsJourney() {
  return <section className={styles.section} aria-labelledby="leads-journey-title">
    <div className={styles.wrap}>
      <div className={styles.heading}><p className={styles.eyebrow}>HOW IT WORKS</p><h2 id="leads-journey-title">Follow up across the order journey.</h2><p>AI calls help your team act at each step.</p></div>
      <div className={styles.track}>
        {steps.map(({ number, label, title, description, icon: Icon, visual }) => <article className={styles.step} key={number}>
          <div className={styles.copy}><div className={styles.topline}><span className={styles.stepIcon}><Icon size={21} weight="duotone" /></span><span>{label}</span><span className={styles.number}>{number} / 03</span></div><h3>{title}</h3><p>{description}</p></div>
          <div className={styles.visual} aria-hidden="true">{visual}</div>
        </article>)}
      </div>
    </div>
  </section>;
}
