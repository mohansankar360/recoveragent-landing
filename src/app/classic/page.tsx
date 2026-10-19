import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { homeMetadata } from "@/lib/site-metadata";

// Previous homepage design, kept for side-by-side comparison. Not indexed.
export const metadata: Metadata = { ...homeMetadata, robots: { index: false, follow: false } };

export default function ClassicHome() {
  return <LandingPage variant="classic" />;
}
