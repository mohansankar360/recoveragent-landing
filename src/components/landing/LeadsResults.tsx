"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, PhoneCall, Prohibit, Storefront } from "@phosphor-icons/react";
import { CASE_STUDY } from "@/lib/case-study";
import styles from "./LeadsResults.module.css";

export function LeadsResults() {
  const [active, setActive] = useState(0);
  const showCheckout = active === 1;
  const abandonedCheckouts = 1289;
  const conversionRate = 0.2;
  const averageOrderValue = 800;
  const estimatedRecovered = Math.round(abandonedCheckouts * conversionRate);
  const estimatedRevenue = Math.round(abandonedCheckouts * conversionRate * averageOrderValue);

  return <section className={styles.section} aria-labelledby="leads-results-title">
    <div className={styles.wrap}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>A LOOK AT THE NUMBERS</p>
        <h2 id="leads-results-title">One brand. One month of follow-ups.</h2>
        <p>Results reported from a men’s apparel store using RecoverAgent.</p>
      </div>
      <div className={styles.carousel}>
        <div className={styles.card} aria-live="polite" aria-atomic="true">
          <div className={styles.cardHeader}><span>{showCheckout ? "ABANDONED CHECKOUT" : "COD CONFIRMATION"}</span><span>30 DAYS</span></div>
          {showCheckout ? <>
            <div className={styles.mainResult}>
              <span className={styles.icon}><Storefront size={23} weight="bold" aria-hidden /></span>
              <div><strong>₹{(estimatedRevenue / 100000).toFixed(2)}L</strong><h3>estimated recovered revenue</h3></div>
            </div>
            <p className={styles.detail}>Estimated at 20% conversion and ₹{averageOrderValue.toLocaleString("en-IN")} average order value.</p>
            <div className={styles.divider} />
            <div className={styles.supporting}>
              <div><Storefront size={19} aria-hidden /><strong>{abandonedCheckouts.toLocaleString("en-IN")}</strong><span>abandoned checkouts</span></div>
              <div><CheckCircle size={19} aria-hidden /><strong>~{estimatedRecovered.toLocaleString("en-IN")}</strong><span>orders recovered</span></div>
            </div>
          </> : <>
            <div className={styles.mainResult}>
              <span className={styles.icon}><Prohibit size={23} weight="bold" aria-hidden /></span>
              <div><strong>~{CASE_STUDY.cancelled}</strong><h3>unwanted orders stopped before shipping</h3></div>
            </div>
            <p className={styles.detail}>Estimated from a reported 16% of {CASE_STUDY.orders} COD orders called.</p>
            <div className={styles.divider} />
            <div className={styles.supporting}>
              <div><PhoneCall size={19} aria-hidden /><strong>{CASE_STUDY.orders}</strong><span>COD orders called</span></div>
              <div><CheckCircle size={19} aria-hidden /><strong>{CASE_STUDY.verified}</strong><span>orders confirmed on calls</span></div>
            </div>
          </>}
        </div>
        <div className={styles.controls}>
          <div className={styles.dots} aria-label="Choose a result">
            <button type="button" aria-label="Show COD confirmation result" aria-current={!showCheckout ? "true" : undefined} onClick={() => setActive(0)} />
            <button type="button" aria-label="Show abandoned checkout result" aria-current={showCheckout ? "true" : undefined} onClick={() => setActive(1)} />
          </div>
          <div className={styles.arrows}>
            <button type="button" aria-label="Previous result" onClick={() => setActive(showCheckout ? 0 : 1)}><ArrowLeft size={18} /></button>
            <button type="button" aria-label="Next result" onClick={() => setActive(showCheckout ? 0 : 1)}><ArrowRight size={18} /></button>
          </div>
        </div>
        <p className={styles.footnote}>Company-reported data from one store. Brand name withheld. Results vary by store.</p>
      </div>
    </div>
  </section>;
}
