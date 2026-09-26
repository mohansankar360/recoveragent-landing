import type { Metadata } from "next";
import { LossCalculator } from "@/components/landing/LossCalculator";
import { PageShell } from "@/components/landing/PageShell";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "RTO & recovery loss calculator for Indian D2C | Recover Agent",
  description:
    "Estimate the monthly revenue your D2C store loses to RTOs and abandoned checkouts.",
  alternates: { canonical: `${siteUrl}/audit` },
};

export default function AuditPage() {
  return (
    <PageShell navLabel="Loss calculator">
      <LossCalculator />
    </PageShell>
  );
}
