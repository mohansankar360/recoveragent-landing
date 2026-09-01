"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/AnimatedCounter";
import { trackEvent } from "@/lib/analytics";
import { appleSpring } from "@/lib/motion";

const steps = [
  {
    id: "01",
    title: "COD Order",
    summary: "Order enters Shopify",
    detail:
      "When a new COD order is placed, RecoverAgent picks it up automatically. No manual export, no spreadsheet.",
    panel: {
      title: "Order Sync",
      items: ["Shopify webhook triggered", "Order #GS48291 · ₹2,499 · COD", "Recovery journey initiated"],
    },
  },
  {
    id: "02",
    title: "AI Call",
    summary: "RecoverAgent calls the customer",
    detail:
      "Within minutes, the AI voice agent calls the customer to confirm intent before you ship.",
    panel: {
      title: "AI Voice Agent",
      items: ["Calling Priya · +91 98XXX XXXXX", "Language: Hindi", "Intent: COD confirmation"],
    },
  },
  {
    id: "03",
    title: "Customer Response",
    summary: "AI understands multiple languages",
    detail:
      "Customers respond naturally. RecoverAgent understands intent, not just button clicks.",
    panel: {
      title: "Intent Detection",
      items: ['"Yes, confirm"', '"Call me later"', '"I don\'t want it"', '"Can you send it tomorrow?"', '"I ordered by mistake"'],
    },
  },
  {
    id: "04",
    title: "WhatsApp",
    summary: "Confirmation & follow-up via WhatsApp",
    detail:
      "Send order confirmation, payment links, and follow-ups through WhatsApp automatically.",
    panel: {
      title: "WhatsApp Automation",
      items: ["Order confirmation sent", "Delivery update scheduled", "Payment link ready"],
    },
  },
  {
    id: "05",
    title: "COD → Prepaid",
    summary: "Offer prepaid conversion",
    detail:
      "Give customers an opportunity to pay online, reducing COD risk before dispatch.",
    panel: {
      title: "Prepaid Conversion",
      items: ["₹50 discount offered for prepaid", "Payment link via WhatsApp", "Order updated on Shopify"],
    },
  },
  {
    id: "06",
    title: "NDR",
    summary: "Automatic follow-up on failed delivery",
    detail:
      "If delivery fails, RecoverAgent follows up automatically to understand why and trigger reattempt.",
    panel: {
      title: "NDR Management",
      items: ['NDR reason: "Customer unavailable"', "AI call initiated", "Reattempt scheduled"],
    },
  },
  {
    id: "07",
    title: "Recovery",
    summary: "Another chance to receive the order",
    detail:
      "Customer gets another opportunity to receive the order, turning a potential RTO into a delivery.",
    panel: {
      title: "Order Recovered",
      items: ["Customer confirmed reattempt", "Delivery rescheduled", "RTO prevented"],
    },
  },
];

export function RecoveryJourney() {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    trackEvent("workflow_step_clicked", { step: steps[index].id });
  };

  const current = steps[activeStep];

  return (
    <section id="how-it-works" className="section-padding">
      <div className="container-wide">
        <FadeIn>
          <h2 className="text-left text-3xl font-bold tracking-tighter text-ink sm:text-4xl">
            One COD order. Multiple chances to save it.
          </h2>
        </FadeIn>

        <div className="mt-16 grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Mobile: swipeable step pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden snap-x snap-mandatory scrollbar-none">
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(i)}
                className={`shrink-0 snap-start rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  activeStep === i
                    ? "bg-ink text-white"
                    : "ops-panel text-ink-muted"
                }`}
              >
                {step.title}
              </button>
            ))}
          </div>

          {/* Desktop timeline */}
          <div className="hidden space-y-1 lg:block">
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(i)}
                className={`group flex w-full items-start gap-4 rounded-xl p-4 text-left transition-all ${
                  activeStep === i
                    ? "bg-canvas-subtle ring-1 ring-line-strong"
                    : "hover:bg-canvas-subtle"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                    activeStep === i
                      ? "bg-ink text-white"
                      : "ops-panel text-ink-faint"
                  }`}
                >
                  {step.id}
                </span>
                <div>
                  <p className={`text-sm font-semibold ${activeStep === i ? "text-ink" : "text-ink-muted"}`}>
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-faint">{step.summary}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={appleSpring.ui}
              className="ops-panel p-6 sm:p-8"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
                Step {current.id}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-ink">{current.title}</h3>
              <p className="mt-3 text-ink-muted">{current.detail}</p>

              <div className="mt-8 rounded-lg border border-line bg-canvas-subtle p-5">
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink-faint">
                  {current.panel.title}
                </p>
                <ul className="space-y-3">
                  {current.panel.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-ink-muted">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ops-confirm" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
