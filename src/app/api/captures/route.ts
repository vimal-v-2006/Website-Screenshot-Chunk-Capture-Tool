import { NextResponse } from "next/server";
import { clearStoredCaptures } from "@/lib/capture";

export async function DELETE() {
  try {
    await clearStoredCaptures();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to clear captures.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
