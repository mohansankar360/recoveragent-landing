"use client";

import { useEffect, useRef } from "react";
import { FadeIn } from "@/components/ui/AnimatedCounter";
import { SpotlightCard } from "@/components/ui/MotionPrimitives";
import { scrollToSection } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { Check } from "@phosphor-icons/react";

const features = [
  "AI Voice Agent",
  "Multi-language conversations",
  "WhatsApp automation",
  "COD confirmation",
  "COD to Prepaid conversion",
  "NDR management",
  "Abandoned checkout recovery",
  "Dashboard & analytics",
];

import { PRICING_TIERS } from "@/lib/calculator";

export function Pricing() {
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
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDemo = () => {
    trackEvent("sticky_cta_clicked", { source: "pricing" });
    scrollToSection("demo-booking");
  };

  return (
    <section id="pricing" ref={sectionRef} className="section-padding bg-canvas">
      <div className="container-narrow">
        <FadeIn>
          <h2 className="text-left text-3xl font-bold tracking-tighter text-ink sm:text-4xl">
            Simple pricing. No surprises.
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {PRICING_TIERS.map((plan) => (
              <SpotlightCard key={plan.name} className={`p-8 ${plan.recommended ? "ring-2 ring-brand" : ""}`}>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-ink">{plan.name}</h3>
                  {plan.recommended && (
                    <span className="text-sm" aria-label="Recommended plan">
                      ★
                    </span>
                  )}
                </div>
                <div className="mt-6">
                  <span className="font-mono text-4xl font-bold text-ink">
                    ₹{plan.base.toLocaleString("en-IN")}
                  </span>
                  <span className="text-ink-muted"> / month</span>
                </div>
                <p className="mt-2 font-mono text-sm text-ink-muted">
                  {plan.includedCalls.toLocaleString("en-IN")} AI voice calls included
                </p>
                <p className="mt-1 font-mono text-sm text-ink-muted">
                  + ₹{plan.overagePerOrder} per additional order
                </p>
                <p className="mt-1 text-sm font-medium text-ops-confirm">Zero setup fee</p>

                <ul className="mt-8 space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-ink-muted">
                      <Check size={16} className="shrink-0 text-ops-confirm" weight="bold" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleDemo}
                  className="mt-8 w-full rounded-full bg-brand py-3.5 text-base font-medium text-white transition-colors hover:bg-brand-dark active:scale-[0.98]"
                >
                  Book a Demo
                </button>
              </SpotlightCard>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
