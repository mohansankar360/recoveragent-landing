"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretDown, List, X } from "@phosphor-icons/react";
import { appleSpring } from "@/lib/motion";
import { useMobileNav } from "@/lib/use-mobile-nav";

const navActionSwap = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.94 },
  transition: appleSpring.ui,
};

const PRIMARY_NAV_LINKS = [
  { href: '/#workflows', label: 'How it works' },
  { href: '/hear-a-call', label: 'Hear a call' },
  { href: '/#results', label: 'Results' },
  { href: '/control-room', label: 'Dashboard' },
  { href: '/loss-calculator', label: 'Loss calculator' },
  { href: '/plans', label: 'Pricing' },
];

const MORE_NAV_LINKS: { href: string; label: string }[] = [];

export function Navbar() {
  const isMobile = useMobileNav();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const showHamburger = isMobile;

  useEffect(() => {
    if (!showHamburger) setMenuOpen(false);
  }, [showHamburger]);

  useEffect(() => {
    if (!menuOpen && !moreOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMoreOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, moreOpen]);

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="wrap">
        <Link className="brand" href="/">
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
          {PRIMARY_NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
              {link.label}
            </a>
          ))}
          {MORE_NAV_LINKS.length > 0 && (
            <div className="nav-more-wrap">
              <button
                type="button"
                className="nav-more-btn"
                aria-expanded={moreOpen}
                aria-controls="nav-more-menu"
                onClick={() => setMoreOpen((open) => !open)}
              >
                More
                <CaretDown
                  size={14}
                  weight="bold"
                  aria-hidden
                  className={moreOpen ? "nav-more-caret open" : "nav-more-caret"}
                />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <>
                    <motion.button
                      type="button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="nav-menu-scrim"
                      aria-label="Close menu"
                      onClick={() => setMoreOpen(false)}
                    />
                    <motion.div
                      id="nav-more-menu"
                      role="menu"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={appleSpring.ui}
                      className="nav-more-menu"
                    >
                      {MORE_NAV_LINKS.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          aria-current={pathname === link.href ? "page" : undefined}
                          role="menuitem"
                          onClick={() => setMoreOpen(false)}
                        >
                          {link.label}
                        </a>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
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
                        {PRIMARY_NAV_LINKS.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            aria-current={pathname === link.href ? "page" : undefined}
                            onClick={() => setMenuOpen(false)}
                          >
                            {link.label}
                          </a>
                        ))}
                        <Link href="/book-demo" className="nav-mobile-book" onClick={() => setMenuOpen(false)}>
                          Book a 30-minute demo
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
                Book a 30-min demo
              </motion.a>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
