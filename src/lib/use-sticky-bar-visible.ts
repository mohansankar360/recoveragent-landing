"use client";

import { useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

export const STICKY_BAR_SCROLL_THRESHOLD = 600;

export function useStickyBarVisible(threshold = STICKY_BAR_SCROLL_THRESHOLD) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.scrollY > threshold);
  }, [threshold]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > threshold);
  });

  return visible;
}
