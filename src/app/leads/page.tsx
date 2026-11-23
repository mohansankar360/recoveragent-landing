import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, PhoneCall } from "@phosphor-icons/react/dist/ssr";
import { LeadsJourney } from "@/components/landing/LeadsJourney";
import { ExampleReviews } from "@/components/landing/ExampleReviews";
import { LeadCaptureForm } from "@/components/landing/LeadCaptureForm";
import { ShopifyLogo, WooCommerceLogo } from "@/components/landing/PlatformLogos";
import { SITE_NAME } from "@/lib/site-metadata";
import { siteUrl } from "@/lib/site-url";
import styles from "../checkout-recovery/leads/page.module.css";

export const metadata: Metadata = {
  title: `AI Voice Agent for COD, Carts & NDR — ${SITE_NAME}`,
  description: "AI calls and WhatsApp follow-ups to confirm COD orders, recover abandoned checkouts and follow up on failed deliveries.",
  alternates: { canonical: `${siteUrl}/leads` },
  robots: { index: false, follow: false },
};

export default function LeadsPage() {
  return <main className={styles.page}>
    <header className={styles.header}><div className={styles.wrap}>
      <Link href="/" aria-label="RecoverAgent home"><Image src="/recover-agent-logo-transparent.png" width={152} height={76} alt="RecoverAgent" className={styles.logo} priority /></Link>
      <a href="#book" className={styles.headerButton}>Request a call <ArrowRight size={16} aria-hidden /></a>
    </div></header>

    <section className={styles.hero}><div className={`${styles.wrap} ${styles.heroGrid}`}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>FOR INDIAN D2C BRANDS · 500+ ORDERS / MONTH</p>
        <h1>Confirm COD orders and recover more sales with AI calls.</h1>
        <p className={styles.lead}>Follow up on COD orders, abandoned checkouts and failed deliveries with AI calls and WhatsApp.</p>
        <div className={styles.compatibility}><span>Works with</span><span className={styles.platformBadge}><ShopifyLogo size={18} /> Shopify</span><span className={styles.platformBadge}><WooCommerceLogo size={13} /><span className={styles.srOnly}>WooCommerce</span></span></div>
        <div className={styles.heroNote}><CheckCircle size={19} weight="fill" aria-hidden /><span>14-day free trial available · AI calls in six Indian languages</span></div>
      </div>
      <div id="book" className={styles.form}><LeadCaptureForm idPrefix="voice-leads" initialGoal="cod" allowManualPlatform checkoutCallback /></div>
      <div className={styles.mobilePlatforms}><span>Works with</span><span className={styles.platformBadge}><ShopifyLogo size={18} /> Shopify</span><span className={styles.platformBadge}><WooCommerceLogo size={13} /><span className={styles.srOnly}>WooCommerce</span></span><span>AI calls in six Indian languages</span></div>
    </div></section>

    <section className={styles.audioSection}><div className={`${styles.wrap} ${styles.audioGrid}`}>
      <div><p className={styles.eyebrow}>HEAR IT FOR YOURSELF</p><h2>A real call.<br />A clearer decision before shipping.</h2><p>Hear the AI agent confirm a COD order with a shopper in Hindi.</p></div>
      <div className={styles.call}><div className={styles.callLabel}><PhoneCall size={19} weight="fill" aria-hidden /> REAL COD CONFIRMATION CALL</div><p>Hindi · COD confirmation</p><audio controls preload="none" aria-label="Play a real COD confirmation call in Hindi"><source src="/audio/COD_hindi.mp4" type="audio/mp4" />Your browser does not support audio playback.</audio></div>
    </div></section>

    <LeadsJourney />

    <ExampleReviews variant="voice" />

    <section className={styles.proof}><div className={`${styles.wrap} ${styles.proofInner}`}>
      <div><p className={styles.eyebrow}>14-DAY FREE TRIAL</p><h2>See how it works for your store.</h2><p>Our team will call you to discuss your workflows, pricing and the 14-day free trial.</p><a href="#book" className={styles.primary}>Request a call <ArrowRight size={17} aria-hidden /></a></div>
      <div className={styles.priceCard}><span>AFTER 14-DAY FREE TRIAL</span><p><strong>₹2,499</strong> / month</p><p>300 orders included · ₹5 per additional order</p><small>Starter includes AI calls for COD confirmation. AI calling for abandoned checkout recovery is available on Growth.</small></div>
    </div></section>

    <footer className={`${styles.wrap} ${styles.footer}`}><span>© {new Date().getFullYear()} RecoverAgent</span><a href="mailto:hello@recoveragent.ai">hello@recoveragent.ai</a><Link href="/policies/privacy-and-policy">Privacy policy</Link></footer>
  </main>;
}
