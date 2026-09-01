"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { trackEvent } from "@/lib/analytics";
import { PlanComparisonTable } from "./PlanComparisonTable";
import { PlansCTA } from "./PlansCTA";

export function PlansSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          trackEvent("pricing_viewed");
          hasTracked.current = true;
        }
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="sec sec-alt" id="plans" ref={sectionRef}>
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">Pricing</div>
          <h2>Simple tiers. No surprises.</h2>
          <p>
            AI voice calls for COD, cart recovery, and NDR — plus WhatsApp flows on
            every plan.
          </p>
        </Reveal>

        <Reveal>
          <PlanComparisonTable />
          <PlansCTA />
        </Reveal>
      </div>
    </section>
  );
}
