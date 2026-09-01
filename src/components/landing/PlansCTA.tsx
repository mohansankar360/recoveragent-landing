"use client";

import { trackEvent } from "@/lib/analytics";

export function PlansCTA() {
  return (
    <div className="plans-cta">
      <p className="plans-cta-note">Zero setup fee · Live in 3 days · No annual lock-in</p>
      <div className="plans-cta-btns">
        <a
          className="btn btn-ghost plans-calc-cta"
          href="#calc"
          onClick={() => trackEvent("calculator_cta_clicked", { source: "pricing" })}
        >
          Calculate my loss
        </a>
        <a
          className="btn btn-primary plans-demo-cta"
          href="#demo-booking"
          onClick={() => trackEvent("sticky_cta_clicked", { source: "pricing" })}
        >
          Book a demo
        </a>
      </div>
    </div>
  );
}
