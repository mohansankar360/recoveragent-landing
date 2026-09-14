"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { PRICING_TIERS } from "@/lib/calculator";
import { appleSpring } from "@/lib/motion";
import { useStickyBarVisible } from "@/lib/use-sticky-bar-visible";

const STARTER_PRICE = PRICING_TIERS[0].base.toLocaleString("en-IN");

export function NewMobileStickyCTA() {
  const visible = useStickyBarVisible();

  const handleClick = () => {
    trackEvent("sticky_cta_clicked", { source: "new_sticky_bar" });
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
              className="btn btn-primary floating-cta new-floating-cta"
            >
              From ₹{STARTER_PRICE}/mo · Book demo
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
            className="sticky-sheet new-sticky-sheet"
          >
            <div className="sticky-sheet-inner">
              <div className="new-sticky-sheet-copy">
                <span className="new-sticky-price">From ₹{STARTER_PRICE}/mo</span>
                <p className="sticky-sheet-copy">See Recover Agent on your store</p>
              </div>
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
