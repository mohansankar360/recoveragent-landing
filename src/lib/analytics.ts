import { trackMetaEvent, trackMetaPageView } from "./meta-pixel";

export type AnalyticsEvent =
  | "hero_demo_click"
  | "hero_video_play"
  | "calculator_started"
  | "calculator_completed"
  | "calculator_cta_clicked"
  | "workflow_step_clicked"
  | "ai_demo_played"
  | "pricing_viewed"
  | "faq_opened"
  | "demo_form_started"
  | "demo_form_submitted"
  | "sticky_cta_clicked"
  | "exit_intent_shown"
  | "exit_intent_cta_clicked";

type EventProperties = Record<string, string | number | boolean | undefined>;

/**
 * Analytics abstraction. Wire to your provider (GA4, Mixpanel, etc.) here.
 */
export function trackEvent(
  event: AnalyticsEvent,
  properties?: EventProperties
): void {
  if (typeof window === "undefined") return;

  // eslint-disable-next-line no-console
  console.debug("[analytics]", event, properties);

  trackMetaEvent(event, properties);
}

export function trackPageView(path: string): void {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line no-console
  console.debug("[analytics] page_view", path);

  trackMetaPageView(path);
}
