"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
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
    <section id="how-it-works" className="sec">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">How it works</div>
          <h2>One COD order. Multiple chances to save it.</h2>
        </Reveal>

        <div className="recovery-workflow">
          <div className="recovery-workflow-pills">
            {steps.map((step, i) => (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(i)}
                className={`recovery-workflow-pill${activeStep === i ? " is-active" : ""}`}
              >
                {step.title}
              </button>
            ))}
          </div>

          <div className="recovery-workflow-nav">
            {steps.map((step, i) => (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(i)}
                className={`recovery-workflow-step${activeStep === i ? " is-active" : ""}`}
              >
                <span className="recovery-workflow-step-num">{step.id}</span>
                <div>
                  <p className="recovery-workflow-step-title">{step.title}</p>
                  <p className="recovery-workflow-step-summary">{step.summary}</p>
                </div>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={appleSpring.ui}
              className="recovery-workflow-panel"
            >
              <p className="recovery-workflow-panel-label">Step {current.id}</p>
              <h3>{current.title}</h3>
              <p>{current.detail}</p>

              <div className="recovery-workflow-panel-card">
                <p className="recovery-workflow-panel-card-label">{current.panel.title}</p>
                <ul className="recovery-workflow-panel-list">
                  {current.panel.items.map((item) => (
                    <li key={item}>{item}</li>
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
