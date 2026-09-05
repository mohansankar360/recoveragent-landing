import { sendMetaServerEvent } from "@/lib/meta-conversions-api";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const metaEventId = getMetaEventId(body);
  if (!metaEventId) {
    return Response.json({ ok: false, error: "Missing event id" }, { status: 400 });
  }

  const phone = getOptionalString(body, "phone");
  const name = getOptionalString(body, "name");
  const startTime = getOptionalString(body, "startTime");

  await sendMetaServerEvent({
    eventName: "Schedule",
    eventId: metaEventId,
    eventSourceUrl: request.headers.get("referer") ?? undefined,
    clientIpAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      undefined,
    clientUserAgent: request.headers.get("user-agent") ?? undefined,
    phone,
    firstName: name?.split(/\s+/)[0],
    customData: {
      content_name: "demo_booking",
      ...(startTime ? { start_time: startTime } : {}),
    },
  });

  return Response.json({ ok: true });
}

function getMetaEventId(body: unknown): string | undefined {
  if (!body || typeof body !== "object" || !("metaEventId" in body)) {
    return undefined;
  }

  const metaEventId = (body as { metaEventId?: unknown }).metaEventId;
  return typeof metaEventId === "string" && metaEventId.trim().length > 0
    ? metaEventId.trim()
    : undefined;
}

function getOptionalString(body: unknown, key: string): string | undefined {
  if (!body || typeof body !== "object" || !(key in body)) return undefined;
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}
