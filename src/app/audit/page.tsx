import type { Metadata } from "next";
import { PageShell } from "@/components/landing/PageShell";
import { CaseStudySection, LossSection } from "@/components/landing/TrialHomepage";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "RTO & recovery loss calculator for Indian D2C | Recover Agent",
  description:
    "Estimate the monthly revenue your D2C store loses to RTOs and abandoned checkouts.",
  alternates: { canonical: `${siteUrl}/audit` },
};

export default function AuditPage() {
  return (
    <PageShell
      navLabel="RTO calculator"
      title="What is RTO costing your store?"
      description="Move the sliders to see your monthly RTO bill, and what a call before dispatch could save."
    >
      <LossSection />
      <CaseStudySection />
    </PageShell>
  );
}
