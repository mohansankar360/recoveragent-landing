"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";
import { PlanComparisonTable } from "../PlanComparisonTable";
import { PlansCTA } from "../PlansCTA";
import { PricingValueStack } from "./PricingValueStack";

export function NewPlansSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          trackEvent("pricing_viewed", { source: "new_landing" });
          hasTracked.current = true;
        }
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="sec" id="plans" ref={sectionRef}>
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">Pricing</div>
          <h2>Simple tiers. Clear value. No surprises.</h2>
          <p>
            AI voice for COD, cart recovery, and NDR — plus WhatsApp on every plan.
            Most brands start on Growth.
          </p>
        </Reveal>

        <Reveal className="new-plans-stack">
          <PricingValueStack />
          <PlanComparisonTable />
          <PlansCTA />
        </Reveal>
      </div>
    </section>
  );
}
