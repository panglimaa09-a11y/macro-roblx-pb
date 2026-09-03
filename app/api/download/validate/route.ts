import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const url = body?.url;
  if (typeof url !== "string") return NextResponse.json({ ok: false, error: "URL is required" }, { status: 400 });

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    return NextResponse.json({
      ok: true,
      domain: parsed.hostname,
      valid: true,
      message: "URL validated. Connect this endpoint to your downloader/session service."
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid URL" }, { status: 400 });
  }
}