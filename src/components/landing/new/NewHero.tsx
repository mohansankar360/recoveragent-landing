import Link from "next/link";
import { Play } from "@phosphor-icons/react/ssr";
import { HeroCallCard } from "../HeroCallCard";
import { PricingValueStack } from "./PricingValueStack";

export function NewHero() {
  return (
    <header className="hero new-hero" id="top">
      <div className="wrap">
        <div>
          <div className="eyebrow">Built by a D2C founder · For Indian D2C ops</div>
          <h1 className="display">
            Shopify says
            <br />
            ₹10,00,000.
            <br />
            <span className="red">
              Your bank says
              <br />
              ₹6,80,000.
            </span>
          </h1>
          <p className="hero-sub">
            The <strong>revenue gap</strong> between what you sell and what lands in your account —
            from unverified COD, cold carts, and expired NDRs.
          </p>
          <p className="hero-sub">
            Recover Agent uses <strong>AI voice + WhatsApp</strong> to confirm orders, recover
            checkouts, and save deliveries — automatically, in 6 Indian languages.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" href="/new#calc">
              Find my gap in 30 seconds →
            </Link>
            <Link className="btn btn-ghost" href="/new#call">
              <Play size={16} weight="fill" aria-hidden />
              Hear an actual call
            </Link>
          </div>
          <p className="new-trust-line hero-trust">Live in 3 days · No setup fee · Cancel anytime</p>
          <div className="tick">
            <div>
              <b>6</b>Indian languages
            </div>
            <div>
              <b>24% → 11%</b>Typical RTO shift
            </div>
            <div>
              <b>70–80%</b>Recovery with voice + WA
            </div>
          </div>
          <PricingValueStack variant="hero" />
        </div>
        <HeroCallCard />
      </div>
    </header>
  );
}
