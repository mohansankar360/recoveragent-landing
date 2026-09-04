"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackMetaPageView } from "@/lib/meta-pixel";

export function MetaPageView() {
  const pathname = usePathname();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    trackMetaPageView(pathname);
  }, [pathname]);

  return null;
}
