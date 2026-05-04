import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { env } from "@/config/env";

type RevalidatePayload = {
  secret?: string;
  tag?: string;
  path?: string;
};

function isAllowedPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//");
}

export async function POST(request: Request) {
  if (!env.revalidateSecret && !env.cmsWebhookSecret) {
    return NextResponse.json({ error: "Revalidation is not configured." }, { status: 500 });
  }

  let payload: RevalidatePayload;
  try {
    payload = (await request.json()) as RevalidatePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const secret = request.headers.get("x-revalidate-secret") ?? payload.secret;
  const validSecrets = [env.revalidateSecret, env.cmsWebhookSecret].filter(Boolean);
  if (!secret || !validSecrets.includes(secret)) {
    return NextResponse.json({ error: "Invalid revalidation secret." }, { status: 401 });
  }

  if (payload.tag) {
    revalidateTag(payload.tag);
  } else if (payload.path && isAllowedPath(payload.path)) {
    revalidatePath(payload.path);
  } else {
    revalidateTag("payload");
  }

  return NextResponse.json({ revalidated: true });
}
