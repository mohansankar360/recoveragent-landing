import { LeadCaptureForm } from "@/components/landing/LeadCaptureForm";
import { SITE_NAME } from "@/lib/site-metadata";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Get your free demo`,
  description:
    "Share your details to continue to Recover Agent with your demo form prefilled.",
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
    <main className="lead-capture-page">
      <LeadCaptureForm />
    </main>
  );
}
