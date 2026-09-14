"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import { appleSpring } from "@/lib/motion";
import { useMobileNav } from "@/lib/use-mobile-nav";
import { useStickyBarVisible } from "@/lib/use-sticky-bar-visible";

const NAV_LINKS = [
  { href: "/new#calc", label: "Calculator" },
  { href: "/new#compare", label: "Compare" },
  { href: "/new#call", label: "Hear a call" },
  { href: "/new#plans", label: "Pricing" },
  { href: "/new#faq", label: "FAQ" },
];

const navActionSwap = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.94 },
  transition: appleSpring.ui,
};

export function NewNavbar() {
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
        <Link className="brand" href="/new">
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
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <AnimatePresence mode="wait" initial={false}>
            {showHamburger ? (
              <motion.div key="nav-menu" className="nav-menu-wrap" {...navActionSwap}>
                <button
                  type="button"
                  className="nav-menu-btn"
                  aria-expanded={menuOpen}
                  aria-controls="new-nav-mobile-menu"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  {menuOpen ? (
                    <X size={22} weight="bold" aria-hidden />
                  ) : (
                    <List size={22} weight="bold" aria-hidden />
                  )}
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <>
                      <motion.button
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="nav-menu-scrim"
                        aria-label="Close menu"
                        onClick={() => setMenuOpen(false)}
                      />
                      <motion.div
                        id="new-nav-mobile-menu"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site menu"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={appleSpring.ui}
                        className="nav-mobile-menu"
                      >
                        {NAV_LINKS.map((link) => (
                          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                            {link.label}
                          </a>
                        ))}
                        <Link href="/book-demo" onClick={() => setMenuOpen(false)}>
                          Book a demo
                        </Link>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.a
                key="nav-cta"
                className="btn btn-primary nav-cta"
                href="/book-demo"
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
