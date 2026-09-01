"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import type { LandingVariant } from "@/lib/landing-variant";
import { appleSpring } from "@/lib/motion";
import { useMobileNav } from "@/lib/use-mobile-nav";
import { useStickyBarVisible } from "@/lib/use-sticky-bar-visible";

const navActionSwap = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.94 },
  transition: appleSpring.ui,
};

const NAV_LINKS: Record<LandingVariant, { href: string; label: string }[]> = {
  cold: [
    { href: "#calc", label: "Calculator" },
    { href: "#control-room", label: "Control room" },
    { href: "#call", label: "Hear a call" },
    { href: "#plans", label: "Plans" },
    { href: "#demo-booking", label: "Book demo" },
  ],
  warm: [
    { href: "#calc", label: "Calculator" },
    { href: "#call", label: "Hear a call" },
    { href: "#control-room", label: "Control room" },
    { href: "#plans", label: "Plans" },
    { href: "#demo-booking", label: "Book demo" },
  ],
  full: [
    { href: "#leaks", label: "Where you leak" },
    { href: "#control-room", label: "Control room" },
    { href: "#calc", label: "Loss calculator" },
    { href: "#plans", label: "Plans" },
    { href: "#call", label: "Hear a call" },
    { href: "#demo-booking", label: "Book a demo" },
  ],
};

export function Navbar({ variant = "full" }: { variant?: LandingVariant }) {
  const isMobile = useMobileNav();
  const stickyBarVisible = useStickyBarVisible();
  const [menuOpen, setMenuOpen] = useState(false);
  const showHamburger = isMobile && stickyBarVisible;

  useEffect(() => {
    if (!showHamburger) setMenuOpen(false);
  }, [showHamburger]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <nav className="site-nav">
      <div className="wrap">
        <Link className="brand" href="#top">
          <Image
            src="/recover-agent-logo-transparent.png"
            alt="Recover Agent"
            width={180}
            height={44}
            className="brand-logo"
            priority
          />
        </Link>
        <div className="nav-links">
          {NAV_LINKS[variant].map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <AnimatePresence mode="wait" initial={false}>
            {showHamburger ? (
              <motion.div
                key="nav-menu"
                className="nav-menu-wrap"
                {...navActionSwap}
              >
                <button
                  type="button"
                  className="nav-menu-btn"
                  aria-expanded={menuOpen}
                  aria-controls="nav-mobile-menu"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {menuOpen ? (
                      <motion.span
                        key="close"
                        className="nav-menu-icon"
                        initial={{ opacity: 0, rotate: -45, scale: 0.85 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 45, scale: 0.85 }}
                        transition={appleSpring.ui}
                      >
                        <X size={22} weight="bold" aria-hidden />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="open"
                        className="nav-menu-icon"
                        initial={{ opacity: 0, rotate: 45, scale: 0.85 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -45, scale: 0.85 }}
                        transition={appleSpring.ui}
                      >
                        <List size={22} weight="bold" aria-hidden />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <>
                      <motion.button
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="nav-menu-scrim"
                        aria-label="Close menu"
                        onClick={() => setMenuOpen(false)}
                      />
                      <motion.div
                        id="nav-mobile-menu"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site menu"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={appleSpring.ui}
                        className="nav-mobile-menu"
                      >
                        {NAV_LINKS[variant].map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                          >
                            {link.label}
                          </a>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.a
                key="nav-cta"
                className="btn btn-primary nav-cta"
                href="#demo-booking"
                {...navActionSwap}
              >
                Book a 15-min demo
              </motion.a>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
