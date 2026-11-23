import { CheckCircle, Storefront } from "@phosphor-icons/react/dist/ssr";
import styles from "./LeadsResults.module.css";

export function CheckoutResults() {
  return <section className={styles.section} aria-labelledby="checkout-results-title">
    <div className={styles.wrap}>
      <div className={styles.intro}><p className={styles.eyebrow}>A LOOK AT THE NUMBERS</p><h2 id="checkout-results-title">Real results from one live store.</h2><p>Checkout recovery over the last 30 days.</p></div>
      <div className={styles.carousel}>
        <div className={styles.card}>
          <div className={styles.cardHeader}><span>ABANDONED CHECKOUT</span><span>30 DAYS</span></div>
          <div className={styles.mainResult}><span className={styles.icon}><Storefront size={23} weight="bold" aria-hidden /></span><div><strong>₹2.06L</strong><h3>estimated recovered revenue</h3></div></div>
          <p className={styles.detail}>Based on a 20% recovery rate and ₹800 average order value.</p>
          <div className={styles.divider} />
          <div className={styles.supporting}><div><Storefront size={19} aria-hidden /><strong>1,289</strong><span>abandoned checkouts</span></div><div><CheckCircle size={19} aria-hidden /><strong>~258</strong><span>orders recovered</span></div></div>
        </div>
        <p className={styles.footnote}>Estimates; actual results vary by store.</p>
      </div>
    </div>
  </section>;
}
