"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import styles from "./ExampleReviews.module.css";

const benefits = [
  { title: "Reach shoppers after checkout", text: "Follow up with shoppers who leave before completing their order." },
  { title: "Answer questions on the call", text: "Give shoppers a chance to ask about payment, delivery and their order." },
  { title: "Make it easy to return", text: "Share the checkout link on WhatsApp so shoppers can continue their order." },
];

export function CheckoutBenefits() {
  const [active, setActive] = useState(0);
  const show = (index: number) => setActive((index + benefits.length) % benefits.length);
  return <section className={`${styles.section} ${styles.voice}`} aria-labelledby="checkout-benefits-title">
    <div className={styles.wrap}>
      <div className={styles.heading}><p className={styles.eyebrow}>BUILT FOR CHECKOUT RECOVERY</p><h2 id="checkout-benefits-title">A better way to bring shoppers back.</h2></div>
      <div className={styles.carousel}>
        <div className={styles.card} aria-live="polite" aria-atomic="true">
          <div className={styles.top}><span>{String(active + 1).padStart(2, "0")} / 03</span></div>
          <p className={styles.quote}><strong>{benefits[active].title}</strong><br />{benefits[active].text}</p>
        </div>
        <div className={styles.controls}>
          <div className={styles.dots} aria-label="Choose a benefit">{benefits.map((item, index) => <button key={item.title} type="button" aria-label={`Show benefit ${index + 1}: ${item.title}`} aria-current={index === active ? "true" : undefined} className={index === active ? styles.active : ""} onClick={() => show(index)} />)}</div>
          <div className={styles.arrows}><button type="button" aria-label="Previous benefit" onClick={() => show(active - 1)}><ArrowLeft size={18} /></button><button type="button" aria-label="Next benefit" onClick={() => show(active + 1)}><ArrowRight size={18} /></button></div>
        </div>
      </div>
    </div>
  </section>;
}
