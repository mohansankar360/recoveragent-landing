"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalEmbed } from "@/components/calendar/CalEmbed";
import type { DemoFormData } from "@/lib/demo-booking";
import { readDemoBookingSession } from "@/lib/demo-booking-session";

export function CalendarPageClient() {
  const [prefill, setPrefill] = useState<DemoFormData | null | undefined>(
    undefined
  );

  useEffect(() => {
    setPrefill(readDemoBookingSession());
  }, []);

  const isLoading = prefill === undefined;

  return (
    <main className="calendar-page">
      <header className="calendar-header">
        <div className="wrap calendar-header-inner">
          <Link href="/" className="calendar-brand">
            Recover Agent
          </Link>
          <p className="calendar-header-copy">
            Pick a slot for your live product demo.
          </p>
        </div>
      </header>

      <section className="calendar-body">
        <div className="wrap">
          {!isLoading && prefill && (
            <p className="calendar-prefill-note" role="status">
              Hi {prefill.name.split(/\s+/)[0]} — your details are prefilled.
              Choose a time that works for you.
            </p>
          )}

          <div className="calendar-embed-shell">
            {isLoading ? (
              <p className="calendar-loading" role="status">
                Loading calendar…
              </p>
            ) : (
              <CalEmbed prefill={prefill} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
