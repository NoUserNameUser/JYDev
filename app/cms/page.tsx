import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function CmsPage() {
  const strapiUrl = process.env.STRAPI_PUBLIC_URL ?? process.env.STRAPI_URL ?? "http://127.0.0.1:1337";
  redirect(new URL("/admin", strapiUrl).toString());
}
