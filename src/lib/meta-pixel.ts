import type { AnalyticsEvent } from "./analytics";

declare global {
  interface Window {
    fbq?: MetaFbq;
    _fbq?: MetaFbq;
  }
}

type MetaFbq = {
  (
    command: "init",
    pixelId: string,
    config?: Record<string, unknown>
  ): void;
  (
    command: "track",
    eventName: string,
    params?: Record<string, unknown>,
    options?: { eventID?: string }
  ): void;
  (
    command: "trackCustom",
    eventName: string,
    params?: Record<string, unknown>,
    options?: { eventID?: string }
  ): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded?: boolean;
  version?: string;
  push?: MetaFbq;
};

type EventProperties = Record<string, string | number | boolean | undefined>;

type MetaEventMapping =
  | { kind: "standard"; name: string; params?: Record<string, unknown> }
  | { kind: "custom"; name: string; params?: Record<string, unknown> };

export function getMetaPixelId(): string | undefined {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  return pixelId || undefined;
}

export function isMetaPixelEnabled(): boolean {
  return Boolean(getMetaPixelId());
}

export function generateMetaEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const FBC_STORAGE_KEY = "ra_fbc";
// Meta keeps the click id for 90 days; match that for the fallback copy.
const FBC_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Remembers an ad click (?fbclid=) in fbc format. The pixel sets the _fbc
 * cookie itself, but this copy survives when the pixel loads late or is blocked.
 */
export function captureMetaClickId(): void {
  if (typeof window === "undefined") return;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return;
  try {
    localStorage.setItem(
      FBC_STORAGE_KEY,
      JSON.stringify({ fbc: `fb.1.${Date.now()}.${fbclid}`, at: Date.now() })
    );
  } catch {
    // Storage blocked: the _fbc cookie is still used when present.
  }
}

/** Browser ids that let Meta match server events to the ad click. */
export function getMetaBrowserIds(): { fbc?: string; fbp?: string } {
  if (typeof window === "undefined") return {};
  let fbc = readCookie("_fbc");
  if (!fbc) {
    try {
      const stored = JSON.parse(localStorage.getItem(FBC_STORAGE_KEY) ?? "null") as
        | { fbc?: string; at?: number }
        | null;
      if (stored?.fbc && stored.at && Date.now() - stored.at < FBC_MAX_AGE_MS) fbc = stored.fbc;
    } catch {
      // Ignore unreadable storage.
    }
  }
  const fbp = readCookie("_fbp");
  return { ...(fbc ? { fbc } : {}), ...(fbp ? { fbp } : {}) };
}

function getFbq(): MetaFbq | undefined {
  if (typeof window === "undefined") return undefined;
  return window.fbq;
}

function mapAnalyticsEventToMeta(
  event: AnalyticsEvent,
  properties?: EventProperties
): MetaEventMapping | null {
  // Must match the server event name in /api/demo-lead so Meta deduplicates.
  if (
    (event === "demo_form_submitted" || event === "lead_form_submitted") &&
    properties?.qualifies === false
  ) {
    return {
      kind: "custom",
      name: "LowVolumeLead",
      params: {
        // Both forms post to /api/demo-lead, which reports content_name "demo_booking".
        content_name: "demo_booking",
        ...(properties.monthly_orders ? { monthly_orders: properties.monthly_orders } : {}),
      },
    };
  }

  switch (event) {
    case "demo_form_submitted":
      return {
        kind: "standard",
        name: "Lead",
        params: {
          content_name: "demo_booking",
          ...(properties?.monthly_orders
            ? { monthly_orders: properties.monthly_orders }
            : {}),
        },
      };
    case "demo_scheduled":
      return {
        kind: "standard",
        name: "Schedule",
        params: {
          content_name: "demo_booking",
          ...(properties?.start_time
            ? { start_time: properties.start_time }
            : {}),
        },
      };
    case "lead_form_submitted":
      return {
        kind: "standard",
        name: "Lead",
        params: {
          content_name: properties?.product === "whatsapp" ? "whatsapp_onboarding" : "demo_booking",
          ...(properties?.product === "whatsapp" ? { value: 999, currency: "INR" } : {}),
          ...(properties?.monthly_orders
            ? { monthly_orders: properties.monthly_orders }
            : {}),
        },
      };
    case "lead_form_started":
      return {
        kind: "custom",
        name: "LeadFormStarted",
        params: { content_name: "lead_capture" },
      };
    case "demo_form_started":
      return {
        kind: "custom",
        name: "DemoFormStarted",
        params: { content_name: "demo_booking" },
      };
    case "pricing_viewed":
      return {
        kind: "standard",
        name: "ViewContent",
        params: {
          content_name: "pricing",
          ...(properties?.source ? { source: properties.source } : {}),
        },
      };
    case "calculator_started":
      return {
        kind: "custom",
        name: "CalculatorStarted",
      };
    case "calculator_completed":
      return {
        kind: "custom",
        name: "CalculatorCompleted",
        params: properties,
      };
    case "calculator_cta_clicked":
      return {
        kind: "custom",
        name: "CalculatorCTA",
        params: properties,
      };
    case "sticky_cta_clicked":
      return {
        kind: "custom",
        name: "StickyCTA",
        params: properties,
      };
    case "workflow_step_clicked":
      return {
        kind: "custom",
        name: "WorkflowStep",
        params: properties,
      };
    case "ai_demo_played":
      return {
        kind: "custom",
        name: "AIDemoPlayed",
      };
    case "faq_opened":
      return {
        kind: "custom",
        name: "FAQOpened",
        params: properties,
      };
    case "exit_intent_shown":
      return {
        kind: "custom",
        name: "ExitIntentShown",
      };
    case "exit_intent_cta_clicked":
      return {
        kind: "standard",
        name: "Lead",
        params: { content_name: "exit_intent" },
      };
    case "hero_demo_click":
      return {
        kind: "custom",
        name: "HeroDemoClick",
      };
    case "hero_video_play":
      return {
        kind: "custom",
        name: "HeroVideoPlay",
      };
    default:
      return null;
  }
}

export function trackMetaEvent(
  event: AnalyticsEvent,
  properties?: EventProperties
): void {
  if (!isMetaPixelEnabled()) return;

  const fbq = getFbq();
  if (!fbq) return;

  const mapping = mapAnalyticsEventToMeta(event, properties);
  if (!mapping) return;

  const options =
    typeof properties?.event_id === "string"
      ? { eventID: properties.event_id }
      : undefined;

  if (mapping.kind === "standard") {
    fbq("track", mapping.name, mapping.params, options);
    return;
  }

  fbq("trackCustom", mapping.name, mapping.params, options);
}

export function trackMetaPageView(path?: string): void {
  if (!isMetaPixelEnabled()) return;

  const fbq = getFbq();
  if (!fbq) return;

  fbq("track", "PageView", path ? { page_path: path } : undefined);
}
