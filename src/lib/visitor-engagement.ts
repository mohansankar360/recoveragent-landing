import { getClarityIds } from "./clarity";

/** Sent with every lead so the CRM shows how engaged the visitor was. */
export interface LeadEngagement {
  visitorId: string;
  visitCount: number;
  firstSeenAt: string;
  clarityUserId?: string;
  claritySessionId?: string;
  landingPage: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  pagePath: string;
  scrollDepthPercent: number;
  activeTimeSeconds: number;
  pagesViewed: number;
}

const VISITOR_KEY = "ra_visitor";
const SESSION_KEY = "ra_session";
// A visitor counts as active for this long after their last interaction.
const IDLE_AFTER_MS = 30_000;

interface StoredVisitor {
  id: string;
  firstSeenAt: string;
  visits: number;
}

interface StoredSession {
  landingPage: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  activeTimeSeconds: number;
  pages: string[];
}

let started = false;
let visitor: StoredVisitor | null = null;
let session: StoredSession | null = null;
let lastInteraction = 0;
const scrollDepthByPath = new Map<string, number>();

function readJson<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(storage: Storage, key: string, value: unknown): void {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or blocked storage: keep tracking in memory only.
  }
}

function safeStorage(kind: "localStorage" | "sessionStorage"): Storage | null {
  try {
    return window[kind];
  } catch {
    return null;
  }
}

function persistSession(): void {
  const store = safeStorage("sessionStorage");
  if (store && session) writeJson(store, SESSION_KEY, session);
}

function currentScrollDepth(): number {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 100;
  return Math.min(100, Math.round((window.scrollY / scrollable) * 100));
}

function recordScroll(): void {
  const path = window.location.pathname;
  const depth = currentScrollDepth();
  if (depth > (scrollDepthByPath.get(path) ?? 0)) {
    scrollDepthByPath.set(path, depth);
  }
}

function markActive(): void {
  lastInteraction = Date.now();
}

/** Call on every route change; safe to call repeatedly. */
export function startEngagementTracking(): void {
  if (typeof window === "undefined") return;

  if (!started) {
    started = true;
    const local = safeStorage("localStorage");
    const sessionStore = safeStorage("sessionStorage");

    session = sessionStore ? readJson<StoredSession>(sessionStore, SESSION_KEY) : null;
    visitor = local ? readJson<StoredVisitor>(local, VISITOR_KEY) : null;

    const isNewSession = !session;
    if (!visitor) {
      visitor = {
        id: crypto.randomUUID(),
        firstSeenAt: new Date().toISOString(),
        visits: 0,
      };
    }
    if (isNewSession) {
      const params = new URLSearchParams(window.location.search);
      visitor.visits += 1;
      session = {
        landingPage: window.location.pathname + window.location.search,
        referrer: document.referrer || undefined,
        utmSource: params.get("utm_source") ?? undefined,
        utmMedium: params.get("utm_medium") ?? undefined,
        utmCampaign: params.get("utm_campaign") ?? undefined,
        activeTimeSeconds: 0,
        pages: [],
      };
    }
    if (local) writeJson(local, VISITOR_KEY, visitor);

    markActive();
    for (const type of ["pointerdown", "pointermove", "keydown", "touchstart", "wheel"]) {
      window.addEventListener(type, markActive, { passive: true });
    }
    window.addEventListener(
      "scroll",
      () => {
        markActive();
        recordScroll();
      },
      { passive: true }
    );

    window.setInterval(() => {
      if (!session || document.visibilityState !== "visible") return;
      if (Date.now() - lastInteraction > IDLE_AFTER_MS) return;
      session.activeTimeSeconds += 1;
      if (session.activeTimeSeconds % 5 === 0) persistSession();
    }, 1000);
    window.addEventListener("pagehide", persistSession);
  }

  const path = window.location.pathname;
  if (session && !session.pages.includes(path)) {
    session.pages.push(path);
    persistSession();
  }
  recordScroll();
}

export function getEngagementSnapshot(): LeadEngagement | undefined {
  if (typeof window === "undefined" || !visitor || !session) return undefined;
  recordScroll();
  persistSession();
  const { userId, sessionId } = getClarityIds();
  return {
    visitorId: visitor.id,
    visitCount: visitor.visits,
    firstSeenAt: visitor.firstSeenAt,
    clarityUserId: userId,
    claritySessionId: sessionId,
    landingPage: session.landingPage,
    referrer: session.referrer,
    utmSource: session.utmSource,
    utmMedium: session.utmMedium,
    utmCampaign: session.utmCampaign,
    pagePath: window.location.pathname,
    scrollDepthPercent: scrollDepthByPath.get(window.location.pathname) ?? 0,
    activeTimeSeconds: session.activeTimeSeconds,
    pagesViewed: session.pages.length,
  };
}
