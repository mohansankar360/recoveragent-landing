"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { CAL_EVENT_LINK } from "@/lib/constants";
import {
  buildDemoEmbedConfig,
  normalizeWhatsAppNumber,
  type DemoFormData,
} from "@/lib/demo-booking";
import { clearDemoBookingSession } from "@/lib/demo-booking-session";
import { generateMetaEventId } from "@/lib/meta-pixel";

type CalEmbedProps = {
  prefill?: DemoFormData | null;
};

export function CalEmbed({ prefill }: CalEmbedProps) {
  useEffect(() => {
    let cancelled = false;
    let removeListener: (() => void) | undefined;

    (async () => {
      const cal = await getCalApi();
      if (cancelled) return;

      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
      });

      const onBookingSuccess = (event: {
        detail: { data: { startTime?: string; title?: string } };
      }) => {
        const eventId = generateMetaEventId();
        const startTime = event.detail.data.startTime;

        trackEvent("demo_scheduled", {
          event_id: eventId,
          ...(startTime ? { start_time: startTime } : {}),
        });

        void fetch("/api/demo-scheduled", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            metaEventId: eventId,
            phone: prefill ? normalizeWhatsAppNumber(prefill.whatsapp) : undefined,
            email: prefill?.email.trim(),
            name: prefill?.name.trim(),
            startTime,
          }),
        });

        clearDemoBookingSession();
      };

      cal("on", {
        action: "bookingSuccessfulV2",
        callback: onBookingSuccess,
      });

      removeListener = () => {
        cal("off", {
          action: "bookingSuccessfulV2",
          callback: onBookingSuccess,
        });
      };
    })();

    return () => {
      cancelled = true;
      removeListener?.();
    };
  }, [prefill]);

  const config = prefill ? buildDemoEmbedConfig(prefill) : undefined;

  return (
    <Cal
      calLink={CAL_EVENT_LINK}
      style={{ width: "100%", minHeight: "680px", overflow: "auto" }}
      config={config}
    />
  );
}
