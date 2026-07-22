import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { parseInquiry } from "@/features/inquiries/inquirySchema";
import { getPayloadClient } from "@/lib/payload/client";
import { notifyTelegramInquiry } from "@/features/inquiries/telegram.server";

export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const recentSubmissions = new Map<string, number[]>();

function isRateLimited(clientKey: string) {
  const now = Date.now();
  const timestamps = (recentSubmissions.get(clientKey) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (timestamps.length >= RATE_LIMIT_MAX) {
    recentSubmissions.set(clientKey, timestamps);
    return true;
  }

  timestamps.push(now);
  recentSubmissions.set(clientKey, timestamps);

  // Keep the map from growing unbounded under scanning traffic.
  if (recentSubmissions.size > 5000) {
    for (const [key, values] of recentSubmissions) {
      if (values.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
        recentSubmissions.delete(key);
      }
    }
  }

  return false;
}

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);

  // Honeypot: pretend success so bots don't learn they were filtered.
  if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
    return NextResponse.json({ ok: true });
  }

  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: "Too many inquiries in a short time. Please try again later." },
      { status: 429 },
    );
  }

  const result = parseInquiry(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const payload = await getPayloadClient();
    await payload.create({
      collection: "inquiries",
      data: result.data,
      overrideAccess: false,
    });
  } catch (error) {
    console.error("[inquiries] failed to save inquiry:", error);
    return NextResponse.json(
      { error: "Unable to submit your inquiry right now. Please try again later." },
      { status: 500 },
    );
  }

  try {
    await notifyTelegramInquiry(result.data);
  } catch (error) {
    console.error("[inquiries] saved inquiry but failed to send Telegram notification:", error);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
