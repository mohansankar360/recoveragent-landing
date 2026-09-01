import type { LandingVariant } from "@/lib/landing-variant";
import { Play } from "@phosphor-icons/react/ssr";
import { ShippingManifest } from "./ShippingManifest";

export function Hero({ variant: _variant = "full" }: { variant?: LandingVariant }) {
  return (
    <header className="hero" id="top">
      <div className="wrap">
        <div>
          <div className="eyebrow">For Indian D2C brands on Shopify · COD-heavy</div>
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
            The gap isn&apos;t a sales problem. It&apos;s COD orders that come back,
            checkouts nobody follows up on, and NDRs nobody re-attempts.
          </p>
          <p className="hero-sub">
            <strong>Recover Agent uses AI voice agents</strong> to call customers, along
            with WhatsApp and automated follow-ups, to recover that revenue — before the
            money walks.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#calc">
              Find my gap in 30 seconds →
            </a>
            <a className="btn btn-ghost" href="#call">
              <Play size={16} weight="fill" aria-hidden />
              Hear an actual call
            </a>
          </div>
          <p className="hero-note">Live on your store in 3 days. No call centre. No coding required.</p>
          <div className="tick">
            <div>
              <b>6</b>Indian languages
            </div>
            <div>
              <b>24% → 11%</b>Typical RTO shift
            </div>
          </div>
        </div>
        <ShippingManifest />
      </div>
    </header>
  );
}
