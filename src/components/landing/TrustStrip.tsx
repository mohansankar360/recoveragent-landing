"use client";

import { FadeIn } from "@/components/ui/AnimatedCounter";
import { SpotlightCard } from "@/components/ui/MotionPrimitives";
import { ShieldCheck, ArrowsClockwise, TrendDown } from "@phosphor-icons/react";

const metrics = [
  {
    label: "COD Verification",
    description: "Confirm intent before shipping",
    icon: ShieldCheck,
    placeholder: "...",
    unit: "orders verified",
    tone: "text-ops-cod",
    bg: "bg-ops-cod-bg",
  },
  {
    label: "NDR Recovery",
    description: "Automated follow-up on failed deliveries",
    icon: ArrowsClockwise,
    placeholder: "...",
    unit: "cases handled",
    tone: "text-ops-ndr",
    bg: "bg-ops-ndr-bg",
  },
  {
    label: "RTO Reduction",
    description: "Systematic intervention before loss",
    icon: TrendDown,
    placeholder: "...",
    unit: "RTO prevented",
    tone: "text-ops-loss",
    bg: "bg-ops-loss-bg",
  },
];

export function TrustStrip() {
  return (
    <section className="border-b border-line bg-canvas-panel py-14">
      <div className="container-wide px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="mb-8 text-center font-mono text-xs uppercase tracking-widest text-ink-faint">
            Built for D2C brands that ship COD at scale
          </p>
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <FadeIn key={metric.label} delay={i * 0.08}>
                <SpotlightCard className="p-6">
                  <div className={`inline-flex rounded-lg ${metric.bg} p-2.5`}>
                    <Icon size={20} className={metric.tone} weight="duotone" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-ink">{metric.label}</p>
                  <p className="mt-2 font-mono text-3xl font-semibold tracking-tight text-ink-faint">
                    {metric.placeholder}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-ink-faint">{metric.unit}</p>
                  <p className="mt-3 text-xs leading-relaxed text-ink-muted">{metric.description}</p>
                </SpotlightCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
