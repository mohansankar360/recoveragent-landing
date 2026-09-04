import { createHash } from "crypto";

type MetaServerEventParams = {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  phone?: string;
  firstName?: string;
  customData?: Record<string, string | number>;
};

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizePhoneForMetaHash(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function getMetaServerConfig():
  | { pixelId: string; accessToken: string }
  | undefined {
  const pixelId =
    process.env.META_PIXEL_ID?.trim() ||
    process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();

  if (!pixelId || !accessToken) return undefined;
  return { pixelId, accessToken };
}

export async function sendMetaServerEvent(
  params: MetaServerEventParams
): Promise<void> {
  const config = getMetaServerConfig();
  if (!config) return;

  const userData: Record<string, string> = {};

  if (params.phone) {
    userData.ph = sha256(normalizePhoneForMetaHash(params.phone));
  }

  if (params.firstName) {
    userData.fn = sha256(params.firstName.trim().toLowerCase());
  }

  if (params.clientIpAddress) {
    userData.client_ip_address = params.clientIpAddress;
  }

  if (params.clientUserAgent) {
    userData.client_user_agent = params.clientUserAgent;
  }

  const payload = {
    data: [
      {
        event_name: params.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        action_source: "website",
        event_source_url: params.eventSourceUrl,
        user_data: userData,
        custom_data: params.customData,
      },
    ],
  };

  const url = `https://graph.facebook.com/v21.0/${config.pixelId}/events?access_token=${encodeURIComponent(config.accessToken)}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[meta-capi] event failed", response.status, detail);
    }
  } catch (error) {
    console.error("[meta-capi] event error", error);
  }
}
