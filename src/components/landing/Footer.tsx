import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div><b>RecoverAgent</b><p>AI calls and WhatsApp recovery for Indian D2C.</p><p className="site-footer-platforms">Shopify · WooCommerce</p></div>
        <nav aria-label="Footer navigation"><Link href="/#workflows">How it works</Link><Link href="/hear-a-call">Hear a call</Link><Link href="/control-room">Dashboard</Link><Link href="/loss-calculator">Loss calculator</Link><Link href="/plans">Pricing</Link><Link href="/go-live">Onboarding</Link><Link href="/faq">FAQ</Link><Link href="/blog">Guides</Link><a href="mailto:hello@recoveragent.ai">Contact</a></nav>
      </div>
    </footer>
  );
}
