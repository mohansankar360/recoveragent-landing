import type { WebsiteDemoLead } from "./demo-crm";

export interface WhatsAppLead {
  name: string;
  whatsapp: string;
  email: string;
  storeUrl: string;
  storePlatform: "shopify" | "woocommerce";
}

export function isValidWhatsAppLead(value: unknown): value is WhatsAppLead {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  if (typeof data.name !== "string" || !data.name.trim() || data.name.length > 120) return false;
  if (typeof data.whatsapp !== "string" || !/^[6-9]\d{9}$/.test(data.whatsapp)) return false;
  if (typeof data.email !== "string" || data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return false;
  if (data.storePlatform !== "shopify" && data.storePlatform !== "woocommerce") return false;
  if (typeof data.storeUrl !== "string" || data.storeUrl.length > 500) return false;
  try {
    const url = new URL(/^https?:\/\//i.test(data.storeUrl) ? data.storeUrl : `https://${data.storeUrl}`);
    return ["https:", "http:"].includes(url.protocol) && url.hostname.includes(".") && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function buildWhatsAppLead(data: WhatsAppLead): WebsiteDemoLead {
  return {
    source: "recover-agent-whatsapp-landing",
    name: data.name.trim(),
    phone: `+91${data.whatsapp}`,
    email: data.email.trim(),
    storeUrl: data.storeUrl.trim(),
    storePlatform: data.storePlatform === "shopify" ? "Shopify" : "WooCommerce",
    storePlatformValue: data.storePlatform,
    monthlyOrders: "Not collected",
    monthlyOrdersValue: "",
    preferredLanguage: "Not collected",
    preferredLanguageValue: "",
    qualifiesForCalendar: false,
    calBookingUrl: "",
    submittedAt: new Date().toISOString(),
  };
}
