import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, PhoneCall } from '@phosphor-icons/react/dist/ssr';
import { LeadCaptureForm } from '@/components/landing/LeadCaptureForm';
import { ExampleReviews } from '@/components/landing/ExampleReviews';
import { CheckoutJourney } from '@/components/landing/CheckoutJourney';
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
      <a href="#book" className={styles.headerButton}>Request a call <ArrowRight size={16} aria-hidden /></a>
    </div></header>
    <section className={styles.hero}><div className={`${styles.wrap} ${styles.heroGrid}`}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>FOR INDIAN D2C BRANDS · 500+ ORDERS / MONTH</p>
        <h1>Recover more abandoned checkouts with AI calls &amp; WhatsApp.</h1>
        <p className={styles.lead}>AI calls and WhatsApp follow-ups help shoppers get answers and complete their orders.</p>
        <div className={styles.compatibility}><span>Works with</span><span className={styles.platformBadge}><ShopifyLogo size={18} /> Shopify</span><span className={styles.platformBadge}><WooCommerceLogo size={13} /><span className={styles.srOnly}>WooCommerce</span></span></div>
        <div className={styles.heroNote}><CheckCircle size={19} weight="fill" aria-hidden /><span>14-day free trial available · AI calls in six Indian languages</span></div>
      </div>
      <div id="book" className={styles.form}><LeadCaptureForm idPrefix="checkout-leads" initialGoal="checkout" allowManualPlatform checkoutCallback /></div>
      <div className={styles.mobilePlatforms}><span>Works with</span><span className={styles.platformBadge}><ShopifyLogo size={18} /> Shopify</span><span className={styles.platformBadge}><WooCommerceLogo size={13} /><span className={styles.srOnly}>WooCommerce</span></span><span>AI calls in six Indian languages</span></div>
    </div></section>
    <section className={styles.audioSection}><div className={`${styles.wrap} ${styles.audioGrid}`}>
      <div><p className={styles.eyebrow}>HEAR IT FOR YOURSELF</p><h2>A real conversation.<br />A shopper ready to order.</h2><p>A shopper asked about cash on delivery. The AI answered, and the shopper agreed to place an order.</p></div>
      <div className={styles.call}><div className={styles.callLabel}><PhoneCall size={19} weight="fill" aria-hidden /> REAL RECOVERY CALL</div><p>Hindi · ₹899 COD order placed</p><audio controls preload="none" aria-label="Play a real abandoned checkout recovery call in Hindi"><source src="/audio/abandoned_hindi.mp3" type="audio/mpeg" />Your browser does not support audio playback.</audio><details className={styles.transcript}><summary>Read a short transcript</summary><p><strong>Shopper:</strong> Is cash on delivery available?</p><p><strong>AI agent:</strong> Yes. The total with the COD charge is ₹899. Which payment option do you prefer?</p><p><strong>Shopper:</strong> COD.</p><small>Translated from Hindi and shortened for clarity.</small></details></div>
    </div></section>
    <CheckoutJourney />
    <ExampleReviews />
    <section className={styles.proof}><div className={`${styles.wrap} ${styles.proofInner}`}><div><p className={styles.eyebrow}>BUILT FOR RECOVERY</p><h2>See the workflow on your store.</h2><p>Our team will call you to discuss AI calls, WhatsApp follow-up, pricing and the 14-day free trial.</p><a href="#book" className={styles.primary}>Request a call <ArrowRight size={17} aria-hidden /></a></div><div className={styles.priceCard}><span>AFTER 14-DAY FREE TRIAL</span><p><strong>₹4,999</strong> / month</p><p>700 workflow cases included · ₹4.50 per additional workflow</p><small>Includes AI calls for COD confirmation and abandoned checkout recovery. NDR calling is available on Scale.</small></div></div></section>
    <footer className={`${styles.wrap} ${styles.footer}`}><span>© {new Date().getFullYear()} RecoverAgent</span><a href="mailto:hello@recoveragent.ai">hello@recoveragent.ai</a><Link href="/policies/privacy-and-policy">Privacy policy</Link></footer>
  </main>;
}
