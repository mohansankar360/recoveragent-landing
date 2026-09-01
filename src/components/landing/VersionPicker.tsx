import Link from "next/link";
import { LANDING_VARIANTS } from "@/lib/landing-variant";

export function VersionPicker() {
  return (
    <div className="version-picker">
      <div className="wrap">
        <div className="version-picker-head">
          <div className="eyebrow">Landing page variants</div>
          <h1 className="display">Compare conversion paths</h1>
          <p className="version-picker-sub">
            Same product, two audience-optimised flows — plus the original full page for
            side-by-side review.
          </p>
        </div>

        <div className="version-picker-grid">
          {LANDING_VARIANTS.map((variant) => (
            <Link key={variant.id} href={variant.path} className="version-picker-card">
              <span className="version-picker-card-label">{variant.label}</span>
              <strong className="version-picker-card-tagline">{variant.tagline}</strong>
              <p className="version-picker-card-audience">{variant.audience}</p>
              <span className="version-picker-card-cta">Open preview →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
