"use client";

/**
 * Backup — pricing CTAs before Apple-design v2 (Aug 2026).
 * To revert: copy this file to ../PlansCTA.tsx
 */
import { trackEvent } from "@/lib/analytics";

export function PlansCTA() {
  return (
    <div className="plans-cta">
      <p className="plans-cta-note">Zero setup fee · Live in 3 days · No annual lock-in</p>
      <div className="plans-cta-btns">
        <a
          className="btn btn-primary"
          href="#demo-booking"
          onClick={() => trackEvent("sticky_cta_clicked", { source: "pricing" })}
        >
          Book a demo
        </a>
        <a
          className="btn btn-ghost"
          href="#calc"
          onClick={() => trackEvent("calculator_cta_clicked", { source: "pricing" })}
        >
          Calculate my loss
        </a>
      </div>
    </div>
  );
}
