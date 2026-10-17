"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackOpenAIPageView } from "@/lib/openai-pixel";

export function OpenAIPageView() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    trackOpenAIPageView();
  }, [pathname]);
  return null;
}
