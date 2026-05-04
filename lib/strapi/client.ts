import { env } from "@/config/env";

import type { StrapiErrorResponse, StrapiFetchOptions } from "./types";

export class StrapiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly path: string,
  ) {
    super(message);
    this.name = "StrapiRequestError";
  }
}

export function getStrapiUrl(path: string, baseUrl = env.strapiUrl) {
  return new URL(path, baseUrl).toString();
}

export async function strapiFetch<T>(path: string, options: StrapiFetchOptions = {}): Promise<T> {
  const response = await fetch(getStrapiUrl(path), {
    cache: options.cache,
    next: options.next,
    headers: {
      Accept: "application/json",
      ...(options.token || env.strapiApiToken
        ? { Authorization: `Bearer ${options.token ?? env.strapiApiToken}` }
        : {}),
    },
  });

  if (!response.ok) {
    let message = `Strapi request failed with status ${response.status}`;
    try {
      const payload = (await response.json()) as StrapiErrorResponse;
      message = payload.error?.message ?? message;
    } catch {
      // Keep the generic status-based error.
    }
    throw new StrapiRequestError(message, response.status, path);
  }

  return (await response.json()) as T;
}
