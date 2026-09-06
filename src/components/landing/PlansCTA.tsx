"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export function PlansCTA() {
  return (
    <div className="plans-cta">
      <p className="plans-cta-note">Zero setup fee · Live in 3 days · No annual lock-in</p>
      <div className="plans-cta-btns">
        <Link
          className="btn btn-ghost plans-calc-cta"
          href="/loss-calculator"
          onClick={() => trackEvent("calculator_cta_clicked", { source: "pricing" })}
        >
          Calculate my loss
        </Link>
        <Link
          className="btn btn-primary plans-demo-cta"
          href="/book-demo"
          onClick={() => trackEvent("sticky_cta_clicked", { source: "pricing" })}
        >
          Book a demo
        </Link>
      </div>
    </div>
  );
}
