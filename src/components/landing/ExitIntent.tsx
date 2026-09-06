"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { appleFade, appleSpring } from "@/lib/motion";

export function ExitIntent() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (shown) return;
      if (e.clientY <= 0) {
        setOpen(true);
        setShown(true);
        trackEvent("exit_intent_shown");
      }
    },
    [shown]
  );

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [handleMouseLeave]);

  const handleCTA = () => {
    trackEvent("exit_intent_cta_clicked");
    setOpen(false);
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
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={appleSpring.ui}
            className="modal-anchor"
          >
            <div className="modal-panel" role="dialog" aria-labelledby="exit-intent-title" aria-modal="true">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="modal-close"
                aria-label="Close"
              >
                ×
              </button>
              <h3 id="exit-intent-title" className="modal-title">
                Still handling COD calls manually?
              </h3>
              <p className="modal-copy">
                See how Recover Agent automates confirmation, NDR follow-up, and recovery
                before orders turn into RTO.
              </p>
              <Link href="/book-demo" onClick={handleCTA} className="btn btn-primary modal-cta">
                See a 10-min demo
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
