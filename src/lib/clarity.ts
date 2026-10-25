declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

type ClarityFn = {
  (command: "event", eventName: string): void;
  (command: "set", key: string, value: string | string[]): void;
  (
    command: "identify",
    customId: string,
    customSessionId?: string,
    customPageId?: string,
    friendlyName?: string
  ): void;
  (command: "upgrade", reason: string): void;
  q?: unknown[][];
};

// Public project ID from clarity.microsoft.com; env var overrides it per deploy.
const DEFAULT_CLARITY_PROJECT_ID = "z3dapsem11";

export function getClarityProjectId(): string {
  return (
    process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() ||
    DEFAULT_CLARITY_PROJECT_ID
  );
}

export function buildClaritySnippet(projectId: string): string {
  return `
(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${projectId}");
`.trim();
}

function clarity(): ClarityFn | undefined {
  if (typeof window === "undefined") return undefined;
  return window.clarity;
}

export function trackClarityEvent(eventName: string): void {
  clarity()?.("event", eventName);
}

export function setClarityTag(key: string, value: string): void {
  clarity()?.("set", key, value);
}

/** Links the current recording to a lead so it can be found from the CRM. */
export function identifyClarityLead(leadId: string, friendlyName?: string): void {
  const fn = clarity();
  if (!fn) return;
  fn("identify", leadId, undefined, undefined, friendlyName);
  fn("set", "lead_id", leadId);
  // Keeps the full recording even if Clarity would otherwise sample it out.
  fn("upgrade", "lead_submitted");
}

/** Clarity stores its user ID in `_clck` and session ID in `_clsk` ("id^..."). */
export function getClarityIds(): { userId?: string; sessionId?: string } {
  if (typeof document === "undefined") return {};
  const read = (name: string) => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    const value = match ? decodeURIComponent(match[1]).split(/[\^|]/)[0] : "";
    return value || undefined;
  };
  return { userId: read("_clck"), sessionId: read("_clsk") };
}
