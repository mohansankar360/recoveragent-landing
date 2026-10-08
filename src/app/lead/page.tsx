import { LeadCapturePage } from "@/components/landing/LeadCapturePage";
import { SITE_NAME } from "@/lib/site-metadata";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Reduce RTO. Recover More Revenue.`,
  description:
    "Get a free Recover Agent demo. Share your store details and continue to the booking page with your info pre-filled.",
  alternates: {
    canonical: `${siteUrl}/lead`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LeadPage() {
  return (
    <main>
      <LeadCapturePage />
    </main>
  );
}
