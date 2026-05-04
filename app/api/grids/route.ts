import { NextResponse } from "next/server";

import { listGridSections } from "@/lib/gridCms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const grids = await listGridSections();
    return NextResponse.json({ grids });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load grids." },
      { status: 500 },
    );
  }
}
