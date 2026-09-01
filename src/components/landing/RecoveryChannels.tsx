"use client";

import { FadeIn } from "@/components/ui/AnimatedCounter";
import { SpotlightCard } from "@/components/ui/MotionPrimitives";

const phases = [
  {
    phase: "Before Shipping",
    items: [
      { title: "COD Confirmation", description: "AI calls customers automatically. Verify intent before shipping." },
      { title: "COD to Prepaid", description: "Give customers a chance to pay online." },
    ],
  },
  {
    phase: "During Delivery",
    items: [
      { title: "NDR Recovery", description: "Automatically follow up when delivery fails. Identify the reason. Trigger reattempt workflows." },
    ],
  },
  {
    phase: "After Customer Drops",
    items: [
      { title: "Abandoned Checkout Recovery", description: "Recover customers who were ready to purchase but didn't complete checkout." },
    ],
  },
];

const flowSteps = ["Order", "Confirm", "Convert", "Deliver", "Recover"];

export function RecoveryChannels() {
  return (
    <section className="section-padding bg-canvas">
      <div className="container-narrow">
        <FadeIn>
          <h2 className="text-left text-3xl font-bold tracking-tighter text-ink sm:text-4xl">
            RTO doesn&apos;t start at the doorstep.
          </h2>
          <p className="mt-4 max-w-2xl text-ink-muted">
            RecoverAgent covers the entire recovery journey, not just one touchpoint.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-2 sm:gap-3">
            {flowSteps.map((step, i) => (
              <div key={step} className="flex items-center gap-2 sm:gap-3">
                <span className="rounded-lg border border-line bg-canvas-panel px-3 py-1.5 font-mono text-xs font-medium text-ink-muted">
                  {step}
                </span>
                {i < flowSteps.length - 1 && <span className="text-ink-faint">→</span>}
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="mt-12 space-y-10">
          {phases.map((phase, pi) => (
            <FadeIn key={phase.phase} delay={pi * 0.1}>
              <div>
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink-faint">{phase.phase}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {phase.items.map((item) => (
                    <SpotlightCard key={item.title} className="p-6">
                      <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
