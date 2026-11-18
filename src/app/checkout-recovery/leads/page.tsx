import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, ChatCircleDots, PhoneCall, Storefront, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { LeadCaptureForm } from '@/components/landing/LeadCaptureForm';
import { ShopifyLogo, WooCommerceLogo } from '@/components/landing/PlatformLogos';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Recover abandoned checkouts | RecoverAgent',
  description: 'Bring shoppers back with AI calls and WhatsApp. See how RecoverAgent helps recover abandoned checkouts.',
  robots: { index: false, follow: false },
};

export default function CheckoutLeadsPage() {
  return <main className={styles.page}>
    <header className={styles.header}><div className={styles.wrap}>
      <Link href="/" aria-label="RecoverAgent home"><Image src="/recover-agent-logo-transparent.png" width={152} height={76} alt="RecoverAgent" className={styles.logo} priority /></Link>
      <a href="#book" className={styles.headerButton}>Book a demo <ArrowRight size={16} aria-hidden /></a>
    </div></header>

    <section className={`${styles.wrap} ${styles.hero}`}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>FOR INDIAN D2C BRANDS</p>
        <h1>Recover &gt;20% of abandoned checkouts.</h1>
        <p className={styles.lead}>AI calls and WhatsApp follow-ups help shoppers complete their orders, without your team manually chasing them.</p>
        <a href="#book" className={`${styles.primary} ${styles.mobileCta}`}>Book a demo <ArrowRight size={17} aria-hidden /></a>
        <ul className={styles.heroList}>
          <li><CheckCircle size={19} weight="fill" aria-hidden /> Calls in six Indian languages</li>
          <li className={styles.platformLine}><CheckCircle size={19} weight="fill" aria-hidden /> <span>Works with</span> <span className={styles.platformBadge}><ShopifyLogo size={18} /> Shopify</span> <span className={styles.platformBadge}><WooCommerceLogo size={12} /><span className={styles.srOnly}>WooCommerce</span></span></li>
          <li><CheckCircle size={19} weight="fill" aria-hidden /> 14-day free trial available</li>
        </ul>
        <div className={styles.call}>
          <div className={styles.callLabel}><PhoneCall size={19} weight="fill" aria-hidden /><span>HEAR A REAL RECOVERY CALL</span></div>
          <p>A shopper asked about cash on delivery and agreed to place an order.</p>
          <audio controls preload="none" aria-label="Play a real abandoned checkout recovery call in Hindi"><source src="/audio/abandoned_hindi.mp3" type="audio/mpeg" />Your browser does not support audio playback.</audio>
          <small>Hindi · Real call recording · ₹899 COD order placed</small>
          <details className={styles.transcript}><summary>Read a short transcript</summary><p><strong>Shopper:</strong> Is cash on delivery available?</p><p><strong>AI agent:</strong> Yes. The total with the COD charge is ₹899. Which payment option do you prefer?</p><p><strong>Shopper:</strong> COD.</p><small>Translated from Hindi and shortened for clarity.</small></details>
        </div>
      </div>
      <div id="book" className={styles.form}><LeadCaptureForm idPrefix="checkout-leads" initialGoal="checkout" allowManualPlatform /></div>
    </section>

    <section className={`${styles.wrap} ${styles.section}`}>
      <p className={styles.eyebrow}>HOW IT WORKS</p><h2>A conversation can bring a shopper back.</h2>
      <div className={styles.steps}>
        <article><Storefront size={26} aria-hidden /><span>01</span><h3>A shopper leaves checkout</h3><p>RecoverAgent receives the abandoned checkout from your connected store or checkout provider.</p></article>
        <article><PhoneCall size={26} aria-hidden /><span>02</span><h3>The AI makes the call</h3><p>It talks to the shopper in their language, answers questions and helps them take the next step.</p></article>
        <article><WhatsappLogo size={26} aria-hidden /><span>03</span><h3>Follow up on WhatsApp</h3><p>A checkout link can be shared on WhatsApp, with outcomes visible to your team.</p></article>
      </div>
    </section>

    <section className={styles.band}><div className={`${styles.wrap} ${styles.split}`}><div><p className={styles.eyebrow}>MADE FOR REAL SHOPPERS</p><h2>Find out what held them back.</h2><p>Sometimes a reminder is not enough. A conversation gives buyers a chance to ask about the product, delivery or payment before they decide.</p></div><div className={styles.conversation}><ChatCircleDots size={27} aria-hidden /><p>Give shoppers a chance to ask.</p><span>Give shoppers a way to ask, and a simple path back to checkout.</span></div></div></section>

    <section className={`${styles.wrap} ${styles.pricing}`}><div><p className={styles.eyebrow}>SIMPLE PRICING</p><h2>Start with a demo. Try it on your store.</h2><p>AI calling for checkout recovery starts on the Growth plan. WhatsApp checkout recovery is available on every plan.</p></div><div className={styles.priceCard}><span>GROWTH PLAN</span><p><strong>₹4,999</strong> / month</p><p>700 workflows <details className={styles.workflowHelp}><summary aria-label="How workflow cases are counted">?</summary><span>500 COD cases + 500 abandoned checkouts + 200 NDR cases = 1,200 workflow cases.</span></details> included · ₹4.50 per additional workflow</p><small>Includes AI calls for COD confirmation and abandoned checkout recovery. NDR calling is available on Scale.</small><a href="#book" className={styles.primary}>Book a demo <ArrowRight size={17} aria-hidden /></a></div></section>

    <section className={styles.final}><div className={styles.wrap}><h2>See what you can recover.</h2><p>Book a demo and explore a 14-day free trial for your store.</p><a href="#book" className={styles.primary}>Book a demo <ArrowRight size={17} aria-hidden /></a></div></section>
    <footer className={`${styles.wrap} ${styles.footer}`}><span>© {new Date().getFullYear()} RecoverAgent</span><a href="mailto:hello@recoveragent.ai">hello@recoveragent.ai</a><Link href="/policies/privacy-and-policy">Privacy policy</Link></footer>
  </main>;
}
