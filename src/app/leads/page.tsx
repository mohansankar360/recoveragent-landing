import type { Metadata } from "next";
import { LeadsLanding } from "@/components/leads/LeadsLanding";
import { SITE_NAME } from "@/lib/site-metadata";
import { siteUrl } from "@/lib/site-url";

// Paid-traffic landing page for Meta ads. Kept out of search and the sitemap.
export const metadata: Metadata = {
  title: `AI Voice Agent for COD, Carts & NDR — ${SITE_NAME}`,
  description:
    "An AI voice agent that calls your buyers to confirm COD orders, recover abandoned checkouts and reschedule failed deliveries. Hear a real call and book a free demo.",
  alternates: {
    canonical: `${siteUrl}/leads`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LeadsPage() {
  return <LeadsLanding />;
}
