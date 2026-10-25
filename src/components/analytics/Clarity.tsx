"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { buildClaritySnippet, getClarityProjectId } from "@/lib/clarity";
import { startEngagementTracking } from "@/lib/visitor-engagement";

export function ClarityHead() {
  const projectId = getClarityProjectId();
  if (!projectId) return null;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: buildClaritySnippet(projectId) }}
    />
  );
}

/** Tracks scroll depth, active time and visitor info for lead submissions. */
export function VisitorEngagement() {
  const pathname = usePathname();

  useEffect(() => {
    startEngagementTracking();
  }, [pathname]);

  return null;
}
