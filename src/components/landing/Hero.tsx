import type { LandingVariant } from "@/lib/landing-variant";
import { Play } from "@phosphor-icons/react/ssr";
import { HeroCallCard } from "./HeroCallCard";
export function Hero({ variant: _variant = "full" }: { variant?: LandingVariant }) {
  return (
    <header className="hero" id="top">
      <div className="wrap">
        <div>
          <div className="eyebrow">
            Built by a D2C founder · For D2C Ops
          </div>
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
            The <strong>revenue gap hiding</strong> inside your ecommerce operations.
          </p>
          <p className="hero-sub">
            Recover Agent uses <strong>AI voice agents</strong> to recover abandoned checkouts,
            confirm COD orders, and save failed deliveries — <strong>automatically</strong>.
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
        <HeroCallCard />
      </div>
    </header>
  );
}
