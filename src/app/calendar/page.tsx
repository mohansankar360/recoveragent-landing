import type { Metadata } from "next";
import { CalendarPageClient } from "@/components/calendar/CalendarPageClient";

export const metadata: Metadata = {
  title: "Book a demo — Recover Agent",
  description:
    "Pick a time for your live Recover Agent product demo. See COD verification and RTO recovery on your numbers.",
  robots: { index: false, follow: true },
};

export default function CalendarPage() {
  return <CalendarPageClient />;
}
