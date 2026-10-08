import type { Metadata } from "next";
import { ClarityPreview } from "@/components/landing/ClarityPreview";

export const metadata: Metadata = {
  title: "RecoverAgent | Homepage comparison",
  description: "AI calls and WhatsApp follow-ups for COD orders, abandoned checkouts, and failed deliveries.",
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return <ClarityPreview />;
}
