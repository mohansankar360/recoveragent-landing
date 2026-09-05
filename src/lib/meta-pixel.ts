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

function getFbq(): MetaFbq | undefined {
  if (typeof window === "undefined") return undefined;
  return window.fbq;
}

function mapAnalyticsEventToMeta(
  event: AnalyticsEvent,
  properties?: EventProperties
): MetaEventMapping | null {
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
