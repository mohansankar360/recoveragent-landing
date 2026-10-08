"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CalEmbed } from "@/components/calendar/CalEmbed";
import type { DemoFormData } from "@/lib/demo-booking";
import { readDemoBookingSession } from "@/lib/demo-booking-session";
import { DEMO_URL } from '@/lib/constants';

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
            <Image src="/recover-agent-logo-transparent.png" alt="Recover Agent" width={174} height={44} priority />
          </Link>
          <p className="calendar-header-copy">
            Pick a slot for your live product demo.
          </p>
        </div>
      </header>

      <section className="calendar-body">
        <div className="wrap">
          <div className="calendar-intro">
            <Link href="/book-demo" className="calendar-back">← Back to demo details</Link>
            <p className="eyebrow">Your next step</p>
            <h1>See recovery in action.</h1>
            <p>Choose a time for your 30-minute walkthrough of COD confirmation, checkout recovery, and NDR follow-up.</p>
          </div>
          <p className="calendar-fallback">Calendar not loading? <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">Open scheduling in a new tab</a> or <a href="mailto:hello@recoveragent.ai">contact us</a>.</p>
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
