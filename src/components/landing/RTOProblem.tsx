"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "@/components/ui/AnimatedCounter";
import { SpotlightCard } from "@/components/ui/MotionPrimitives";
import {
  ShoppingCart,
  PhoneX,
  Truck,
  Warning,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";

const journeySteps = [
  {
    title: "COD Order",
    detail: "₹2,499",
    icon: ShoppingCart,
    tone: "text-ink-muted",
    bg: "bg-canvas-subtle",
    ring: "ring-line",
  },
  {
    title: "No Answer",
    detail: "Unconfirmed",
    icon: PhoneX,
    tone: "text-ops-cod",
    bg: "bg-ops-cod-bg",
    ring: "ring-ops-cod/20",
  },
  {
    title: "Delivery Fail",
    detail: "Unavailable",
    icon: Truck,
    tone: "text-ops-ndr",
    bg: "bg-ops-ndr-bg",
    ring: "ring-ops-ndr/20",
  },
  {
    title: "NDR",
    detail: "Not responding",
    icon: Warning,
    tone: "text-ops-ndr",
    bg: "bg-ops-ndr-bg",
    ring: "ring-ops-ndr/30",
  },
  {
    title: "RTO",
    detail: "₹2,499 lost",
    icon: ArrowCounterClockwise,
    tone: "text-ops-loss",
    bg: "bg-ops-loss-bg",
    ring: "ring-ops-loss/30",
  },
];

export function RTOProblem() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);

  return (
    <section className="section-padding bg-canvas">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <FadeIn>
            <h2 className="text-left text-3xl font-bold tracking-tighter text-ink sm:text-4xl lg:text-5xl">
              Your COD order
              <span className="block text-ink-muted">isn&apos;t revenue yet.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted">
              Every unconfirmed COD order is one missed call away from becoming an RTO.
            </p>
          </FadeIn>

          <div ref={ref} className="relative">
            <motion.div
              style={{ scaleX: lineScale }}
              className="absolute left-0 right-0 top-1/2 hidden h-px origin-left bg-line-strong lg:block"
            />

            <div className="hidden lg:grid lg:grid-cols-5 lg:gap-3">
              {journeySteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.12, type: "spring", stiffness: 100, damping: 20 }}
                  >
                    <SpotlightCard className={`${step.bg} p-4`}>
                      <div
                        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ring-1 ${step.ring} bg-canvas-panel`}
                      >
                        <Icon size={18} className={step.tone} weight="duotone" />
                      </div>
                      <p className={`text-[11px] font-semibold uppercase tracking-wide ${step.tone}`}>
                        {step.title}
                      </p>
                      <p className="mt-1 font-mono text-sm text-ink">{step.detail}</p>
                    </SpotlightCard>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory lg:hidden">
              {journeySteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.1 }}
                    className="w-[72vw] shrink-0 snap-center sm:w-[280px]"
                  >
                    <SpotlightCard className={`${step.bg} p-5`}>
                      <Icon size={22} className={step.tone} weight="duotone" />
                      <p className={`mt-3 text-xs font-semibold uppercase ${step.tone}`}>
                        {step.title}
                      </p>
                      <p className="mt-1 font-mono text-sm text-ink">{step.detail}</p>
                    </SpotlightCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <FadeIn delay={0.2}>
          <div className="relative mt-12 overflow-hidden rounded-shell border border-line bg-canvas-panel p-6 shadow-panel sm:p-8">
            <div className="absolute inset-y-0 left-0 w-1 bg-ops-confirm" />
            <p className="pl-4 text-lg font-semibold tracking-tight text-ink">
              RecoverAgent intervenes before the loss.
            </p>
            <p className="mt-2 max-w-2xl pl-4 text-sm leading-relaxed text-ink-muted">
              AI calls, WhatsApp follows up, and your team handles only the exceptions.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
