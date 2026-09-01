"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/AnimatedCounter";
import { X, Check } from "@phosphor-icons/react";
import { appleSpring } from "@/lib/motion";

const withoutItems = [
  "Team manually calls COD customers",
  "Customers don't answer",
  "Follow-ups get missed",
  "NDRs sit unresolved",
  "RTO happens",
  "Revenue disappears",
  "Operations depend on people",
];

const withItems = [
  "AI calls automatically",
  "Customer intent is captured",
  "WhatsApp follow-ups run on autopilot",
  "COD to prepaid opportunities surface",
  "NDR follow-ups happen automatically",
  "Team handles only exceptions",
  "Recovery becomes measurable",
];

export function BeforeAfter() {
  const [mode, setMode] = useState<"without" | "with">("without");
  const items = mode === "without" ? withoutItems : withItems;

  return (
    <section className="section-padding bg-canvas">
      <div className="container-narrow">
        <FadeIn>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tighter text-ink sm:text-4xl">
              Manual calls vs.
              <span className="block text-ink-muted">automated recovery.</span>
            </h2>
            <div className="flex rounded-full border border-line bg-canvas-panel p-1 shadow-panel">
              {(["without", "with"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`relative rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                    mode === key ? "text-white" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {mode === key && (
                    <motion.span
                      layoutId="before-after-pill"
                      className={`absolute inset-0 rounded-full ${key === "without" ? "bg-ops-loss" : "bg-ops-confirm"}`}
                      transition={appleSpring.ui}
                    />
                  )}
                  <span className="relative z-10">
                    {key === "without" ? "Without" : "With RecoverAgent"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div
            className={`mt-10 overflow-hidden rounded-shell border p-8 sm:p-10 ${
              mode === "without"
                ? "border-ops-loss/20 bg-ops-loss-bg/40"
                : "border-ops-confirm/20 bg-ops-confirm-bg/40"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.ul
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={appleSpring.ui}
                className="grid gap-4 sm:grid-cols-2"
              >
                {items.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...appleSpring.ui, delay: i * 0.04 }}
                    className="flex items-start gap-3 text-sm text-ink-muted"
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        mode === "without" ? "bg-ops-loss/15 text-ops-loss" : "bg-ops-confirm/15 text-ops-confirm"
                      }`}
                    >
                      {mode === "without" ? <X size={12} weight="bold" /> : <Check size={12} weight="bold" />}
                    </span>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
