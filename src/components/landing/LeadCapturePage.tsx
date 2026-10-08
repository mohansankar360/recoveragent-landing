import Image from "next/image";
import Link from "next/link";
import {
  CalendarBlank,
  CheckCircle,
  IdentificationCard,
  Lightning,
  Package,
  Phone,
  TrendDown,
} from "@phosphor-icons/react/ssr";
import { LeadCaptureForm } from "./LeadCaptureForm";

const FEATURES = [
  {
    icon: Phone,
    title: "AI calls + WhatsApp follow-up",
    detail: "Verify COD orders automatically",
  },
  {
    icon: Package,
    title: "Handle NDR & RTO",
    detail: "Smart follow-ups to recover orders",
  },
  {
    icon: TrendDown,
    title: "More Delivered Orders",
    detail: "Less RTO. Higher revenue.",
  },
] as const;

const STEPS = [
  {
    icon: IdentificationCard,
    title: "Share your details",
    detail: "It takes less than 30 seconds.",
  },
  {
    icon: CalendarBlank,
    title: "Book your demo",
    detail: "Choose your time after sharing your details.",
  },
  {
    icon: Lightning,
    title: "See the impact",
    detail: "Get a live walkthrough and custom recommendation.",
  },
] as const;

const ASSURANCES = [
  "No credit card required",
  "Free, personalized demo",
  "See real use cases for your store",
] as const;

export function LeadCapturePage() {
  return (
    <div className="lead-page">
      <header className="lead-page-header wrap">
        <Link href="/" aria-label="Recover Agent home">
        <Image
          src="/recover-agent-logo-transparent.png"
          alt="Recover Agent"
          width={168}
          height={42}
          className="lead-page-logo"
          priority
        />
        </Link>
        <p className="lead-page-audience">
          <span aria-hidden>🇮🇳</span> Built for Indian D2C Brands
        </p>
      </header>

      <section className="lead-page-hero wrap">
        <div className="lead-page-copy">
          <div className="lead-page-pill">Automate · Recover · Grow</div>
          <h1>Reduce RTO. Recover More Revenue.</h1>
          <p className="lead-page-sub">
            Automate COD verification, NDR follow-ups and RTO recovery with AI
            calling and WhatsApp — so you can focus on growing your brand.
          </p>

          <ul className="lead-page-features">
            {FEATURES.map(({ icon: Icon, title, detail }) => (
              <li key={title}>
                <span className="lead-page-feature-icon" aria-hidden>
                  <Icon size={18} weight="duotone" />
                </span>
                <span>
                  <strong>{title}</strong>
                  <span>{detail}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="lead-page-visual" aria-hidden>
            <div className="lead-page-rto-card">
              <span className="lead-page-rto-label">Average RTO · 100+ live brands</span>
              <strong>32% → 17%</strong>
              <span className="lead-page-rto-delta">−47%</span><small className="lead-result-note">Reported by RecoverAgent from live brand data. Individual results vary.</small>
              <svg viewBox="0 0 120 40" className="lead-page-rto-chart">
                <polyline
                  points="0,4 24,8 48,14 72,22 96,28 120,32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="lead-page-phone">
              <div className="lead-page-phone-top">
                <span>RecoverAgent AI</span>
                <span className="lead-page-phone-live">Live</span>
              </div>
              <p>Confirming your COD order…</p>
              <div className="lead-page-phone-wave">
                {Array.from({ length: 12 }, (_, i) => (
                  <i key={i} style={{ animationDelay: `${i * 0.08}s` }} />
                ))}
              </div>
            </div>
            <p className="lead-page-visual-note">
              Turn more COD orders into delivered orders
            </p>
          </div>
        </div>

        <LeadCaptureForm />
      </section>

      <section className="lead-page-steps wrap">
        <h2>How it works</h2>
        <ol className="lead-page-steps-grid">
          {STEPS.map(({ icon: Icon, title, detail }, index) => (
            <li key={title}>
              <span className="lead-page-step-icon" aria-hidden>
                <Icon size={22} weight="duotone" />
              </span>
              <span className="lead-page-step-num">{index + 1}</span>
              <strong>{title}</strong>
              <p>{detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="lead-page-footer">
        <ul className="lead-page-assurances wrap">
          {ASSURANCES.map((item) => (
            <li key={item}>
              <CheckCircle size={16} weight="fill" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
