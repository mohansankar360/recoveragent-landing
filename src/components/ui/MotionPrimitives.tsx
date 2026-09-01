"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { applePointerSpring } from "@/lib/motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
}

export function MagneticButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, applePointerSpring);
  const springY = useSpring(y, applePointerSpring);

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    secondary:
      "border border-line bg-canvas-panel text-ink hover:border-line-strong hover:bg-canvas-subtle",
    ghost: "text-ink-muted hover:text-ink hover:bg-canvas-subtle",
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.97 }}
      className={`rounded-full px-7 py-3 text-sm font-medium transition-colors sm:px-8 sm:py-3.5 sm:text-base ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function SpotlightCard({ children, className = "", dark = false }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const reduce = useReducedMotion();

  const spotlight = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(24,24,27,0.05), transparent 40%)`;

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`group relative overflow-hidden ${dark ? "product-shell" : "ops-panel"} ${className}`}
    >
      {!dark && !reduce && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
