import { redirect } from "next/navigation";

import { env } from "@/config/env";

export const dynamic = "force-dynamic";

export default function CmsPage() {
  redirect(new URL("/admin", env.strapiPublicUrl).toString());
}
