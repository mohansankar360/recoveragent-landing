import Link from "next/link";

interface ConversionCTAProps {
  title: string;
  subtitle?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  source: string;
  compact?: boolean;
}

export function ConversionCTA({
  title,
  subtitle,
  primaryHref = "/book-demo",
  primaryLabel = "Book a 15-min demo",
  secondaryHref = "/new#calc",
  secondaryLabel = "Calculate my gap →",
  source,
  compact = false,
}: ConversionCTAProps) {
  return (
    <section className={`new-cta-band${compact ? " is-compact" : ""}`}>
      <div className="wrap">
        <div className="new-cta-band-inner">
          <div className="new-cta-band-copy">
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="new-cta-band-actions">
            <Link className="btn btn-primary" href={primaryHref} data-cta-source={source}>
              {primaryLabel}
            </Link>
            <Link className="btn btn-ghost" href={secondaryHref}>
              {secondaryLabel}
            </Link>
            <p className="new-trust-line">Live in 3 days · No setup fee · Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
}
