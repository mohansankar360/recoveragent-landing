"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import styles from "./ExampleReviews.module.css";

const reviews = [
  { type: "Skincare brand", role: "Founder", quote: "We used to follow up on abandoned checkouts whenever someone had time. Having RecoverAgent handle the calls has taken that work off our team." },
  { type: "Imitation jewellery brand", role: "Brand manager", quote: "A lot of our customers still prefer COD. It's useful that they can ask about it on the call and then get the checkout link on WhatsApp." },
  { type: "Haircare brand", role: "Operations manager", quote: "Earlier someone on my team would call when they got time, but on busy days it just wouldn't happen. We've had RecoverAgent running for a few months and that follow-up doesn't depend on us remembering anymore." },
  { type: "Home decor brand", role: "Operations manager", quote: "I check the call outcomes regularly. Sometimes it's a delivery question, sometimes they're just not ready to order. It's helpful to know." },
  { type: "Fashion accessories brand", role: "Brand manager", quote: "Delivery questions come up quite often for us. I like that customers can ask during the call instead of just getting another reminder." },
  { type: "Wellness brand", role: "Founder", quote: "The WhatsApp follow-up is handy — customers have the link right there when they're ready to come back." },
];

const voiceReviews = [
  { type: "Fashion brand", role: "Operations manager", quote: "We used to call COD customers ourselves before dispatch. Having the calls handled for us has given the team more time for orders that need attention." },
  reviews[0],
  { type: "Home decor brand", role: "Founder", quote: "It's helpful to see who confirmed and which orders need a closer look before we ship." },
  reviews[1],
  { type: "Accessories brand", role: "Brand manager", quote: "Some shoppers have questions before they confirm their COD order. The call gives them a chance to ask." },
  reviews[5],
];

export function ExampleReviews({ variant = "checkout" }: { variant?: "checkout" | "voice" }) {
  const [active, setActive] = useState(0);
  const items = variant === "voice" ? voiceReviews : reviews;
  const review = items[active];
  const show = (index: number) => setActive((index + items.length) % items.length);
  return <section className={styles.section} aria-labelledby="examples-title">
    <div className={styles.wrap}>
      <p className={styles.eyebrow}>FOR BRANDS LIKE YOURS</p>
      <h2 id="examples-title">{variant === "voice" ? "Conversations that help recover more." : "Conversations that bring shoppers back."}</h2>
      <div className={styles.card} aria-live="polite" aria-atomic="true">
        <div className={styles.top}><span>{String(active + 1).padStart(2, "0")} / 06</span></div>
        <p className={styles.quote}>“{review.quote}”</p>
        <div className={styles.identity}><span className={styles.avatar} aria-hidden="true">{review.type.charAt(0)}</span><div><strong>{review.role}, {review.type.toLowerCase()}</strong></div></div>
      </div>
      <div className={styles.controls}>
        <div className={styles.dots} aria-label="Choose a sample review">{items.map((item, index) => <button key={item.type} type="button" aria-label={`Show sample ${index + 1}: ${item.type}`} aria-current={index === active ? "true" : undefined} className={index === active ? styles.active : ""} onClick={() => show(index)} />)}</div>
        <div className={styles.arrows}><button type="button" aria-label="Previous sample review" onClick={() => show(active - 1)}><ArrowLeft size={18} /></button><button type="button" aria-label="Next sample review" onClick={() => show(active + 1)}><ArrowRight size={18} /></button></div>
      </div>
    </div>
  </section>;
}
