import type { LandingVariant } from "@/lib/landing-variant";
import Link from "next/link";
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
          <h1 className="display">Turn at-risk orders into confirmed revenue.</h1>
          <p className="hero-sub">
            Revenue recovery operations for Indian D2C.
          </p>
          <p className="hero-sub">
            Recover Agent uses <strong>AI voice + WhatsApp</strong> to recover abandoned checkouts,
            confirm COD orders, and capture the next step after failed deliveries.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" href="/book-demo">
              Book a 30-minute demo →
            </Link>
            <Link className="btn btn-ghost" href="/hear-a-call">
              <Play size={16} weight="fill" aria-hidden />
              Hear an actual call
            </Link>
          </div>
          <p className="hero-note">See the product workflow on your recovery use cases.</p>
          <div className="tick">
            <div>
              <b>6</b>Indian languages
            </div>
            <div>
              <b>3</b>Recovery journeys
            </div>
          </div>
        </div>
        <HeroCallCard />
      </div>
    </header>
  );
}
