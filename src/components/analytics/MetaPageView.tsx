"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { captureMetaClickId, trackMetaPageView } from "@/lib/meta-pixel";

export function MetaPageView() {
  const pathname = usePathname();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    captureMetaClickId();
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    trackMetaPageView(pathname);
  }, [pathname]);

  return null;
}
