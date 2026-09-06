"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { appleSpring } from "@/lib/motion";
import { useStickyBarVisible } from "@/lib/use-sticky-bar-visible";

export function MobileStickyCTA() {
  const visible = useStickyBarVisible();

  const handleClick = () => {
    trackEvent("sticky_cta_clicked", { source: "sticky_bar" });
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={appleSpring.ui}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/book-demo"
              onClick={handleClick}
              className="btn btn-primary floating-cta"
            >
              Losing orders to RTO? Book demo
            </Link>
          </motion.div>
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
              <Link
                href="/book-demo"
                onClick={handleClick}
                className="btn btn-primary sticky-sheet-btn"
              >
                Book demo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
