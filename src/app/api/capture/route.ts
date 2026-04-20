import { NextResponse } from "next/server";
import { captureWebsite } from "@/lib/capture";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: string; presetId?: string };
    const rawUrl = body.url?.trim();
    const presetId = body.presetId?.trim();

    if (!rawUrl || !presetId) {
      return NextResponse.json({ error: "URL and preset are required." }, { status: 400 });
    }

    const normalizedUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

    try {
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Please enter a valid website URL." }, { status: 400 });
    }

    const result = await captureWebsite({ url: normalizedUrl, presetId });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Capture failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
