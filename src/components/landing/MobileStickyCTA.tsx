"use client";

import { motion, AnimatePresence } from "framer-motion";
import { scrollToSection } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { appleSpring } from "@/lib/motion";
import { useStickyBarVisible } from "@/lib/use-sticky-bar-visible";

export function MobileStickyCTA() {
  const visible = useStickyBarVisible();

  const handleClick = () => {
    trackEvent("sticky_cta_clicked", { source: "sticky_bar" });
    scrollToSection("demo-booking");
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={appleSpring.ui}
            onClick={handleClick}
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary floating-cta"
          >
            Losing orders to RTO? Book demo
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={appleSpring.sheet}
            className="sticky-sheet"
          >
            <div className="sticky-sheet-inner">
              <p className="sticky-sheet-copy">See Recover Agent in action</p>
              <button type="button" onClick={handleClick} className="btn btn-primary sticky-sheet-btn">
                Book demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
