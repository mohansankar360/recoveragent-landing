"use client";

import { AnimatePresence, motion } from "framer-motion";
import { appleFade, appleSpring } from "@/lib/motion";
import type { PricingTier } from "@/lib/calculator";
import { scrollToSection } from "@/lib/utils";
import { PlanComparisonTable } from "./PlanComparisonTable";

interface PlansModalProps {
  open: boolean;
  onClose: () => void;
  highlightTierId?: PricingTier["id"];
}

export function PlansModal({ open, onClose, highlightTierId }: PlansModalProps) {
  const handleScrollToPlans = () => {
    onClose();
    window.setTimeout(() => scrollToSection("plans"), 200);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={appleFade}
            className="modal-scrim"
            aria-label="Close dialog"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={appleSpring.ui}
            className="modal-anchor"
          >
            <div
              className="modal-panel modal-panel-wide"
              role="dialog"
              aria-labelledby="plans-modal-title"
              aria-modal="true"
            >
              <button
                type="button"
                onClick={onClose}
                className="modal-close"
                aria-label="Close"
              >
                ×
              </button>
              <h3 id="plans-modal-title" className="modal-title">
                All plans
              </h3>
              <p className="modal-copy">
                Compare Starter, Growth, and Scale — pick what fits your monthly
                call volume.
              </p>
              <PlanComparisonTable highlightTierId={highlightTierId} />
              <button
                type="button"
                onClick={handleScrollToPlans}
                className="plans-scroll-link"
              >
                View full plans section on page ↓
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
